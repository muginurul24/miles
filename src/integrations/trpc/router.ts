import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from './init'

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
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  health: healthRouter,
  viewer: viewerRouter,
  admin: adminRouter,
})
export type TRPCRouter = typeof trpcRouter
