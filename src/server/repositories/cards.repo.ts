import { prisma } from '#/db'
import { DEFAULT_TTL, cacheHash, cached } from '#/lib/cache'

import type { Prisma } from '#/generated/prisma/client'

export type CardSort = 'name' | 'fee_asc' | 'fee_desc' | 'earning_best'

export interface CardFilters {
  bank?: string
  partner?: string
  search?: string
  sort?: CardSort
}

const cardRelations = {
  earningRates: true,
  transferPartners: true,
  pros: true,
  cons: true,
} satisfies Prisma.CreditCardInclude

const cardPreviewRelations = {
  earningRates: true,
  transferPartners: true,
} satisfies Prisma.CreditCardInclude

export type CardWithRelations = Prisma.CreditCardGetPayload<{
  include: typeof cardRelations
}>

export type CardPreview = Prisma.CreditCardGetPayload<{
  include: typeof cardPreviewRelations
}>

function buildCardWhere(filters: CardFilters): Prisma.CreditCardWhereInput {
  const search = filters.search?.trim()

  return {
    ...(filters.bank ? { bank: filters.bank } : {}),
    ...(filters.partner
      ? { transferPartners: { some: { program: filters.partner } } }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { shortName: { contains: search, mode: 'insensitive' } },
            { bank: { contains: search, mode: 'insensitive' } },
            { tier: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }
}

function getCardOrderBy(
  sort: CardSort,
): Prisma.CreditCardOrderByWithRelationInput[] {
  if (sort === 'fee_asc') {
    return [{ annualFee: 'asc' }, { name: 'asc' }]
  }

  if (sort === 'fee_desc') {
    return [{ annualFee: 'desc' }, { name: 'asc' }]
  }

  return [{ name: 'asc' }]
}

function getBestSpendPerPoint(card: CardPreview): number {
  if (card.earningRates.length === 0) {
    return Number.POSITIVE_INFINITY
  }

  return Math.min(...card.earningRates.map((rate) => rate.spendPerPoint))
}

function sortByEarningBest<T extends CardPreview>(cards: T[]): T[] {
  return [...cards].sort((first, second) => {
    const spendDelta =
      getBestSpendPerPoint(first) - getBestSpendPerPoint(second)

    if (spendDelta !== 0) {
      return spendDelta
    }

    return first.name.localeCompare(second.name)
  })
}

export const cardsRepo = {
  async findAll(filters: CardFilters = {}): Promise<CardWithRelations[]> {
    return cached(
      `cards:list:${cacheHash(filters)}`,
      DEFAULT_TTL.CARDS_LIST,
      async () => {
        const sort = filters.sort ?? 'name'
        const cards = await prisma.creditCard.findMany({
          where: buildCardWhere(filters),
          include: cardRelations,
          orderBy: getCardOrderBy(sort),
        })

        return sort === 'earning_best' ? sortByEarningBest(cards) : cards
      },
    )
  },

  async findTopByEarning(limit = 3): Promise<CardPreview[]> {
    return cached(`cards:top:${limit}`, DEFAULT_TTL.CARDS_LIST, async () => {
      const cards = await prisma.creditCard.findMany({
        include: cardPreviewRelations,
        orderBy: [{ name: 'asc' }],
      })

      return sortByEarningBest(cards).slice(0, limit)
    })
  },

  async findBySlug(slug: string): Promise<CardWithRelations | null> {
    return cached(`cards:detail:${slug}`, DEFAULT_TTL.CARD_DETAIL, () =>
      prisma.creditCard.findUnique({
        where: { id: slug },
        include: cardRelations,
      }),
    )
  },

  async findSimilar(slug: string, limit = 3): Promise<CardPreview[]> {
    return cached(
      `cards:similar:${slug}:${limit}`,
      DEFAULT_TTL.CARDS_LIST,
      async () => {
        const card = await prisma.creditCard.findUnique({
          where: { id: slug },
          include: { transferPartners: true },
        })

        if (!card) {
          return []
        }

        const partnerPrograms = card.transferPartners.map(
          (partner) => partner.program,
        )

        return prisma.creditCard.findMany({
          where: {
            id: { not: slug },
            OR: [
              { bank: card.bank },
              {
                transferPartners: {
                  some: { program: { in: partnerPrograms } },
                },
              },
            ],
          },
          include: cardPreviewRelations,
          orderBy: [{ bank: 'asc' }, { name: 'asc' }],
          take: limit,
        })
      },
    )
  },

  async findByPartner(program: string): Promise<CardWithRelations[]> {
    return cached(
      `cards:list:${cacheHash({ partner: program })}`,
      DEFAULT_TTL.CARDS_LIST,
      () =>
        prisma.creditCard.findMany({
          where: { transferPartners: { some: { program } } },
          include: cardRelations,
          orderBy: [{ bank: 'asc' }, { name: 'asc' }],
        }),
    )
  },

  async getBanks(): Promise<string[]> {
    return cached('cards:filters:banks', DEFAULT_TTL.CARDS_LIST, async () => {
      const banks = await prisma.creditCard.findMany({
        distinct: ['bank'],
        orderBy: { bank: 'asc' },
        select: { bank: true },
      })

      return banks.map((item) => item.bank)
    })
  },

  async getAllPartners(): Promise<string[]> {
    return cached(
      'cards:filters:partners',
      DEFAULT_TTL.CARDS_LIST,
      async () => {
        const partners = await prisma.transferPartner.findMany({
          distinct: ['program'],
          orderBy: { program: 'asc' },
          select: { program: true },
        })

        return partners.map((item) => item.program)
      },
    )
  },
}
