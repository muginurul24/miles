import { calculatorRepo } from '#/server/repositories/calculator.repo'
import { publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const calculatorRouter = {
  cards: publicProcedure.query(() => calculatorRepo.getCards()),
} satisfies TRPCRouterRecord

export { calculatorRouter }
