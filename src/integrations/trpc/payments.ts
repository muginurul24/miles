import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure } from './init'
import { createPaygateCharge } from '#/lib/paygate'
import { paymentsRepo } from '#/server/repositories/payments.repo'
import { membershipRepo } from '#/server/repositories/membership.repo'

import type { TRPCRouterRecord } from '@trpc/server'

const purchasableTierIds = new Set(['plus', 'pro'])

const createCheckoutInputSchema = z.object({
  tierId: z.string().trim().min(1),
  bank: z
    .enum(['bca', 'bni', 'bri', 'bsi', 'cimb', 'mandiri', 'permata'])
    .default(getDefaultBank()),
})

const orderInputSchema = z.object({
  orderId: z.string().trim().min(1),
})

const paymentsRouter = {
  createMembershipCheckout: protectedProcedure
    .input(createCheckoutInputSchema)
    .mutation(async ({ ctx, input }) => {
      const tiers = await membershipRepo.findTiers()
      const tier = tiers.find((candidate) => candidate.id === input.tierId)

      if (!tier || !purchasableTierIds.has(tier.id)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Paket membership tidak bisa dibayar langsung.',
        })
      }

      const orderId = createOrderId()

      await paymentsRepo.createPendingOrder({
        userId: ctx.user.id,
        tierId: tier.id,
        orderId,
        amount: tier.priceIdr,
        customerEmail: ctx.user.email,
        customerName: ctx.user.name,
      })

      try {
        const charge = await createPaygateCharge({
          orderId,
          amount: tier.priceIdr,
          paymentType: 'bank_transfer',
          bank: input.bank,
          customer: {
            name: ctx.user.name,
            email: ctx.user.email,
          },
          items: [
            {
              id: `membership-${tier.id}`,
              name: `Membership JustMiles ${tier.name}`,
              price: tier.priceIdr,
              quantity: 1,
            },
          ],
          callbackUrl: getPaymentCallbackUrl(),
          metadata: {
            kind: 'membership',
            tier_id: tier.id,
            user_id: ctx.user.id,
          },
        })

        await paymentsRepo.markChargeCreated(orderId, charge)

        return {
          orderId,
          charge,
        }
      } catch (error) {
        await paymentsRepo.markChargeFailed(orderId, error)

        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Gateway pembayaran belum bisa diproses. Coba lagi nanti.',
          cause: error,
        })
      }
    }),

  order: protectedProcedure
    .input(orderInputSchema)
    .query(async ({ ctx, input }) => {
      const order = await paymentsRepo.findOrderForUser(
        ctx.user.id,
        input.orderId,
      )

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order pembayaran tidak ditemukan.',
        })
      }

      return order
    }),
} satisfies TRPCRouterRecord

function createOrderId(): string {
  return `JM-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

function getPaymentCallbackUrl(): string {
  const callbackUrl = process.env.PAYGATE_CALLBACK_URL

  if (!callbackUrl) {
    throw new Error('PAYGATE_CALLBACK_URL is required.')
  }

  return callbackUrl
}

function getDefaultBank():
  | 'bca'
  | 'bni'
  | 'bri'
  | 'bsi'
  | 'cimb'
  | 'mandiri'
  | 'permata' {
  switch (process.env.PAYGATE_DEFAULT_BANK) {
    case 'bca':
    case 'bni':
    case 'bri':
    case 'bsi':
    case 'cimb':
    case 'mandiri':
    case 'permata':
      return process.env.PAYGATE_DEFAULT_BANK
    default:
      return 'bsi'
  }
}

export { paymentsRouter }
