import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyPaygateWebhookSignature } from '#/lib/payment-webhook'

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
})
