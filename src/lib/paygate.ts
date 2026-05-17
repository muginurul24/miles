import { z } from 'zod'

const paygateChargeResponseSchema = z.object({
  transaction_id: z.string().min(1),
  order_id: z.string().min(1),
  platform_order_id: z.string().min(1),
  status: z.string().min(1),
  payment_type: z.string().min(1),
  payment_method: z.string().optional(),
  amount: z.number().int().positive(),
  midtrans: z
    .object({
      transaction_id: z.string().optional(),
      va_numbers: z
        .array(
          z.object({
            bank: z.string(),
            va_number: z.string(),
          }),
        )
        .optional(),
      transaction_status: z.string().optional(),
      fraud_status: z.string().optional(),
    })
    .passthrough(),
})

const paygateEnvelopeSchema = z.object({
  success: z.literal(true),
  data: paygateChargeResponseSchema,
})

export type PaygateChargeResult = z.infer<typeof paygateChargeResponseSchema>

export interface PaygateChargeInput {
  orderId: string
  amount: number
  paymentType: 'bank_transfer'
  bank: 'bca' | 'bni' | 'bri' | 'bsi' | 'cimb' | 'mandiri' | 'permata'
  customer: {
    name: string
    email: string
    phone?: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  callbackUrl: string
  metadata: Record<string, string>
}

export class PaygateError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: string,
  ) {
    super(message)
    this.name = 'PaygateError'
  }
}

export async function createPaygateCharge(
  input: PaygateChargeInput,
): Promise<PaygateChargeResult> {
  const response = await paygateRequest('/v1/transactions/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': input.orderId,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      amount: input.amount,
      currency: 'IDR',
      payment_type: input.paymentType,
      bank: input.bank,
      customer: input.customer,
      items: input.items,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  })

  return paygateEnvelopeSchema.parse(response).data
}

export async function getPaygateTransaction(
  orderId: string,
): Promise<PaygateChargeResult> {
  const response = await paygateRequest(
    `/v1/transactions/${encodeURIComponent(orderId)}`,
    { method: 'GET' },
  )

  return paygateEnvelopeSchema.parse(response).data
}

async function paygateRequest(
  path: string,
  init: RequestInit,
): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(`${getPaygateBaseUrl()}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${getPaygateStoreToken()}`,
        ...init.headers,
      },
      signal: controller.signal,
    })
    const responseText = await response.text()

    if (!response.ok) {
      throw new PaygateError(
        `PayGate request failed with status ${response.status}.`,
        response.status,
        responseText,
      )
    }

    try {
      return JSON.parse(responseText) as unknown
    } catch {
      throw new PaygateError(
        'PayGate returned an invalid JSON response.',
        response.status,
        responseText,
      )
    }
  } finally {
    clearTimeout(timeout)
  }
}

function getPaygateBaseUrl(): string {
  return getRequiredEnv('PAYGATE_BASE_URL').replace(/\/+$/, '')
}

function getPaygateStoreToken(): string {
  return getRequiredEnv('PAYGATE_STORE_TOKEN')
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is required.`)
  }

  return value
}
