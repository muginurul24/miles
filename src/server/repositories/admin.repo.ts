import { prisma } from '#/db'

import type { Prisma } from '#/generated/prisma/client'
import type {
  AdminArticleCreateInput,
  AdminArticleUpdateInput,
} from '#/lib/schemas/admin-article'
import type {
  AdminCardCreateInput,
  AdminCardUpdateInput,
} from '#/lib/schemas/admin-card'

const adminCardSelect = {
  id: true,
  name: true,
  shortName: true,
  bank: true,
  network: true,
  tier: true,
  annualFee: true,
  minIncome: true,
  imageUrl: true,
  bestFor: true,
  notIdealFor: true,
  loungeAccess: true,
  travelInsurance: true,
  airportTransfer: true,
  updatedAt: true,
  _count: {
    select: {
      earningRates: true,
      transferPartners: true,
    },
  },
} satisfies Prisma.CreditCardSelect

type AdminCardRecord = Prisma.CreditCardGetPayload<{
  select: typeof adminCardSelect
}>

const adminArticleSelect = {
  id: true,
  title: true,
  excerpt: true,
  content: true,
  category: true,
  subCategory: true,
  author: true,
  imageUrl: true,
  premium: true,
  dealTag: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.ArticleSelect

export interface AdminCardRow {
  id: string
  name: string
  shortName: string
  bank: string
  network: string
  tier: string
  annualFee: number
  minIncome: number
  imageUrl: string | null
  bestFor: string | null
  notIdealFor: string | null
  loungeAccess: boolean
  travelInsurance: boolean
  airportTransfer: boolean
  updatedAt: Date
  earningRatesCount: number
  transferPartnersCount: number
}

export type AdminArticleRow = Prisma.ArticleGetPayload<{
  select: typeof adminArticleSelect
}>

function toAdminCardRow(card: AdminCardRecord): AdminCardRow {
  return {
    id: card.id,
    name: card.name,
    shortName: card.shortName,
    bank: card.bank,
    network: card.network,
    tier: card.tier,
    annualFee: card.annualFee,
    minIncome: card.minIncome,
    imageUrl: card.imageUrl,
    bestFor: card.bestFor,
    notIdealFor: card.notIdealFor,
    loungeAccess: card.loungeAccess,
    travelInsurance: card.travelInsurance,
    airportTransfer: card.airportTransfer,
    updatedAt: card.updatedAt,
    earningRatesCount: card._count.earningRates,
    transferPartnersCount: card._count.transferPartners,
  }
}

export const adminRepo = {
  async listCards(): Promise<AdminCardRow[]> {
    const cards = await prisma.creditCard.findMany({
      orderBy: [{ bank: 'asc' }, { name: 'asc' }],
      select: adminCardSelect,
    })

    return cards.map(toAdminCardRow)
  },

  async cardExists(id: string): Promise<boolean> {
    const card = await prisma.creditCard.findUnique({
      where: { id },
      select: { id: true },
    })

    return card !== null
  },

  async createCard(input: AdminCardCreateInput): Promise<AdminCardRow> {
    const card = await prisma.creditCard.create({
      data: input,
      select: adminCardSelect,
    })

    return toAdminCardRow(card)
  },

  async updateCard(input: AdminCardUpdateInput): Promise<AdminCardRow> {
    const { id, ...data } = input
    const card = await prisma.creditCard.update({
      where: { id },
      data,
      select: adminCardSelect,
    })

    return toAdminCardRow(card)
  },

  async deleteCard(id: string): Promise<{ id: string }> {
    return prisma.creditCard.delete({
      where: { id },
      select: { id: true },
    })
  },

  async listArticles(): Promise<AdminArticleRow[]> {
    return prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: adminArticleSelect,
    })
  },

  async articleExists(id: string): Promise<boolean> {
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true },
    })

    return article !== null
  },

  async createArticle(
    input: AdminArticleCreateInput,
  ): Promise<AdminArticleRow> {
    return prisma.article.create({
      data: input,
      select: adminArticleSelect,
    })
  },

  async updateArticle(
    input: AdminArticleUpdateInput,
  ): Promise<AdminArticleRow> {
    const { id, ...data } = input

    return prisma.article.update({
      where: { id },
      data,
      select: adminArticleSelect,
    })
  },

  async deleteArticle(id: string): Promise<{ id: string }> {
    return prisma.article.delete({
      where: { id },
      select: { id: true },
    })
  },
}
