import { prisma } from '#/db'
import type { PaygateChargeResult } from '#/lib/paygate'
import {
  getWebhookPaymentMethod,
  getWebhookProviderTransactionId,
  mapPaygateWebhookStatus,
  parsePaygateWebhookPaidAt,
  shouldIgnoreWebhookStatusTransition,
} from '#/lib/payment-webhook'
import type { PaygateWebhookPayload } from '#/lib/payment-webhook'
import type { Prisma } from '#/generated/prisma/client'

export interface CreatePendingPaymentOrderInput {
  userId: string
  tierId: string
  orderId: string
  amount: number
  customerEmail: string
  customerName: string
  paymentMethod: string
  paymentType: string
}

export interface PaymentOrderView {
  orderId: string
  tierId: string
  tierName: string
  amount: number
  currency: string
  status: string
  paymentType: string
  paymentMethod: string | null
  gatewayPayload: Prisma.JsonValue
  paidAt: Date | null
  createdAt: Date
}

export type PaymentWebhookProcessingOutcome =
  | 'processed'
  | 'duplicate'
  | 'ignored'
  | 'unknown_order'
  | 'amount_mismatch'
  | 'currency_mismatch'

export interface PaymentWebhookProcessingResult {
  activatedMembership: boolean
  orderId: string
  outcome: PaymentWebhookProcessingOutcome
  status: string | null
  webhookId: string
}

export const paymentsRepo = {
  async createPendingOrder(
    input: CreatePendingPaymentOrderInput,
  ): Promise<void> {
    await prisma.paymentOrder.create({
      data: {
        userId: input.userId,
        tierId: input.tierId,
        orderId: input.orderId,
        amount: input.amount,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        paymentMethod: input.paymentMethod,
        paymentType: input.paymentType,
        gatewayPayload: {},
      },
    })
  },

  async markChargeCreated(
    orderId: string,
    charge: PaygateChargeResult,
  ): Promise<void> {
    await prisma.paymentOrder.update({
      where: { orderId },
      data: {
        gatewayTransactionId: charge.transaction_id,
        platformOrderId: charge.platform_order_id,
        status: charge.status,
        paymentType: charge.payment_type,
        paymentMethod: charge.payment_method ?? null,
        gatewayPayload: toInputJsonValue(charge),
      },
    })
  },

  async markChargeFailed(orderId: string, error: unknown): Promise<void> {
    await prisma.paymentOrder.update({
      where: { orderId },
      data: {
        status: 'failed',
        gatewayPayload: {
          error: error instanceof Error ? error.message : 'unknown error',
        },
      },
    })
  },

  async findOrderForUser(
    userId: string,
    orderId: string,
  ): Promise<PaymentOrderView | null> {
    const order = await prisma.paymentOrder.findFirst({
      where: { userId, orderId },
      include: {
        tier: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }

    return {
      orderId: order.orderId,
      tierId: order.tierId,
      tierName: order.tier.name,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentType: order.paymentType,
      paymentMethod: order.paymentMethod,
      gatewayPayload: order.gatewayPayload,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
    }
  },

  async processWebhook(
    payload: PaygateWebhookPayload,
  ): Promise<PaymentWebhookProcessingResult> {
    return prisma.$transaction(async (transaction) => {
      const statusAction = mapPaygateWebhookStatus(payload.status)
      const order = await transaction.paymentOrder.findUnique({
        where: { orderId: payload.order_id },
        include: {
          tier: true,
          user: true,
        },
      })

      const eventInsert = await transaction.paymentWebhookEvent.createMany({
        data: [
          {
            id: payload.webhook_id,
            paymentOrderId: order?.id,
            event: payload.event,
            status: payload.status,
            signatureValid: true,
            payload: toInputJsonValue(payload),
          },
        ],
        skipDuplicates: true,
      })

      if (eventInsert.count === 0) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'duplicate',
          status: order?.status ?? null,
          webhookId: payload.webhook_id,
        }
      }

      if (!order) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'unknown_order',
          status: null,
          webhookId: payload.webhook_id,
        }
      }

      if (payload.amount !== order.amount) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'amount_mismatch',
          status: order.status,
          webhookId: payload.webhook_id,
        }
      }

      if (payload.currency !== order.currency) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'currency_mismatch',
          status: order.status,
          webhookId: payload.webhook_id,
        }
      }

      if (
        !statusAction ||
        shouldIgnoreWebhookStatusTransition(
          order.status,
          statusAction.orderStatus,
        )
      ) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'ignored',
          status: order.status,
          webhookId: payload.webhook_id,
        }
      }

      const paidAt = parsePaygateWebhookPaidAt(payload)
      const paymentMethod = getWebhookPaymentMethod(
        payload,
        order.paymentMethod,
      )
      const updateResult = await transaction.paymentOrder.updateMany({
        where: { id: order.id, status: order.status },
        data: {
          gatewayTransactionId: getWebhookProviderTransactionId(payload),
          ...(payload.platform_order_id
            ? { platformOrderId: payload.platform_order_id }
            : {}),
          status: statusAction.orderStatus,
          paymentType: payload.payment_type ?? order.paymentType,
          paymentMethod,
          paidAt,
          gatewayPayload: toInputJsonValue(payload),
        },
      })

      if (updateResult.count === 0) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'duplicate',
          status: statusAction.orderStatus,
          webhookId: payload.webhook_id,
        }
      }

      if (!statusAction.activatesMembership || !paidAt) {
        return {
          activatedMembership: false,
          orderId: payload.order_id,
          outcome: 'processed',
          status: statusAction.orderStatus,
          webhookId: payload.webhook_id,
        }
      }

      await transaction.user.update({
        where: { id: order.userId },
        data: {
          membershipTier: order.tierId,
          membershipExpiresAt: buildMembershipExpiry(
            order.user.membershipExpiresAt,
            paidAt,
            order.tier.period,
          ),
        },
      })

      return {
        activatedMembership: true,
        orderId: payload.order_id,
        outcome: 'processed',
        status: statusAction.orderStatus,
        webhookId: payload.webhook_id,
      }
    })
  },
}

function buildMembershipExpiry(
  currentExpiry: Date | null,
  paidAt: Date,
  period: string,
): Date | null {
  if (period !== 'month') {
    return null
  }

  const baseDate =
    currentExpiry && currentExpiry > paidAt ? currentExpiry : paidAt
  const expiry = new Date(baseDate)
  expiry.setMonth(expiry.getMonth() + 1)
  return expiry
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}
