import Redis from 'ioredis'
import { logger } from '#/lib/logger'

declare global {
  var __redis: Redis | undefined
}

type RedisFailureArea = 'auth' | 'cache' | 'rate-limit'

const REDIS_FAILURE_LOG_INTERVAL_MS = 30_000
const lastRedisFailureLogAt = new Map<string, number>()

function getRedisUrl(): string {
  const redisUrl = process.env.REDIS_URL

  if (process.env.NODE_ENV === 'production' && !redisUrl) {
    throw new Error('REDIS_URL is required in production.')
  }

  return redisUrl ?? 'redis://localhost:6379'
}

export const redis =
  globalThis.__redis ||
  new Redis(getRedisUrl(), {
    connectTimeout: 1000,
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__redis = redis
}

export function reportRedisFailure(
  area: RedisFailureArea,
  operation: string,
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  const throttleKey = `${area}:${operation}`
  const now = Date.now()
  const lastLoggedAt = lastRedisFailureLogAt.get(throttleKey) ?? 0

  if (now - lastLoggedAt < REDIS_FAILURE_LOG_INTERVAL_MS) {
    return
  }

  lastRedisFailureLogAt.set(throttleKey, now)
  logger.warn('Redis operation failed', {
    ...context,
    area,
    error,
    operation,
    redisStatus: redis.status,
  })
}
