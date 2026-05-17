import { membershipRepo } from '#/server/repositories/membership.repo'
import { publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const membershipRouter = {
  tiers: publicProcedure.query(() => membershipRepo.findTiers()),
} satisfies TRPCRouterRecord

export { membershipRouter }
