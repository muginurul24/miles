import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { articlesRepo } from '#/server/repositories/articles.repo'
import { publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const articleListInputSchema = z
  .object({
    category: z.string().trim().min(1).optional(),
    subCategory: z.string().trim().min(1).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    offset: z.number().int().min(0).optional(),
  })
  .optional()

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
    .query(async ({ input }) => {
      const article = await articlesRepo.findBySlug(input.slug)

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Artikel tidak ditemukan.',
        })
      }

      return article
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
