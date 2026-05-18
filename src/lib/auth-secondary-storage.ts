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

function logStorageFailure(
  operation: StorageOperation,
  key: string | null,
  error: unknown,
): void {
  reportRedisFailure('auth', operation, error, {
    keyPresent: Boolean(key),
  })
}

export const authSecondaryStorage: AuthSecondaryStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return await redisAuthStorage.get(key)
    } catch (error) {
      logStorageFailure('get', key, error)
      return null
    }
  },

  async getAndDelete(key: string): Promise<unknown> {
    try {
      return await redisAuthStorage.getAndDelete(key)
    } catch (error) {
      logStorageFailure('getAndDelete', key, error)
      return null
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      await redisAuthStorage.set(key, value, ttl)
    } catch (error) {
      logStorageFailure('set', key, error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      await redisAuthStorage.delete(key)
    } catch (error) {
      logStorageFailure('delete', key, error)
    }
  },

  async listKeys(): Promise<string[]> {
    try {
      return await redisAuthStorage.listKeys()
    } catch (error) {
      logStorageFailure('listKeys', null, error)
      return []
    }
  },

  async clear(): Promise<void> {
    try {
      await redisAuthStorage.clear()
    } catch (error) {
      logStorageFailure('clear', null, error)
    }
  },
}
