import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { adminSubscribersRepo } from '#/server/repositories/admin-subscribers.repo'

import type { TRPCContext } from '#/integrations/trpc/init'
import type { AdminSubscriberRow } from '#/server/repositories/admin-subscribers.repo'

vi.mock('#/server/repositories/admin-subscribers.repo', () => ({
  adminSubscribersRepo: {
    list: vi.fn(),
  },
}))

const mockedSubscribersRepo = vi.mocked(adminSubscribersRepo)

function createContext(role: 'admin' | 'user' = 'admin'): TRPCContext {
  return {
    session: {
      session: {
        id: 'session-id',
        token: 'session-token',
        userId: 'user-id',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: false,
        image: null,
        membershipTier: 'free',
        role,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    },
  }
}

const subscriberRow: AdminSubscriberRow = {
  id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  email: 'rafi@example.com',
  subscribedAt: new Date('2026-05-17T09:00:00.000Z'),
  unsubscribedAt: null,
}

describe('admin subscribers router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should list subscribers when user is admin', async () => {
    mockedSubscribersRepo.list.mockResolvedValue([subscriberRow])
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.subscribers()).resolves.toEqual([subscriberRow])
    expect(mockedSubscribersRepo.list).toHaveBeenCalledOnce()
  })

  it('should reject subscribers when user is not admin', async () => {
    const caller = trpcRouter.createCaller(createContext('user'))

    await expect(caller.admin.subscribers()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    expect(mockedSubscribersRepo.list).not.toHaveBeenCalled()
  })
})
