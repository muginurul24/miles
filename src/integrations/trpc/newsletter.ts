import { newsletterSubscribeInputSchema } from '#/lib/schemas/newsletter'
import { newsletterRepo } from '#/server/repositories/newsletter.repo'
import { publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const newsletterRouter = {
  subscribe: publicProcedure
    .input(newsletterSubscribeInputSchema)
    .mutation(({ input }) => newsletterRepo.subscribe(input)),
} satisfies TRPCRouterRecord

export { newsletterRouter }
