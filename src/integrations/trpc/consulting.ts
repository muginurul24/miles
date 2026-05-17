import { TRPCError } from '@trpc/server'
import { consultingInquiryInputSchema } from '#/lib/schemas/consulting'
import { consultingRepo } from '#/server/repositories/consulting.repo'
import { publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const consultingRouter = {
  packages: publicProcedure.query(() => consultingRepo.findPackages()),
  submitInquiry: publicProcedure
    .input(consultingInquiryInputSchema)
    .mutation(async ({ input }) => {
      const packageExists = await consultingRepo.packageExists(input.packageId)

      if (!packageExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Paket konsultasi tidak ditemukan.',
        })
      }

      return consultingRepo.createInquiry(input)
    }),
} satisfies TRPCRouterRecord

export { consultingRouter }
