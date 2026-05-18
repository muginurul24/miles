import { createTRPCRouter, protectedProcedure, publicProcedure } from './init'
import { adminRouter } from './admin'
import { articlesRouter } from './articles'
import { calculatorRouter } from './calculator'
import { cardsRouter } from './cards'
import { consultingRouter } from './consulting'
import { membershipRouter } from './membership'
import { newsletterRouter } from './newsletter'
import { paymentsRouter } from './payments'

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
    membershipExpiresAt: ctx.user.membershipExpiresAt,
    role: ctx.user.role,
  })),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  health: healthRouter,
  viewer: viewerRouter,
  admin: adminRouter,
  cards: cardsRouter,
  calculator: calculatorRouter,
  articles: articlesRouter,
  membership: membershipRouter,
  payments: paymentsRouter,
  consulting: consultingRouter,
  newsletter: newsletterRouter,
})
export type TRPCRouter = typeof trpcRouter
