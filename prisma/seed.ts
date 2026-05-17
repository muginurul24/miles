import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

import { articles } from './seeds/articles'
import { consultingPackages } from './seeds/consulting-packages'
import { creditCards } from './seeds/credit-cards'
import { membershipTiers } from './seeds/membership-tiers'
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

async function seedMembershipTiers(): Promise<number> {
  await prisma.membershipTier.deleteMany()

  await prisma.membershipTier.createMany({
    data: membershipTiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      priceIdr: tier.priceIdr,
      period: tier.period,
      features: tier.features,
      isHighlighted: tier.isHighlighted,
      sortOrder: tier.sortOrder,
    })),
  })

  return membershipTiers.length
}

async function seedConsultingPackages(): Promise<number> {
  await prisma.consultingPackage.deleteMany()

  await prisma.consultingPackage.createMany({
    data: consultingPackages.map((consultingPackage) => ({
      id: consultingPackage.id,
      name: consultingPackage.name,
      description: consultingPackage.description,
      priceIdr: consultingPackage.priceIdr,
      priceLabel: consultingPackage.priceLabel,
      outputs: consultingPackage.outputs,
      icon: consultingPackage.icon,
    })),
  })

  return consultingPackages.length
}

async function main(): Promise<void> {
  console.log('🌱 Seeding database...')

  const cardCount = await seedCreditCards()
  const articleCount = await seedArticles()
  const membershipTierCount = await seedMembershipTiers()
  const consultingPackageCount = await seedConsultingPackages()

  console.log(`✅ Created ${cardCount} credit cards`)
  console.log(`✅ Created ${articleCount} articles`)
  console.log(`✅ Created ${membershipTierCount} membership tiers`)
  console.log(`✅ Created ${consultingPackageCount} consulting packages`)
}

main()
  .catch((error: unknown) => {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
