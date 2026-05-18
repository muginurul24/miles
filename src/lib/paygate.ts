import { z } from 'zod'
import {
  DEFAULT_PAYMENT_CHANNEL_ID,
  getPaymentChannelById,
  isBankCode,
  isEwalletCode,
} from '#/lib/payment-channels'

import type {
  BankCode,
  EwalletCode,
  PaymentChannelCode,
  PaymentType,
} from '#/lib/payment-channels'

const paygateChargeResponseSchema = z.object({
  transaction_id: z.string().min(1),
  order_id: z.string().min(1),
  platform_order_id: z.string().min(1),
  status: z.string().min(1),
  payment_type: z.string().min(1),
  payment_method: z.string().optional(),
  amount: z.number().int().positive(),
  actions: z
    .array(
      z.object({
        method: z.string().optional(),
        name: z.string().optional(),
        type: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
  expires_at: z.string().optional(),
  qr_string: z.string().optional(),
  qr_url: z.string().optional(),
  midtrans: z
    .object({
      actions: z
        .array(
          z.object({
            method: z.string().optional(),
            name: z.string().optional(),
            type: z.string().optional(),
            url: z.string().optional(),
          }),
        )
        .optional(),
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
      qr_string: z.string().optional(),
      qr_url: z.string().optional(),
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
  paymentMethod?: PaymentChannelCode
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

export interface ResolvedPaygatePaymentChannel {
  paymentMethod: PaymentChannelCode
  paymentType: PaymentType
  acquirer?: 'gopay'
  bank?: BankCode
  ewallet?: EwalletCode
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
  const channel = resolvePaygatePaymentChannel(input.paymentMethod)
  const response = await paygateRequest('/v1/transactions/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': `idem_${input.orderId}`,
    },
    body: JSON.stringify(buildPaygateChargePayload(input, channel)),
  })

  return paygateEnvelopeSchema.parse(response).data
}

export async function getPaygateTransaction(
  orderId: string,
): Promise<PaygateChargeResult> {
  const response = await paygateRequest(
    `/v1/transactions/${encodeURIComponent(orderId)}`,
    {
      method: 'GET',
      headers: {
        'Idempotency-Key': `idem_lookup_${orderId}`,
      },
    },
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
        Accept: 'application/json',
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
  return getConfiguredEnv('PAYGATE_API_BASE_URL', 'PAYGATE_BASE_URL').replace(
    /\/+$/,
    '',
  )
}

function getPaygateStoreToken(): string {
  return getConfiguredEnv('PAYGATE_STORE_API_TOKEN', 'PAYGATE_STORE_TOKEN')
}

function getConfiguredEnv(primaryName: string, legacyName: string): string {
  const value =
    process.env[primaryName]?.trim() || process.env[legacyName]?.trim()

  if (!value) {
    throw new Error(`${primaryName} is required.`)
  }

  return value
}

export function resolvePaygatePaymentChannel(
  paymentMethod = DEFAULT_PAYMENT_CHANNEL_ID,
): ResolvedPaygatePaymentChannel {
  const channel = getPaymentChannelById(paymentMethod)

  if (!channel) {
    throw new Error(`Unsupported PayGate payment channel: ${paymentMethod}.`)
  }

  if (channel.category === 'bank_transfer') {
    if (!isBankCode(channel.id)) {
      throw new Error(`Unsupported PayGate bank channel: ${channel.id}.`)
    }

    return {
      bank: channel.id,
      paymentMethod: channel.id,
      paymentType: channel.paymentType,
    }
  }

  if (channel.category === 'ewallet') {
    if (!isEwalletCode(channel.id)) {
      throw new Error(`Unsupported PayGate e-wallet channel: ${channel.id}.`)
    }

    return {
      ewallet: channel.id,
      paymentMethod: channel.id,
      paymentType: channel.paymentType,
    }
  }

  return {
    acquirer: 'gopay',
    paymentMethod: channel.id,
    paymentType: channel.paymentType,
  }
}

export function buildPaygateChargePayload(
  input: PaygateChargeInput,
  channel = resolvePaygatePaymentChannel(input.paymentMethod),
): Record<string, unknown> {
  return {
    order_id: input.orderId,
    amount: input.amount,
    currency: 'IDR',
    payment_type: channel.paymentType,
    ...(channel.bank ? { bank: channel.bank } : {}),
    ...(channel.ewallet ? { ewallet: channel.ewallet } : {}),
    ...(channel.acquirer ? { acquirer: channel.acquirer } : {}),
    customer: input.customer,
    items: input.items,
    callback_url: input.callbackUrl,
    metadata: {
      ...input.metadata,
      paymentMethod: channel.paymentMethod,
      paymentType: channel.paymentType,
    },
  }
}
