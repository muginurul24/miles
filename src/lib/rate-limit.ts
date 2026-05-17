import { randomUUID } from 'node:crypto'
import { TRPCError } from '@trpc/server'
import { redis } from '#/lib/redis'

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const now = Date.now()
  const windowStart = now - windowMs

  await redis.zremrangebyscore(key, 0, windowStart)
  const count = await redis.zcard(key)

  if (count >= limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Terlalu banyak permintaan. Coba lagi nanti.',
    })
  }

  await redis.zadd(key, now, `${now}-${randomUUID()}`)
  await redis.expire(key, Math.ceil(windowMs / 1000))
}
