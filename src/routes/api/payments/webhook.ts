import { createFileRoute } from '@tanstack/react-router'
import {
  paygateWebhookPayloadSchema,
  verifyPaygateWebhookSignature,
} from '#/lib/payment-webhook'
import { paymentsRepo } from '#/server/repositories/payments.repo'

async function handlePaymentWebhook({
  request,
}: {
  request: Request
}): Promise<Response> {
  const rawBody = await request.text()
  const webhookSecret = process.env.PAYGATE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return Response.json(
      { success: false, error: 'Webhook secret is not configured.' },
      { status: 500 },
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
    return Response.json(
      { success: false, error: 'Invalid webhook signature.' },
      { status: 401 },
    )
  }

  let parsedPayload: unknown
  try {
    parsedPayload = JSON.parse(rawBody) as unknown
  } catch {
    return Response.json(
      { success: false, error: 'Invalid webhook payload.' },
      { status: 400 },
    )
  }

  const parsed = paygateWebhookPayloadSchema.safeParse(parsedPayload)
  if (!parsed.success) {
    return Response.json(
      { success: false, error: 'Invalid webhook payload.' },
      { status: 400 },
    )
  }

  await paymentsRepo.processWebhook(parsed.data)

  return Response.json({ success: true })
}

function getWebhookToleranceSeconds(): number {
  const configured = Number(process.env.PAYGATE_WEBHOOK_TOLERANCE_SECONDS)
  return Number.isFinite(configured) && configured > 0 ? configured : 300
}

export const Route = createFileRoute('/api/payments/webhook')({
  server: {
    handlers: {
      POST: handlePaymentWebhook,
    },
  },
})

export { handlePaymentWebhook }
