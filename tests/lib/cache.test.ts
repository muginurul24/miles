import superjson from 'superjson'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cached, invalidate } from '#/lib/cache'

const redisMock = vi.hoisted(() => ({
  del: vi.fn<(...keys: string[]) => Promise<number>>(),
  get: vi.fn<(key: string) => Promise<string | null>>(),
  scan: vi.fn<
    (
      cursor: string,
      matchCommand: 'MATCH',
      pattern: string,
      countCommand: 'COUNT',
      count: number,
    ) => Promise<[string, string[]]>
  >(),
  setex: vi.fn<(key: string, ttl: number, value: string) => Promise<'OK'>>(),
  status: 'wait',
}))

const loggerMock = vi.hoisted(() => ({
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
}))

vi.mock('#/lib/redis', () => ({
  redis: redisMock,
  reportRedisFailure: vi.fn(
    (
      area: string,
      operation: string,
      error: unknown,
      context: Record<string, unknown> = {},
    ) => {
      loggerMock.warn('Redis operation failed', {
        ...context,
        area,
        error,
        operation,
      })
    },
  ),
}))

vi.mock('#/lib/logger', () => ({
  logger: loggerMock,
}))

let now = Date.parse('2026-05-18T08:00:00.000Z')

describe('cached', () => {
  beforeEach(() => {
    now += 60_000
    vi.useFakeTimers()
    vi.setSystemTime(now)
    vi.resetAllMocks()
    redisMock.get.mockResolvedValue(null)
    redisMock.setex.mockResolvedValue('OK')
    redisMock.del.mockResolvedValue(1)
    redisMock.scan.mockResolvedValue(['0', []])
  })

  it('should return cached data when Redis has a valid entry', async () => {
    const source = vi.fn<() => Promise<{ value: string }>>()
    redisMock.get.mockResolvedValueOnce(superjson.stringify({ value: 'hit' }))

    await expect(cached('cards:top', 60, source)).resolves.toEqual({
      value: 'hit',
    })

    expect(source).not.toHaveBeenCalled()
    expect(redisMock.setex).not.toHaveBeenCalled()
  })

  it('should cache source data when Redis misses', async () => {
    const source = vi.fn(async () => ({ value: 'fresh' }))

    await expect(cached('cards:top', 60, source)).resolves.toEqual({
      value: 'fresh',
    })

    expect(source).toHaveBeenCalledTimes(1)
    expect(redisMock.setex).toHaveBeenCalledWith(
      'cards:top',
      60,
      superjson.stringify({ value: 'fresh' }),
    )
  })

  it('should fall back to source data and pause Redis calls when Redis fails', async () => {
    redisMock.get.mockRejectedValueOnce(new Error('redis down'))
    const firstSource = vi.fn(async () => ({ value: 'first' }))
    const secondSource = vi.fn(async () => ({ value: 'second' }))

    await expect(cached('cards:top', 60, firstSource)).resolves.toEqual({
      value: 'first',
    })
    await expect(cached('cards:list', 60, secondSource)).resolves.toEqual({
      value: 'second',
    })

    expect(redisMock.get).toHaveBeenCalledTimes(1)
    expect(redisMock.setex).not.toHaveBeenCalled()
    expect(loggerMock.warn).toHaveBeenCalledTimes(1)
  })

  it('should invalidate matching keys with scan instead of keys', async () => {
    redisMock.scan
      .mockResolvedValueOnce(['1', ['cards:top']])
      .mockResolvedValueOnce(['0', ['cards:list:abc']])

    await invalidate('cards:*')

    expect(redisMock.scan).toHaveBeenNthCalledWith(
      1,
      '0',
      'MATCH',
      'cards:*',
      'COUNT',
      100,
    )
    expect(redisMock.del).toHaveBeenCalledWith('cards:top')
    expect(redisMock.del).toHaveBeenCalledWith('cards:list:abc')
  })
})
