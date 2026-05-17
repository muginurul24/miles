import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { cardsRepo } from '#/server/repositories/cards.repo'
import { publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const cardSortSchema = z.enum(['name', 'fee_asc', 'fee_desc', 'earning_best'])

const cardsRouter = {
  list: publicProcedure
    .input(
      z
        .object({
          bank: z.string().trim().min(1).optional(),
          partner: z.string().trim().min(1).optional(),
          search: z.string().trim().min(1).optional(),
          sort: cardSortSchema.optional(),
        })
        .optional(),
    )
    .query(({ input }) => cardsRepo.findAll(input)),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().trim().min(1, 'Slug kartu wajib diisi.'),
      }),
    )
    .query(async ({ input }) => {
      const card = await cardsRepo.findBySlug(input.slug)

      if (!card) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kartu tidak ditemukan.',
        })
      }

      return card
    }),

  similar: publicProcedure
    .input(
      z.object({
        slug: z.string().trim().min(1, 'Slug kartu wajib diisi.'),
        limit: z.number().int().min(1).max(6).optional(),
      }),
    )
    .query(({ input }) => cardsRepo.findSimilar(input.slug, input.limit)),

  filters: publicProcedure.query(async () => {
    const [banks, partners] = await Promise.all([
      cardsRepo.getBanks(),
      cardsRepo.getAllPartners(),
    ])

    return { banks, partners }
  }),
} satisfies TRPCRouterRecord

export { cardsRouter }
