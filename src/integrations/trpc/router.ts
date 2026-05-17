import { createTRPCRouter, publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const healthRouter = {
  ping: publicProcedure.query(() => ({ ok: true })),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  health: healthRouter,
})
export type TRPCRouter = typeof trpcRouter
