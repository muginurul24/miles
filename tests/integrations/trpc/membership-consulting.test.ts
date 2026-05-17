import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { consultingRepo } from '#/server/repositories/consulting.repo'
import { membershipRepo } from '#/server/repositories/membership.repo'

vi.mock('#/server/repositories/consulting.repo', () => ({
  consultingRepo: {
    findPackages: vi.fn(),
    packageExists: vi.fn(),
    createInquiry: vi.fn(),
  },
}))

vi.mock('#/server/repositories/membership.repo', () => ({
  membershipRepo: {
    findTiers: vi.fn(),
  },
}))

const mockedConsultingRepo = vi.mocked(consultingRepo)
const mockedMembershipRepo = vi.mocked(membershipRepo)

describe('membership router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return membership tiers when requested', async () => {
    mockedMembershipRepo.findTiers.mockResolvedValue([
      {
        id: 'pro',
        name: 'Pro',
        priceIdr: 149_000,
        period: 'month',
        features: ['Premium guides'],
        isHighlighted: true,
        sortOrder: 3,
      },
    ])
    const caller = trpcRouter.createCaller({ session: null })

    await expect(caller.membership.tiers()).resolves.toEqual([
      {
        id: 'pro',
        name: 'Pro',
        priceIdr: 149_000,
        period: 'month',
        features: ['Premium guides'],
        isHighlighted: true,
        sortOrder: 3,
      },
    ])
  })
})

describe('consulting router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return consulting packages when requested', async () => {
    mockedConsultingRepo.findPackages.mockResolvedValue([
      {
        id: 'audit',
        name: 'Card Audit',
        description: 'Audit portfolio kartu.',
        priceIdr: 499_000,
        priceLabel: 'Rp499k',
        outputs: ['Checklist kartu'],
        icon: 'CreditCard',
      },
    ])
    const caller = trpcRouter.createCaller({ session: null })

    await expect(caller.consulting.packages()).resolves.toEqual([
      {
        id: 'audit',
        name: 'Card Audit',
        description: 'Audit portfolio kartu.',
        priceIdr: 499_000,
        priceLabel: 'Rp499k',
        outputs: ['Checklist kartu'],
        icon: 'CreditCard',
      },
    ])
  })

  it('should create inquiry when input is valid', async () => {
    mockedConsultingRepo.packageExists.mockResolvedValue(true)
    mockedConsultingRepo.createInquiry.mockResolvedValue({
      id: 'inquiry-id',
      status: 'new',
    })
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.consulting.submitInquiry({
        name: 'Rafi',
        email: 'RAFI@EXAMPLE.COM',
        phone: '+6281234567890',
        packageId: 'audit',
        currentCards: 'BCA KrisFlyer',
        needs: 'Saya ingin audit portfolio kartu untuk target trip Jepang.',
      }),
    ).resolves.toEqual({
      id: 'inquiry-id',
      status: 'new',
    })
    expect(mockedConsultingRepo.createInquiry).toHaveBeenCalledWith({
      name: 'Rafi',
      email: 'RAFI@EXAMPLE.COM',
      phone: '+6281234567890',
      packageId: 'audit',
      currentCards: 'BCA KrisFlyer',
      needs: 'Saya ingin audit portfolio kartu untuk target trip Jepang.',
    })
  })

  it('should reject inquiry when package does not exist', async () => {
    mockedConsultingRepo.packageExists.mockResolvedValue(false)
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.consulting.submitInquiry({
        name: 'Rafi',
        email: 'rafi@example.com',
        packageId: 'missing-package',
        needs: 'Saya ingin audit portfolio kartu untuk target trip Jepang.',
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'Paket konsultasi tidak ditemukan.',
    })
    expect(mockedConsultingRepo.createInquiry).not.toHaveBeenCalled()
  })

  it('should reject inquiry when required fields are invalid', async () => {
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.consulting.submitInquiry({
        name: 'R',
        email: 'not-an-email',
        packageId: '',
        needs: 'Terlalu pendek.',
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
    expect(mockedConsultingRepo.createInquiry).not.toHaveBeenCalled()
  })
})
