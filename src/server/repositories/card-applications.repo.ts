import { prisma } from '#/db'

export interface CardApplicationReceipt {
  id: string
  cardId: string
  createdAt: Date
}

export const cardApplicationsRepo = {
  async create(cardId: string): Promise<CardApplicationReceipt> {
    return prisma.cardApplication.create({
      data: { cardId },
      select: {
        id: true,
        cardId: true,
        createdAt: true,
      },
    })
  },
}
