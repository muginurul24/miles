import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { adminOverviewRepo } from '#/server/repositories/admin-overview.repo'

import type { TRPCContext } from '#/integrations/trpc/init'

vi.mock('#/server/repositories/admin-overview.repo', () => ({
  adminOverviewRepo: {
    getOverview: vi.fn(),
  },
}))

const mockedOverviewRepo = vi.mocked(adminOverviewRepo)

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

describe('admin overview router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return overview when user is admin', async () => {
    const overview = {
      stats: {
        totalCards: 12,
        totalArticles: 20,
        activeSubscribers: 3,
        totalInquiries: 2,
        newInquiries: 1,
        premiumArticles: 7,
        totalApplications: 4,
      },
      recentInquiries: [
        {
          id: 'inquiry-id',
          name: 'Rafi',
          email: 'rafi@example.com',
          status: 'new',
          packageName: 'Card Audit',
          createdAt: new Date('2026-05-17T09:00:00.000Z'),
        },
      ],
      applicationTrend: [
        {
          date: '2026-05-17',
          applications: 4,
        },
      ],
      articleCategories: [
        {
          category: 'guides',
          articles: 8,
        },
      ],
      membershipDistribution: [
        {
          tier: 'free',
          users: 3,
        },
      ],
    }
    mockedOverviewRepo.getOverview.mockResolvedValue(overview)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.overview()).resolves.toEqual(overview)
    expect(mockedOverviewRepo.getOverview).toHaveBeenCalledOnce()
  })

  it('should reject overview when user is not admin', async () => {
    const caller = trpcRouter.createCaller(createContext('user'))

    await expect(caller.admin.overview()).rejects.toMatchObject({
      code: 'FORBIDDEN',
      message: 'Akses admin diperlukan.',
    })
    expect(mockedOverviewRepo.getOverview).not.toHaveBeenCalled()
  })
})
