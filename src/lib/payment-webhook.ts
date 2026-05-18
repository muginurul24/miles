import { z } from 'zod'
import { isPaymentChannelId } from '#/lib/payment-channels'

import type { PaymentChannelCode } from '#/lib/payment-channels'

export const paygateWebhookStatusSchema = z.enum([
  'paid',
  'pending',
  'failed',
  'expired',
  'cancelled',
  'challenge',
  'refunded',
  'partial_refunded',
])

export type PaygateWebhookStatus = z.infer<typeof paygateWebhookStatusSchema>

export const paygateWebhookPayloadSchema = z.object({
  event: z.string().min(1),
  webhook_id: z.string().min(1),
  store_id: z.string().min(1),
  order_id: z.string().min(1),
  transaction_id: z.string().min(1),
  platform_order_id: z.string().optional(),
  status: paygateWebhookStatusSchema,
  payment_type: z.string().optional(),
  payment_method: z.string().optional(),
  bank: z.string().optional(),
  ewallet: z.string().optional(),
  store: z.string().optional(),
  amount: z.number().int().positive(),
  currency: z.literal('IDR').default('IDR'),
  paid_at: z.string().nullable().optional(),
  midtrans: z
    .object({
      cstore: z.string().optional(),
      fraud_status: z.string().optional(),
      qr_string: z.string().optional(),
      qr_url: z.string().optional(),
      transaction_status: z.string().optional(),
      transaction_id: z.string().optional(),
      va_numbers: z
        .array(
          z.object({
            bank: z.string().optional(),
            va_number: z.string().optional(),
          }),
        )
        .optional(),
    })
    .passthrough()
    .default({}),
  metadata: z.record(z.string(), z.unknown()).default({}),
})

export type PaygateWebhookPayload = z.infer<typeof paygateWebhookPayloadSchema>

export type PaymentWebhookOrderStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled'

export interface PaygateWebhookStatusAction {
  activatesMembership: boolean
  orderStatus: PaymentWebhookOrderStatus
}

export interface VerifyPaygateWebhookInput {
  rawBody: string
  signatureHeader: string | null
  timestampHeader: string | null
  secret: string
  toleranceSeconds: number
  now?: Date
}

export async function verifyPaygateWebhookSignature({
  rawBody,
  signatureHeader,
  timestampHeader,
  secret,
  toleranceSeconds,
  now = new Date(),
}: VerifyPaygateWebhookInput): Promise<boolean> {
  const signedTimestamp = timestampHeader?.trim()
  const normalizedSignature = normalizeSignature(signatureHeader)

  if (!signedTimestamp || !normalizedSignature) {
    return false
  }

  const timestamp = parseWebhookTimestamp(signedTimestamp)
  if (!timestamp) {
    return false
  }

  const ageSeconds = Math.abs(
    Math.floor((now.getTime() - timestamp.getTime()) / 1000),
  )
  if (ageSeconds > toleranceSeconds) {
    return false
  }

  const expected = await signPayload(secret, `${signedTimestamp}.${rawBody}`)

  if (expected.length !== normalizedSignature.length) {
    return false
  }

  return constantTimeEqual(expected, normalizedSignature)
}

export function mapPaygateWebhookStatus(
  status: PaygateWebhookStatus,
): PaygateWebhookStatusAction | null {
  switch (status) {
    case 'paid':
      return { activatesMembership: true, orderStatus: 'paid' }
    case 'pending':
    case 'challenge':
      return { activatesMembership: false, orderStatus: 'pending' }
    case 'failed':
      return { activatesMembership: false, orderStatus: 'failed' }
    case 'expired':
      return { activatesMembership: false, orderStatus: 'expired' }
    case 'cancelled':
      return { activatesMembership: false, orderStatus: 'cancelled' }
    case 'refunded':
    case 'partial_refunded':
      return null
  }
}

export function shouldIgnoreWebhookStatusTransition(
  currentStatus: string,
  nextStatus: PaymentWebhookOrderStatus,
): boolean {
  if (currentStatus === nextStatus) {
    return true
  }

  return ['paid', 'failed', 'expired', 'cancelled'].includes(currentStatus)
}

export function parsePaygateWebhookPaidAt(
  payload: PaygateWebhookPayload,
  fallback = new Date(),
): Date | null {
  if (payload.status !== 'paid') {
    return null
  }

  if (!payload.paid_at) {
    return fallback
  }

  const parsed = new Date(payload.paid_at)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed
}

export function getWebhookPaymentMethod(
  payload: PaygateWebhookPayload,
  currentPaymentMethod: string | null,
): PaymentChannelCode | null {
  const candidates = [
    getWebhookMetadataString(payload, 'paymentMethod'),
    payload.payment_method,
    payload.bank,
    payload.ewallet,
    payload.store,
    payload.midtrans.va_numbers?.[0]?.bank,
    payload.midtrans.cstore,
    payload.payment_type === 'qris' ? 'qris_gopay' : null,
    currentPaymentMethod,
  ]

  return (
    candidates.find(
      (candidate): candidate is PaymentChannelCode =>
        typeof candidate === 'string' && isPaymentChannelId(candidate),
    ) ?? null
  )
}

export function getWebhookProviderTransactionId(
  payload: PaygateWebhookPayload,
): string {
  return payload.transaction_id || payload.midtrans.transaction_id || ''
}

async function signPayload(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload),
  )

  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false
  }

  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

function normalizeSignature(signatureHeader: string | null): string | null {
  const signature = signatureHeader?.trim()
  if (!signature) {
    return null
  }

  const value = signature.startsWith('sha256=')
    ? signature.slice('sha256='.length)
    : signature

  return /^[a-f0-9]+$/i.test(value) ? value.toLowerCase() : null
}

function parseWebhookTimestamp(timestamp: string): Date | null {
  const unixTimestamp = Number(timestamp)
  if (Number.isInteger(unixTimestamp)) {
    const milliseconds =
      timestamp.length >= 13 ? unixTimestamp : unixTimestamp * 1000
    const parsed = new Date(milliseconds)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const parsed = new Date(timestamp)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getWebhookMetadataString(
  payload: PaygateWebhookPayload,
  key: string,
): string | null {
  const value = payload.metadata[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
