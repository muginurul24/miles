import { TRPCError } from '@trpc/server'
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from './init'
import { articlesRouter } from './articles'
import { calculatorRouter } from './calculator'
import { cardsRouter } from './cards'
import { consultingRouter } from './consulting'
import { membershipRouter } from './membership'
import { newsletterRouter } from './newsletter'
import {
  adminCardCreateInputSchema,
  adminCardDeleteInputSchema,
  adminCardUpdateInputSchema,
} from '#/lib/schemas/admin-card'
import { adminRepo } from '#/server/repositories/admin.repo'

import type { TRPCRouterRecord } from '@trpc/server'

const healthRouter = {
  ping: publicProcedure.query(() => ({ ok: true })),
} satisfies TRPCRouterRecord

const viewerRouter = {
  me: protectedProcedure.query(({ ctx }) => ({
    id: ctx.user.id,
    email: ctx.user.email,
    name: ctx.user.name,
    membershipTier: ctx.user.membershipTier,
    role: ctx.user.role,
  })),
} satisfies TRPCRouterRecord

const adminRouter = {
  ping: adminProcedure.query(({ ctx }) => ({
    ok: true,
    userId: ctx.user.id,
  })),
  overview: adminProcedure.query(() => adminRepo.getOverview()),
  cards: adminProcedure.query(() => adminRepo.listCards()),
  createCard: adminProcedure
    .input(adminCardCreateInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.cardExists(input.id)

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'ID kartu sudah digunakan.',
        })
      }

      return adminRepo.createCard(input)
    }),
  updateCard: adminProcedure
    .input(adminCardUpdateInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.cardExists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kartu tidak ditemukan.',
        })
      }

      return adminRepo.updateCard(input)
    }),
  deleteCard: adminProcedure
    .input(adminCardDeleteInputSchema)
    .mutation(async ({ input }) => {
      const exists = await adminRepo.cardExists(input.id)

      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kartu tidak ditemukan.',
        })
      }

      return adminRepo.deleteCard(input.id)
    }),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  health: healthRouter,
  viewer: viewerRouter,
  admin: adminRouter,
  cards: cardsRouter,
  calculator: calculatorRouter,
  articles: articlesRouter,
  membership: membershipRouter,
  consulting: consultingRouter,
  newsletter: newsletterRouter,
})
export type TRPCRouter = typeof trpcRouter
