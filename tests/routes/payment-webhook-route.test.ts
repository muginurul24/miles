import { createHmac } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '#/lib/logger'
import { paymentsRepo } from '#/server/repositories/payments.repo'
import { handlePaymentWebhook } from '#/routes/api/payments/webhook'

vi.mock('#/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock('#/server/repositories/payments.repo', () => ({
  paymentsRepo: {
    processWebhook: vi.fn(),
  },
}))

const mockedPaymentsRepo = vi.mocked(paymentsRepo)
const mockedLogger = vi.mocked(logger)

describe('payment webhook route', () => {
  beforeEach(() => {
    process.env.PAYGATE_WEBHOOK_SECRET = 'whsec_test'
    vi.clearAllMocks()
  })

  it('should process a signed webhook and return tracing metadata', async () => {
    mockedPaymentsRepo.processWebhook.mockResolvedValue({
      activatedMembership: true,
      orderId: 'JM-123',
      outcome: 'processed',
      status: 'paid',
      webhookId: 'wd_123',
    })

    const response = await handlePaymentWebhook({
      request: createSignedRequest(createWebhookPayload()),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get('x-request-id')).toBeTruthy()
    expect(body).toMatchObject({
      success: true,
      data: {
        activatedMembership: true,
        orderId: 'JM-123',
        outcome: 'processed',
      },
    })
    expect(mockedPaymentsRepo.processWebhook).toHaveBeenCalledWith(
      expect.objectContaining({
        order_id: 'JM-123',
        webhook_id: 'wd_123',
      }),
    )
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'payment_webhook_processed',
      expect.objectContaining({ outcome: 'processed', orderId: 'JM-123' }),
    )
  })

  it('should acknowledge unknown orders without retry storms', async () => {
    mockedPaymentsRepo.processWebhook.mockResolvedValue({
      activatedMembership: false,
      orderId: 'JM-404',
      outcome: 'unknown_order',
      status: null,
      webhookId: 'wd_404',
    })

    const response = await handlePaymentWebhook({
      request: createSignedRequest(
        createWebhookPayload({ order_id: 'JM-404', webhook_id: 'wd_404' }),
      ),
    })

    expect(response.status).toBe(202)
    expect(mockedLogger.warn).toHaveBeenCalledWith(
      'payment_webhook_unknown_order',
      expect.objectContaining({ orderId: 'JM-404' }),
    )
  })

  it('should reject order mismatches and log them as payment errors', async () => {
    mockedPaymentsRepo.processWebhook.mockResolvedValue({
      activatedMembership: false,
      orderId: 'JM-123',
      outcome: 'amount_mismatch',
      status: 'pending',
      webhookId: 'wd_123',
    })

    const response = await handlePaymentWebhook({
      request: createSignedRequest(createWebhookPayload()),
    })
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body).toMatchObject({
      success: false,
      error: 'Payment notification does not match the order.',
    })
    expect(mockedLogger.error).toHaveBeenCalledWith(
      'payment_webhook_order_mismatch',
      expect.objectContaining({ outcome: 'amount_mismatch' }),
    )
  })

  it('should reject invalid signatures before parsing the payload', async () => {
    const response = await handlePaymentWebhook({
      request: createSignedRequest(createWebhookPayload(), {
        signature: 'sha256=bad',
      }),
    })

    expect(response.status).toBe(401)
    expect(mockedPaymentsRepo.processWebhook).not.toHaveBeenCalled()
  })
})

function createSignedRequest(
  body: Record<string, unknown>,
  options: { signature?: string; timestamp?: string } = {},
): Request {
  const rawBody = JSON.stringify(body)
  const timestamp = options.timestamp ?? String(Math.floor(Date.now() / 1000))
  const signature =
    options.signature ??
    `sha256=${createHmac('sha256', process.env.PAYGATE_WEBHOOK_SECRET ?? '')
      .update(`${timestamp}.${rawBody}`)
      .digest('hex')}`

  return new Request('https://justmiles.id/api/payments/webhook', {
    body: rawBody,
    headers: {
      'content-type': 'application/json',
      'x-webhook-signature': signature,
      'x-webhook-timestamp': timestamp,
    },
    method: 'POST',
  })
}

function createWebhookPayload(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    amount: 99_000,
    currency: 'IDR',
    event: 'transaction.updated',
    metadata: { paymentMethod: 'qris_gopay' },
    order_id: 'JM-123',
    paid_at: '2026-05-18T08:00:00.000Z',
    payment_type: 'qris',
    status: 'paid',
    store_id: 'store_live',
    transaction_id: 'paygate-transaction-1',
    webhook_id: 'wd_123',
    ...overrides,
  }
}
