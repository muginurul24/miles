import { z } from 'zod'

export const paygateWebhookPayloadSchema = z.object({
  event: z.literal('transaction.updated'),
  webhook_id: z.string().uuid(),
  store_id: z.string().uuid(),
  order_id: z.string().min(1),
  transaction_id: z.string().uuid(),
  status: z.string().min(1),
  payment_type: z.string().min(1),
  payment_method: z.string().optional(),
  amount: z.number().int().positive(),
  currency: z.literal('IDR'),
  paid_at: z.string().datetime().nullable(),
  midtrans: z.object({
    transaction_status: z.string(),
    fraud_status: z.string().optional(),
    transaction_id: z.string().optional(),
  }),
  metadata: z.record(z.string(), z.unknown()),
})

export type PaygateWebhookPayload = z.infer<typeof paygateWebhookPayloadSchema>

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
  const timestamp = Number(timestampHeader)

  if (!signatureHeader?.startsWith('sha256=') || !Number.isInteger(timestamp)) {
    return false
  }

  const ageSeconds = Math.abs(Math.floor(now.getTime() / 1000) - timestamp)
  if (ageSeconds > toleranceSeconds) {
    return false
  }

  const expected = await signPayload(secret, `${timestamp}.${rawBody}`)
  const provided = signatureHeader.slice('sha256='.length)

  if (expected.length !== provided.length) {
    return false
  }

  return constantTimeEqual(expected, provided)
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
