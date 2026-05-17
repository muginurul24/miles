import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { articlesRepo } from '#/server/repositories/articles.repo'
import { publicProcedure } from './init'

import type { Article } from '#/generated/prisma/client'
import type { TRPCRouterRecord } from '@trpc/server'

const articleListInputSchema = z
  .object({
    category: z.string().trim().min(1).optional(),
    subCategory: z.string().trim().min(1).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    offset: z.number().int().min(0).optional(),
  })
  .optional()

interface PremiumAccessUser {
  membershipTier?: string | null
  role?: string | null
}

const premiumTiers = new Set(['plus', 'pro', 'concierge'])

function hasPremiumAccess(user: PremiumAccessUser | undefined): boolean {
  if (!user) {
    return false
  }

  if (user.role === 'admin') {
    return true
  }

  return premiumTiers.has(user.membershipTier ?? 'free')
}

function applyPremiumGate(
  article: Article,
  user: PremiumAccessUser | undefined,
): Article {
  if (!article.premium || hasPremiumAccess(user)) {
    return article
  }

  return { ...article, content: null }
}

const articlesRouter = {
  list: publicProcedure
    .input(articleListInputSchema)
    .query(({ input }) => articlesRepo.findAll(input)),

  latest: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(12).optional() }))
    .query(({ input }) => articlesRepo.getLatest(input.limit)),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().trim().min(1, 'Slug artikel wajib diisi.'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const article = await articlesRepo.findBySlug(input.slug)

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Artikel tidak ditemukan.',
        })
      }

      return applyPremiumGate(article, ctx.session?.user)
    }),

  related: publicProcedure
    .input(
      z.object({
        slug: z.string().trim().min(1, 'Slug artikel wajib diisi.'),
        category: z.string().trim().min(1, 'Kategori artikel wajib diisi.'),
        limit: z.number().int().min(1).max(12).optional(),
      }),
    )
    .query(({ input }) =>
      articlesRepo.findRelated(input.slug, input.category, input.limit),
    ),
} satisfies TRPCRouterRecord

export { articlesRouter }
