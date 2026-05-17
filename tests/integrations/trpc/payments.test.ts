import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { createPaygateCharge } from '#/lib/paygate'
import { membershipRepo } from '#/server/repositories/membership.repo'
import { paymentsRepo } from '#/server/repositories/payments.repo'

vi.mock('#/lib/paygate', () => ({
  createPaygateCharge: vi.fn(),
}))

vi.mock('#/server/repositories/membership.repo', () => ({
  membershipRepo: {
    findTiers: vi.fn(),
  },
}))

vi.mock('#/server/repositories/payments.repo', () => ({
  paymentsRepo: {
    createPendingOrder: vi.fn(),
    markChargeCreated: vi.fn(),
    markChargeFailed: vi.fn(),
    findOrderForUser: vi.fn(),
  },
}))

const mockedCreatePaygateCharge = vi.mocked(createPaygateCharge)
const mockedMembershipRepo = vi.mocked(membershipRepo)
const mockedPaymentsRepo = vi.mocked(paymentsRepo)

function createContext() {
  return {
    session: {
      session: {
        id: 'session-id',
        token: 'session-token',
        userId: 'user-id',
        expiresAt: new Date('2030-01-01T00:00:00.000Z'),
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: 'user-id',
        name: 'Rafi',
        email: 'rafi@example.com',
        emailVerified: true,
        image: null,
        membershipTier: 'free',
        membershipExpiresAt: null,
        role: 'user',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    },
  }
}

describe('payments router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.PAYGATE_CALLBACK_URL =
      'https://justmiles.id/api/payments/webhook'
  })

  it('should create a membership checkout for paid tiers', async () => {
    mockedMembershipRepo.findTiers.mockResolvedValue([
      {
        id: 'pro',
        name: 'Pro',
        priceIdr: 99_000,
        period: 'month',
        features: [],
        isHighlighted: true,
        sortOrder: 3,
      },
    ])
    mockedCreatePaygateCharge.mockResolvedValue({
      transaction_id: 'tx-1',
      order_id: 'order-1',
      platform_order_id: 'store_order-1',
      status: 'pending',
      payment_type: 'bank_transfer',
      payment_method: 'bca',
      amount: 99_000,
      midtrans: {},
    })
    const caller = trpcRouter.createCaller(createContext())

    const result = await caller.payments.createMembershipCheckout({
      tierId: 'pro',
      bank: 'bca',
    })

    expect(result.orderId).toMatch(/^JM-/)
    expect(mockedPaymentsRepo.createPendingOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-id',
        tierId: 'pro',
        amount: 99_000,
      }),
    )
    expect(mockedCreatePaygateCharge).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 99_000,
        callbackUrl: 'https://justmiles.id/api/payments/webhook',
      }),
    )
    expect(mockedPaymentsRepo.markChargeCreated).toHaveBeenCalled()
  })

  it('should reject non-purchasable tiers', async () => {
    mockedMembershipRepo.findTiers.mockResolvedValue([
      {
        id: 'free',
        name: 'Free',
        priceIdr: 0,
        period: 'forever',
        features: [],
        isHighlighted: false,
        sortOrder: 1,
      },
    ])
    const caller = trpcRouter.createCaller(createContext())

    await expect(
      caller.payments.createMembershipCheckout({
        tierId: 'free',
        bank: 'bca',
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })
})
