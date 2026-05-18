import { createFileRoute } from '@tanstack/react-router'
import {
  paygateWebhookPayloadSchema,
  verifyPaygateWebhookSignature,
} from '#/lib/payment-webhook'
import { logger } from '#/lib/logger'
import { paymentsRepo } from '#/server/repositories/payments.repo'

async function handlePaymentWebhook({
  request,
}: {
  request: Request
}): Promise<Response> {
  const requestId = createRequestId()
  const rawBody = await request.text()
  const webhookSecret = process.env.PAYGATE_WEBHOOK_SECRET

  if (!webhookSecret) {
    logger.error('payment_webhook_secret_missing', { requestId })
    return jsonResponse(
      { success: false, error: 'Webhook secret is not configured.' },
      500,
      requestId,
    )
  }

  const signatureValid = await verifyPaygateWebhookSignature({
    rawBody,
    signatureHeader: request.headers.get('x-webhook-signature'),
    timestampHeader: request.headers.get('x-webhook-timestamp'),
    secret: webhookSecret,
    toleranceSeconds: getWebhookToleranceSeconds(),
  })

  if (!signatureValid) {
    logger.warn('payment_webhook_invalid_signature', { requestId })
    return jsonResponse(
      { success: false, error: 'Invalid webhook signature.' },
      401,
      requestId,
    )
  }

  let parsedPayload: unknown
  try {
    parsedPayload = JSON.parse(rawBody) as unknown
  } catch {
    logger.warn('payment_webhook_invalid_json', { requestId })
    return jsonResponse(
      { success: false, error: 'Invalid webhook payload.' },
      400,
      requestId,
    )
  }

  const parsed = paygateWebhookPayloadSchema.safeParse(parsedPayload)
  if (!parsed.success) {
    logger.warn('payment_webhook_invalid_payload', {
      requestId,
      issues: parsed.error.issues.map((issue) => issue.path.join('.')),
    })
    return jsonResponse(
      { success: false, error: 'Invalid webhook payload.' },
      400,
      requestId,
    )
  }

  try {
    const result = await paymentsRepo.processWebhook(parsed.data)

    if (
      result.outcome === 'amount_mismatch' ||
      result.outcome === 'currency_mismatch'
    ) {
      logger.error('payment_webhook_order_mismatch', {
        requestId,
        orderId: result.orderId,
        outcome: result.outcome,
        webhookId: result.webhookId,
      })
      return jsonResponse(
        {
          success: false,
          error: 'Payment notification does not match the order.',
          data: result,
        },
        409,
        requestId,
      )
    }

    if (result.outcome === 'unknown_order') {
      logger.warn('payment_webhook_unknown_order', {
        requestId,
        orderId: result.orderId,
        webhookId: result.webhookId,
      })
    } else {
      logger.info('payment_webhook_processed', {
        requestId,
        activatedMembership: result.activatedMembership,
        orderId: result.orderId,
        outcome: result.outcome,
        status: result.status,
        webhookId: result.webhookId,
      })
    }

    return jsonResponse(
      { success: true, data: result },
      result.outcome === 'unknown_order' ? 202 : 200,
      requestId,
    )
  } catch (error) {
    logger.error('payment_webhook_processing_failed', { error, requestId })
    return jsonResponse(
      { success: false, error: 'Unable to process payment notification.' },
      500,
      requestId,
    )
  }
}

function getWebhookToleranceSeconds(): number {
  const configured = Number(process.env.PAYGATE_WEBHOOK_TOLERANCE_SECONDS)
  return Number.isFinite(configured) && configured > 0 ? configured : 300
}

function createRequestId(): string {
  return crypto.randomUUID()
}

function jsonResponse(
  body: unknown,
  status: number,
  requestId: string,
): Response {
  return Response.json(body, {
    headers: { 'x-request-id': requestId },
    status,
  })
}

export const Route = createFileRoute('/api/payments/webhook')({
  server: {
    handlers: {
      POST: handlePaymentWebhook,
    },
  },
})

export { handlePaymentWebhook }
