import { redisStorage } from '@better-auth/redis-storage'
import { redis, reportRedisFailure } from '#/lib/redis'

type AuthSecondaryStorage = ReturnType<typeof redisStorage>
type StorageOperation =
  | 'clear'
  | 'delete'
  | 'get'
  | 'getAndDelete'
  | 'listKeys'
  | 'set'

const redisAuthStorage = redisStorage({
  client: redis,
  keyPrefix: 'justmiles:auth:',
})

const REDIS_AUTH_STORAGE_RETRY_AFTER_MS = 30_000

let redisAuthStorageDisabledUntil = 0

function logStorageFailure(
  operation: StorageOperation,
  key: string | null,
  error: unknown,
): void {
  redisAuthStorageDisabledUntil = Date.now() + REDIS_AUTH_STORAGE_RETRY_AFTER_MS
  reportRedisFailure('auth', operation, error, {
    keyPresent: Boolean(key),
    retryAfterMs: REDIS_AUTH_STORAGE_RETRY_AFTER_MS,
  })
}

function shouldBypassAuthStorage(): boolean {
  return Date.now() < redisAuthStorageDisabledUntil
}

function markAuthStorageAvailable(): void {
  redisAuthStorageDisabledUntil = 0
}

export const authSecondaryStorage: AuthSecondaryStorage = {
  async get(key: string): Promise<string | null> {
    if (shouldBypassAuthStorage()) {
      return null
    }

    try {
      const value = await redisAuthStorage.get(key)
      markAuthStorageAvailable()
      return value
    } catch (error) {
      logStorageFailure('get', key, error)
      return null
    }
  },

  async getAndDelete(key: string): Promise<unknown> {
    if (shouldBypassAuthStorage()) {
      return null
    }

    try {
      const value = await redisAuthStorage.getAndDelete(key)
      markAuthStorageAvailable()
      return value
    } catch (error) {
      logStorageFailure('getAndDelete', key, error)
      return null
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (shouldBypassAuthStorage()) {
      return
    }

    try {
      await redisAuthStorage.set(key, value, ttl)
      markAuthStorageAvailable()
    } catch (error) {
      logStorageFailure('set', key, error)
    }
  },

  async delete(key: string): Promise<void> {
    if (shouldBypassAuthStorage()) {
      return
    }

    try {
      await redisAuthStorage.delete(key)
      markAuthStorageAvailable()
    } catch (error) {
      logStorageFailure('delete', key, error)
    }
  },

  async listKeys(): Promise<string[]> {
    if (shouldBypassAuthStorage()) {
      return []
    }

    try {
      const keys = await redisAuthStorage.listKeys()
      markAuthStorageAvailable()
      return keys
    } catch (error) {
      logStorageFailure('listKeys', null, error)
      return []
    }
  },

  async clear(): Promise<void> {
    if (shouldBypassAuthStorage()) {
      return
    }

    try {
      await redisAuthStorage.clear()
      markAuthStorageAvailable()
    } catch (error) {
      logStorageFailure('clear', null, error)
    }
  },
}
