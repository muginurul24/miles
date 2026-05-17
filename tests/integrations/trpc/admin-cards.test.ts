import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { adminRepo } from '#/server/repositories/admin.repo'

import type { TRPCContext } from '#/integrations/trpc/init'
import type { AdminCardRow } from '#/server/repositories/admin.repo'

vi.mock('#/server/repositories/admin.repo', () => ({
  adminRepo: {
    cardExists: vi.fn(),
    createCard: vi.fn(),
    deleteCard: vi.fn(),
    getOverview: vi.fn(),
    listCards: vi.fn(),
    updateCard: vi.fn(),
  },
}))

const mockedAdminRepo = vi.mocked(adminRepo)

function createContext(role: 'admin' | 'user' = 'admin'): TRPCContext {
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
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: false,
        image: null,
        membershipTier: 'free',
        role,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    },
  }
}

const cardInput = {
  id: 'bca-krisflyer-test',
  name: 'BCA Singapore Airlines KrisFlyer Visa Infinite',
  shortName: 'BCA KrisFlyer Infinite',
  bank: 'BCA',
  network: 'Visa',
  tier: 'Infinite',
  annualFee: 1_000_000,
  minIncome: 20_000_000,
  imageUrl: '',
  bestFor: 'Traveler yang fokus KrisFlyer.',
  notIdealFor: '',
  loungeAccess: true,
  travelInsurance: true,
  airportTransfer: false,
}

const cardRow: AdminCardRow = {
  ...cardInput,
  imageUrl: null,
  notIdealFor: null,
  updatedAt: new Date('2026-05-17T09:00:00.000Z'),
  earningRatesCount: 2,
  transferPartnersCount: 1,
}

describe('admin cards router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should list cards when user is admin', async () => {
    mockedAdminRepo.listCards.mockResolvedValue([cardRow])
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.cards()).resolves.toEqual([cardRow])
    expect(mockedAdminRepo.listCards).toHaveBeenCalledOnce()
  })

  it('should create card when slug is available', async () => {
    mockedAdminRepo.cardExists.mockResolvedValue(false)
    mockedAdminRepo.createCard.mockResolvedValue(cardRow)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.createCard(cardInput)).resolves.toEqual(cardRow)
    expect(mockedAdminRepo.createCard).toHaveBeenCalledWith({
      ...cardInput,
      imageUrl: null,
      notIdealFor: null,
    })
  })

  it('should reject create when slug already exists', async () => {
    mockedAdminRepo.cardExists.mockResolvedValue(true)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.createCard(cardInput)).rejects.toMatchObject({
      code: 'CONFLICT',
      message: 'ID kartu sudah digunakan.',
    })
    expect(mockedAdminRepo.createCard).not.toHaveBeenCalled()
  })

  it('should update card when card exists', async () => {
    mockedAdminRepo.cardExists.mockResolvedValue(true)
    mockedAdminRepo.updateCard.mockResolvedValue(cardRow)
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(caller.admin.updateCard(cardInput)).resolves.toEqual(cardRow)
    expect(mockedAdminRepo.updateCard).toHaveBeenCalledWith({
      ...cardInput,
      imageUrl: null,
      notIdealFor: null,
    })
  })

  it('should delete card when card exists', async () => {
    mockedAdminRepo.cardExists.mockResolvedValue(true)
    mockedAdminRepo.deleteCard.mockResolvedValue({ id: cardInput.id })
    const caller = trpcRouter.createCaller(createContext('admin'))

    await expect(
      caller.admin.deleteCard({ id: cardInput.id }),
    ).resolves.toEqual({
      id: cardInput.id,
    })
    expect(mockedAdminRepo.deleteCard).toHaveBeenCalledWith(cardInput.id)
  })

  it('should reject card procedures when user is not admin', async () => {
    const caller = trpcRouter.createCaller(createContext('user'))

    await expect(caller.admin.cards()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
    expect(mockedAdminRepo.listCards).not.toHaveBeenCalled()
  })
})
