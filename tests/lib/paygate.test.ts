import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPaygateCharge, getPaygateTransaction } from '#/lib/paygate'

describe('paygate client', () => {
  beforeEach(() => {
    process.env.PAYGATE_BASE_URL = 'https://paygate.example.com'
    process.env.PAYGATE_STORE_TOKEN = 'sk_live_test'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should create a charge with authorization and idempotency headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            transaction_id: 'tx-1',
            order_id: 'order-1',
            platform_order_id: 'store_order-1',
            status: 'pending',
            payment_type: 'bank_transfer',
            payment_method: 'bsi',
            amount: 1000,
            midtrans: {},
          },
        }),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createPaygateCharge({
        orderId: 'order-1',
        amount: 1000,
        paymentType: 'bank_transfer',
        bank: 'bsi',
        customer: { name: 'Rafi', email: 'rafi@example.com' },
        items: [
          {
            id: 'tier-pro',
            name: 'Membership Pro',
            price: 1000,
            quantity: 1,
          },
        ],
        callbackUrl: 'https://justmiles.id/api/payments/webhook',
        metadata: { kind: 'membership' },
      }),
    ).resolves.toMatchObject({
      order_id: 'order-1',
      payment_method: 'bsi',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://paygate.example.com/v1/transactions/charge',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk_live_test',
          'Idempotency-Key': 'order-1',
        }),
      }),
    )
  })

  it('should fetch a transaction by order ID', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: {
              transaction_id: 'tx-1',
              order_id: 'order-1',
              platform_order_id: 'store_order-1',
              status: 'paid',
              payment_type: 'bank_transfer',
              payment_method: 'bsi',
              amount: 1000,
              midtrans: {},
            },
          }),
        ),
      ),
    )

    await expect(getPaygateTransaction('order-1')).resolves.toMatchObject({
      status: 'paid',
    })
  })

  it('should surface invalid JSON responses as gateway errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not-json')))

    await expect(getPaygateTransaction('order-1')).rejects.toMatchObject({
      name: 'PaygateError',
      status: 200,
      responseBody: 'not-json',
    })
  })
})
