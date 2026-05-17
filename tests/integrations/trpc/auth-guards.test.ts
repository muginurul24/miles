import { describe, expect, it } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'

import type { TRPCContext } from '#/integrations/trpc/init'

function createContext(role: 'admin' | 'user' = 'user'): TRPCContext {
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

describe('auth guards', () => {
  it('should reject protected procedures when session is missing', async () => {
    const caller = trpcRouter.createCaller({ session: null })

    await expect(caller.viewer.me()).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Login diperlukan.',
    })
  })

  it('should reject admin procedures when user role is not admin', async () => {
    const caller = trpcRouter.createCaller(createContext('user'))

    await expect(caller.admin.ping()).rejects.toMatchObject({
      code: 'FORBIDDEN',
      message: 'Akses admin diperlukan.',
    })
  })

  it('should allow admin procedures when user role is admin', async () => {
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.ping()).resolves.toEqual({
      ok: true,
      userId: 'user-id',
    })
  })
})
