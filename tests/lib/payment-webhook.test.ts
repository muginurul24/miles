import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  getWebhookPaymentMethod,
  mapPaygateWebhookStatus,
  parsePaygateWebhookPaidAt,
  paygateWebhookPayloadSchema,
  shouldIgnoreWebhookStatusTransition,
  verifyPaygateWebhookSignature,
} from '#/lib/payment-webhook'

import type { PaygateWebhookPayload } from '#/lib/payment-webhook'

describe('verifyPaygateWebhookSignature', () => {
  it('should accept a valid signature inside the tolerance window', async () => {
    const rawBody = '{"event":"transaction.updated"}'
    const timestamp = 1_767_225_600
    const secret = 'whsec_test'
    const signature = createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex')

    await expect(
      verifyPaygateWebhookSignature({
        rawBody,
        signatureHeader: `sha256=${signature}`,
        timestampHeader: String(timestamp),
        secret,
        toleranceSeconds: 300,
        now: new Date(timestamp * 1000),
      }),
    ).resolves.toBe(true)
  })

  it('should reject stale webhook timestamps', async () => {
    await expect(
      verifyPaygateWebhookSignature({
        rawBody: '{}',
        signatureHeader: 'sha256=deadbeef',
        timestampHeader: '100',
        secret: 'whsec_test',
        toleranceSeconds: 300,
        now: new Date(1_000_000),
      }),
    ).resolves.toBe(false)
  })

  it('should accept an ISO timestamp and signature without prefix', async () => {
    const rawBody = '{"event":"transaction.updated"}'
    const timestamp = '2026-05-18T08:00:00.000Z'
    const secret = 'whsec_test'
    const signature = createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex')

    await expect(
      verifyPaygateWebhookSignature({
        rawBody,
        signatureHeader: signature,
        timestampHeader: timestamp,
        secret,
        toleranceSeconds: 300,
        now: new Date(timestamp),
      }),
    ).resolves.toBe(true)
  })
})

describe('PayGate webhook helpers', () => {
  it('should parse production webhook IDs without requiring UUID format', () => {
    const parsed = paygateWebhookPayloadSchema.parse({
      amount: 99_000,
      event: 'transaction.updated',
      order_id: 'JM-123',
      paid_at: null,
      status: 'pending',
      store_id: 'store_live',
      transaction_id: 'paygate-transaction-1',
      webhook_id: 'wd_123',
    })

    expect(parsed).toMatchObject({
      currency: 'IDR',
      metadata: {},
      midtrans: {},
      webhook_id: 'wd_123',
    })
  })

  it('should map PayGate statuses into monotonic order states', () => {
    expect(mapPaygateWebhookStatus('paid')).toEqual({
      activatesMembership: true,
      orderStatus: 'paid',
    })
    expect(mapPaygateWebhookStatus('challenge')).toEqual({
      activatesMembership: false,
      orderStatus: 'pending',
    })
    expect(mapPaygateWebhookStatus('refunded')).toBeNull()
    expect(shouldIgnoreWebhookStatusTransition('paid', 'expired')).toBe(true)
    expect(shouldIgnoreWebhookStatusTransition('pending', 'paid')).toBe(false)
  })

  it('should resolve the safest supported payment method from webhook fields', () => {
    const payload = createWebhookPayload({
      metadata: { paymentMethod: 'dragonpay' },
      midtrans: {
        va_numbers: [{ bank: 'bsi', va_number: '88001234567890' }],
      },
      payment_method: 'paypal',
    })

    expect(getWebhookPaymentMethod(payload, 'gopay')).toBe('bsi')
  })

  it('should infer QRIS and fallback paid timestamps safely', () => {
    const fallback = new Date('2026-05-18T08:00:00.000Z')
    const payload = createWebhookPayload({
      paid_at: null,
      payment_type: 'qris',
      status: 'paid',
    })

    expect(getWebhookPaymentMethod(payload, null)).toBe('qris_gopay')
    expect(parsePaygateWebhookPaidAt(payload, fallback)).toBe(fallback)
  })
})

function createWebhookPayload(
  overrides: Partial<PaygateWebhookPayload> = {},
): PaygateWebhookPayload {
  return paygateWebhookPayloadSchema.parse({
    amount: 99_000,
    currency: 'IDR',
    event: 'transaction.updated',
    metadata: { paymentMethod: 'qris_gopay' },
    midtrans: {
      fraud_status: 'accept',
      transaction_status: 'settlement',
    },
    order_id: 'JM-123',
    paid_at: '2026-05-18T08:00:00.000Z',
    payment_type: 'qris',
    status: 'paid',
    store_id: 'store_live',
    transaction_id: 'paygate-transaction-1',
    webhook_id: 'wd_123',
    ...overrides,
  })
}
