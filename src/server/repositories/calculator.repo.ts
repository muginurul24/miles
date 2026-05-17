import { prisma } from '#/db'
import { DEFAULT_TTL, cached } from '#/lib/cache'

import type { Prisma } from '#/generated/prisma/client'

const calculatorCardSelect = {
  id: true,
  name: true,
  shortName: true,
  bank: true,
  annualFee: true,
  loungeAccess: true,
  travelInsurance: true,
  airportTransfer: true,
  earningRates: {
    orderBy: [{ transactionType: 'asc' }],
  },
  transferPartners: {
    orderBy: [{ program: 'asc' }],
  },
} satisfies Prisma.CreditCardSelect

export type CalculatorCard = Prisma.CreditCardGetPayload<{
  select: typeof calculatorCardSelect
}>

export const calculatorRepo = {
  async getCards(): Promise<CalculatorCard[]> {
    return cached('cards:calculator', DEFAULT_TTL.CARDS_LIST, () =>
      prisma.creditCard.findMany({
        orderBy: [{ bank: 'asc' }, { name: 'asc' }],
        select: calculatorCardSelect,
      }),
    )
  },

  async getCard(cardId: string): Promise<CalculatorCard | null> {
    return cached(`cards:calculator:${cardId}`, DEFAULT_TTL.CARD_DETAIL, () =>
      prisma.creditCard.findUnique({
        where: { id: cardId },
        select: calculatorCardSelect,
      }),
    )
  },
}
