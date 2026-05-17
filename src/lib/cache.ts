import { createHash } from 'node:crypto'
import superjson from 'superjson'
import { redis } from '#/lib/redis'

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

  try {
    cachedValue = await redis.get(key)
  } catch (error) {
    console.warn(`Redis cache read failed for ${key}.`, error)
  }

  if (cachedValue) {
    return superjson.parse<T>(cachedValue)
  }

  const data = await fn()

  try {
    await redis.setex(key, ttl, superjson.stringify(data))
  } catch (error) {
    console.warn(`Redis cache write failed for ${key}.`, error)
  }

  return data
}

export async function invalidate(pattern: string): Promise<void> {
  const matchPattern = pattern.includes('*') ? pattern : `${pattern}*`
  let cursor = '0'

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
  } catch (error) {
    console.warn(`Redis cache invalidation failed for ${matchPattern}.`, error)
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
