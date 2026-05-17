import { prisma } from '#/db'

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

export type CardWithRelations = Prisma.CreditCardGetPayload<{
  include: typeof cardRelations
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

function getBestSpendPerPoint(card: CardWithRelations): number {
  if (card.earningRates.length === 0) {
    return Number.POSITIVE_INFINITY
  }

  return Math.min(...card.earningRates.map((rate) => rate.spendPerPoint))
}

function sortByEarningBest(cards: CardWithRelations[]): CardWithRelations[] {
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
    const sort = filters.sort ?? 'name'
    const cards = await prisma.creditCard.findMany({
      where: buildCardWhere(filters),
      include: cardRelations,
      orderBy: getCardOrderBy(sort),
    })

    return sort === 'earning_best' ? sortByEarningBest(cards) : cards
  },

  async findBySlug(slug: string): Promise<CardWithRelations | null> {
    return prisma.creditCard.findUnique({
      where: { id: slug },
      include: cardRelations,
    })
  },

  async findByPartner(program: string): Promise<CardWithRelations[]> {
    return prisma.creditCard.findMany({
      where: { transferPartners: { some: { program } } },
      include: cardRelations,
      orderBy: [{ bank: 'asc' }, { name: 'asc' }],
    })
  },

  async getBanks(): Promise<string[]> {
    const banks = await prisma.creditCard.findMany({
      distinct: ['bank'],
      orderBy: { bank: 'asc' },
      select: { bank: true },
    })

    return banks.map((item) => item.bank)
  },

  async getAllPartners(): Promise<string[]> {
    const partners = await prisma.transferPartner.findMany({
      distinct: ['program'],
      orderBy: { program: 'asc' },
      select: { program: true },
    })

    return partners.map((item) => item.program)
  },
}
