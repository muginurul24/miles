import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { adminRepo } from '#/server/repositories/admin.repo'

import type { TRPCContext } from '#/integrations/trpc/init'
import type { AdminArticleRow } from '#/server/repositories/admin.repo'

vi.mock('#/server/repositories/admin.repo', () => ({
  adminRepo: {
    articleExists: vi.fn(),
    createArticle: vi.fn(),
    deleteArticle: vi.fn(),
    getOverview: vi.fn(),
    listArticles: vi.fn(),
    updateArticle: vi.fn(),
  },
}))

const mockedAdminRepo = vi.mocked(adminRepo)

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

const articleInput = {
  id: 'krisflyer-sweet-spot-test',
  title: 'KrisFlyer Sweet Spot untuk Traveler Indonesia',
  excerpt: 'Panduan ringkas untuk redemption KrisFlyer.',
  content: 'Konten editorial lengkap.',
  category: 'Guide',
  subCategory: 'KrisFlyer',
  author: 'JustMiles Editorial',
  imageUrl: '',
  premium: true,
  dealTag: '',
  publishedAt: '2026-05-17T09:00',
}

const articleRow: AdminArticleRow = {
  ...articleInput,
  imageUrl: null,
  dealTag: null,
  publishedAt: new Date('2026-05-17T09:00:00.000Z'),
  updatedAt: new Date('2026-05-17T10:00:00.000Z'),
}
const parsedPublishedAt = new Date(articleInput.publishedAt)

describe('admin articles router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should list articles when user is admin', async () => {
    mockedAdminRepo.listArticles.mockResolvedValue([articleRow])
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.articles()).resolves.toEqual([articleRow])
    expect(mockedAdminRepo.listArticles).toHaveBeenCalledOnce()
  })

  it('should create article when slug is available', async () => {
    mockedAdminRepo.articleExists.mockResolvedValue(false)
    mockedAdminRepo.createArticle.mockResolvedValue(articleRow)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.createArticle(articleInput)).resolves.toEqual(
      articleRow,
    )
    expect(mockedAdminRepo.createArticle).toHaveBeenCalledWith({
      ...articleInput,
      imageUrl: null,
      dealTag: null,
      publishedAt: parsedPublishedAt,
    })
  })

  it('should reject create when slug already exists', async () => {
    mockedAdminRepo.articleExists.mockResolvedValue(true)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(
      caller.admin.createArticle(articleInput),
    ).rejects.toMatchObject({
      code: 'CONFLICT',
      message: 'ID artikel sudah digunakan.',
    })
    expect(mockedAdminRepo.createArticle).not.toHaveBeenCalled()
  })

  it('should update article when article exists', async () => {
    mockedAdminRepo.articleExists.mockResolvedValue(true)
    mockedAdminRepo.updateArticle.mockResolvedValue(articleRow)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.updateArticle(articleInput)).resolves.toEqual(
      articleRow,
    )
    expect(mockedAdminRepo.updateArticle).toHaveBeenCalledWith({
      ...articleInput,
      imageUrl: null,
      dealTag: null,
      publishedAt: parsedPublishedAt,
    })
  })

  it('should delete article when article exists', async () => {
    mockedAdminRepo.articleExists.mockResolvedValue(true)
    mockedAdminRepo.deleteArticle.mockResolvedValue({ id: articleInput.id })
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(
      caller.admin.deleteArticle({ id: articleInput.id }),
    ).resolves.toEqual({ id: articleInput.id })
    expect(mockedAdminRepo.deleteArticle).toHaveBeenCalledWith(articleInput.id)
  })

  it('should reject article procedures when user is not admin', async () => {
    const caller = trpcRouter.createCaller(createContext('user'))

    await expect(caller.admin.articles()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    expect(mockedAdminRepo.listArticles).not.toHaveBeenCalled()
  })
})
