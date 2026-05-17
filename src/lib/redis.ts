import Redis from 'ioredis'

declare global {
  var __redis: Redis | undefined
}

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
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__redis = redis
}
