import { createHash } from 'node:crypto'
import superjson from 'superjson'
import { redis, reportRedisFailure } from '#/lib/redis'

export const DEFAULT_TTL = {
  CARDS_LIST: 3600,
  CARD_DETAIL: 3600,
  ARTICLES_LIST: 300,
  ARTICLE_DETAIL: 600,
  MEMBERSHIP_TIERS: 86400,
  CONSULTING_PACKAGES: 86400,
  CALCULATOR_RESULT: 60,
  STATS: 300,
} as const

const REDIS_CACHE_RETRY_AFTER_MS = 30_000

let redisCacheDisabledUntil = 0

export function cacheHash(value: unknown): string {
  return createHash('sha256')
    .update(stableStringify(value))
    .digest('hex')
    .slice(0, 16)
}

export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  let cachedValue: string | null = null

  if (!shouldBypassRedisCache()) {
    try {
      cachedValue = await redis.get(key)
      markRedisCacheAvailable()
    } catch (error) {
      markRedisCacheUnavailable('read', key, error)
    }
  }

  if (cachedValue) {
    try {
      return superjson.parse<T>(cachedValue)
    } catch (error) {
      reportRedisFailure('cache', 'parse', error, { cacheKey: key })
      await deleteCorruptCacheKey(key)
    }
  }

  const data = await fn()

  if (!shouldBypassRedisCache()) {
    try {
      await redis.setex(key, ttl, superjson.stringify(data))
      markRedisCacheAvailable()
    } catch (error) {
      markRedisCacheUnavailable('write', key, error)
    }
  }

  return data
}

export async function invalidate(pattern: string): Promise<void> {
  const matchPattern = pattern.includes('*') ? pattern : `${pattern}*`
  let cursor = '0'

  if (shouldBypassRedisCache()) {
    return
  }

  try {
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH',
        matchPattern,
        'COUNT',
        100,
      )

      if (keys.length > 0) {
        await redis.del(...keys)
      }

      cursor = nextCursor
    } while (cursor !== '0')

    markRedisCacheAvailable()
  } catch (error) {
    markRedisCacheUnavailable('invalidate', matchPattern, error)
  }
}

function shouldBypassRedisCache(): boolean {
  return Date.now() < redisCacheDisabledUntil
}

function markRedisCacheAvailable(): void {
  redisCacheDisabledUntil = 0
}

function markRedisCacheUnavailable(
  operation: string,
  key: string,
  error: unknown,
): void {
  redisCacheDisabledUntil = Date.now() + REDIS_CACHE_RETRY_AFTER_MS
  reportRedisFailure('cache', operation, error, {
    cacheKey: key,
    failureMode: 'fallback-to-source',
    retryAfterMs: REDIS_CACHE_RETRY_AFTER_MS,
  })
}

async function deleteCorruptCacheKey(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    markRedisCacheUnavailable('delete-corrupt-key', key, error)
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`
  }

  const record = value as Record<string, unknown>
  const entries = Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)

  return `{${entries.join(',')}}`
}
