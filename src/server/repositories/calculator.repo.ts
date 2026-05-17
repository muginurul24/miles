import { prisma } from '#/db'

import type { Prisma } from '#/generated/prisma/client'

const calculatorCardSelect = {
  id: true,
  name: true,
  shortName: true,
  bank: true,
  annualFee: true,
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
    return prisma.creditCard.findMany({
      orderBy: [{ bank: 'asc' }, { name: 'asc' }],
      select: calculatorCardSelect,
    })
  },

  async getCard(cardId: string): Promise<CalculatorCard | null> {
    return prisma.creditCard.findUnique({
      where: { id: cardId },
      select: calculatorCardSelect,
    })
  },
}
