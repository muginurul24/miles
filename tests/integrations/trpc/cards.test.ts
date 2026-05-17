import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trpcRouter } from '#/integrations/trpc/router'
import { cardApplicationsRepo } from '#/server/repositories/card-applications.repo'
import { cardsRepo } from '#/server/repositories/cards.repo'

vi.mock('#/server/repositories/cards.repo', () => ({
  cardsRepo: {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    getBanks: vi.fn(),
    getAllPartners: vi.fn(),
  },
}))

vi.mock('#/server/repositories/card-applications.repo', () => ({
  cardApplicationsRepo: {
    create: vi.fn(),
  },
}))

const mockedCardsRepo = vi.mocked(cardsRepo)
const mockedApplicationsRepo = vi.mocked(cardApplicationsRepo)

describe('cards router', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return cards when valid list filters are provided', async () => {
    mockedCardsRepo.findAll.mockResolvedValue([])
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.cards.list({
        bank: 'BCA',
        partner: 'KrisFlyer',
        search: 'Infinite',
        sort: 'earning_best',
      }),
    ).resolves.toEqual([])
    expect(mockedCardsRepo.findAll).toHaveBeenCalledWith({
      bank: 'BCA',
      partner: 'KrisFlyer',
      search: 'Infinite',
      sort: 'earning_best',
    })
  })

  it('should reject unsupported card sort values', async () => {
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.cards.list({
        sort: 'unsupported' as never,
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })

  it('should return a card when slug exists', async () => {
    mockedCardsRepo.findBySlug.mockResolvedValue({
      id: 'bca-krisflyer-visa-infinite',
    } as never)
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.cards.getBySlug({ slug: 'bca-krisflyer-visa-infinite' }),
    ).resolves.toMatchObject({
      id: 'bca-krisflyer-visa-infinite',
    })
  })

  it('should return not found when slug does not exist', async () => {
    mockedCardsRepo.findBySlug.mockResolvedValue(null)
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.cards.getBySlug({ slug: 'missing-card' }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Kartu tidak ditemukan.',
    })
  })

  it('should return filter options', async () => {
    mockedCardsRepo.getBanks.mockResolvedValue(['BCA', 'BRI'])
    mockedCardsRepo.getAllPartners.mockResolvedValue([
      'GarudaMiles',
      'KrisFlyer',
    ])
    const caller = trpcRouter.createCaller({ session: null })

    await expect(caller.cards.filters()).resolves.toEqual({
      banks: ['BCA', 'BRI'],
      partners: ['GarudaMiles', 'KrisFlyer'],
    })
  })

  it('should record application interest when card exists', async () => {
    const receipt = {
      id: 'application-id',
      cardId: 'bca-krisflyer-visa-infinite',
      createdAt: new Date('2026-05-17T10:00:00.000Z'),
    }
    mockedCardsRepo.findBySlug.mockResolvedValue({
      id: 'bca-krisflyer-visa-infinite',
    } as never)
    mockedApplicationsRepo.create.mockResolvedValue(receipt)
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.cards.recordApplication({
        cardId: 'bca-krisflyer-visa-infinite',
      }),
    ).resolves.toEqual(receipt)
    expect(mockedApplicationsRepo.create).toHaveBeenCalledWith(
      'bca-krisflyer-visa-infinite',
    )
  })

  it('should reject application interest when card is missing', async () => {
    mockedCardsRepo.findBySlug.mockResolvedValue(null)
    const caller = trpcRouter.createCaller({ session: null })

    await expect(
      caller.cards.recordApplication({ cardId: 'missing-card' }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Kartu tidak ditemukan.',
    })
    expect(mockedApplicationsRepo.create).not.toHaveBeenCalled()
  })
})
