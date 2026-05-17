import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

import { articles } from './seeds/articles'
import { creditCards } from './seeds/credit-cards'
import { transactionTypes } from './seeds/types'
import type { ArticleSeed } from './seeds/types'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

function buildArticleContent(article: ArticleSeed): string {
  const dealContext = article.dealTag
    ? `Label deal: ${article.dealTag}. Prioritaskan cek masa berlaku, kuota, dan syarat bank sebelum transfer poin.`
    : 'Gunakan artikel ini sebagai titik awal sebelum membandingkan kartu, transfer partner, dan biaya tahunan.'

  return [
    article.excerpt,
    dealContext,
    `Tim JustMiles menilai konteks ${article.category.toLowerCase()} ini dari sisi value miles, fleksibilitas program, dan risiko devaluasi untuk pembaca Indonesia.`,
  ].join('\n\n')
}

async function seedCreditCards(): Promise<number> {
  await prisma.$transaction(async (tx) => {
    await tx.cardCon.deleteMany()
    await tx.cardPro.deleteMany()
    await tx.transferPartner.deleteMany()
    await tx.earningRate.deleteMany()
    await tx.creditCard.deleteMany()

    for (const card of creditCards) {
      await tx.creditCard.create({
        data: {
          id: card.id,
          name: card.name,
          shortName: card.shortName,
          bank: card.bank,
          network: card.network,
          tier: card.tier,
          annualFee: card.annualFee,
          minIncome: card.minIncome,
          imageUrl: card.image,
          bestFor: card.bestFor,
          notIdealFor: card.notIdealFor,
          loungeAccess: card.benefits.lounge,
          travelInsurance: card.benefits.insurance,
          airportTransfer: card.benefits.transfer,
          earningRates: {
            create: transactionTypes.map((transactionType) => ({
              transactionType,
              spendPerPoint: card.earningRates[transactionType].spend,
              pointsEarned: card.earningRates[transactionType].points,
            })),
          },
          transferPartners: {
            create: card.transferPartners,
          },
          pros: {
            create: card.pros.map((text) => ({ text })),
          },
          cons: {
            create: card.cons.map((text) => ({ text })),
          },
        },
      })
    }
  })

  return creditCards.length
}

async function seedArticles(): Promise<number> {
  await prisma.article.deleteMany()

  await prisma.article.createMany({
    data: articles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: buildArticleContent(article),
      category: article.category,
      subCategory: article.subCategory,
      author: article.author,
      imageUrl: article.image,
      premium: article.premium,
      dealTag: article.dealTag,
      publishedAt: new Date(`${article.date}T00:00:00.000Z`),
    })),
  })

  return articles.length
}

async function main(): Promise<void> {
  console.log('🌱 Seeding database...')

  const cardCount = await seedCreditCards()
  const articleCount = await seedArticles()

  console.log(`✅ Created ${cardCount} credit cards`)
  console.log(`✅ Created ${articleCount} articles`)
}

main()
  .catch((error: unknown) => {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
