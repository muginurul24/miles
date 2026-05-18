import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure } from './init'
import {
  createPaygateCharge,
  resolvePaygatePaymentChannel,
} from '#/lib/paygate'
import {
  DEFAULT_PAYMENT_CHANNEL_ID,
  PAYGATE_PAYMENT_CHANNEL_CODES,
  isPaymentChannelId,
} from '#/lib/payment-channels'
import { paymentsRepo } from '#/server/repositories/payments.repo'
import { membershipRepo } from '#/server/repositories/membership.repo'

import type { TRPCRouterRecord } from '@trpc/server'
import type { PaymentChannelCode } from '#/lib/payment-channels'

const purchasableTierIds = new Set(['plus', 'pro'])

const createCheckoutInputSchema = z.object({
  tierId: z.string().trim().min(1),
  paymentMethod: z
    .enum(PAYGATE_PAYMENT_CHANNEL_CODES)
    .default(getDefaultPaymentMethod()),
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
      const paymentChannel = resolvePaygatePaymentChannel(input.paymentMethod)

      await paymentsRepo.createPendingOrder({
        userId: ctx.user.id,
        tierId: tier.id,
        orderId,
        amount: tier.priceIdr,
        customerEmail: ctx.user.email,
        customerName: ctx.user.name,
        paymentMethod: paymentChannel.paymentMethod,
        paymentType: paymentChannel.paymentType,
      })

      try {
        const charge = await createPaygateCharge({
          orderId,
          amount: tier.priceIdr,
          paymentMethod: paymentChannel.paymentMethod,
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

function getDefaultPaymentMethod(): PaymentChannelCode {
  const configured =
    process.env.PAYGATE_DEFAULT_PAYMENT_METHOD ??
    process.env.PAYGATE_DEFAULT_BANK

  if (configured && isPaymentChannelId(configured)) {
    return configured
  }

  return DEFAULT_PAYMENT_CHANNEL_ID
}

export { paymentsRouter }
