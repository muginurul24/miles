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
