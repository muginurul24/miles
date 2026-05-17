import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const transactionTypes = [
  'local',
  'overseas',
  'dining',
  'online',
  'travel',
] as const

type TransactionType = (typeof transactionTypes)[number]

interface EarningRateSeed {
  spend: number
  points: number
}

interface TransferPartnerSeed {
  program: string
  pointsRequired: number
  milesReceived: number
}

interface BenefitsSeed {
  lounge: boolean
  insurance: boolean
  transfer: boolean
}

interface CreditCardSeed {
  id: string
  name: string
  shortName: string
  bank: string
  network: string
  tier: string
  annualFee: number
  minIncome: number
  image: string
  earningRates: Record<TransactionType, EarningRateSeed>
  transferPartners: TransferPartnerSeed[]
  benefits: BenefitsSeed
  pros: string[]
  cons: string[]
  bestFor: string
  notIdealFor: string
}

const creditCards = [
  {
    id: 'bca-krisflyer-visa-infinite',
    name: 'BCA Singapore Airlines KrisFlyer Visa Infinite',
    shortName: 'BCA KrisFlyer Infinite',
    bank: 'BCA',
    network: 'Visa',
    tier: 'Infinite',
    annualFee: 1_000_000,
    minIncome: 50_000_000,
    image: 'https://picsum.photos/seed/bca-krisflyer-vi/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 1 },
      overseas: { spend: 5_000, points: 1 },
      dining: { spend: 10_000, points: 1 },
      online: { spend: 10_000, points: 1 },
      travel: { spend: 5_000, points: 1 },
    },
    transferPartners: [
      { program: 'KrisFlyer', pointsRequired: 1, milesReceived: 1 },
    ],
    benefits: { lounge: true, insurance: true, transfer: false },
    pros: [
      'Transfer 1:1 ke KrisFlyer',
      'Lounge access gratis',
      'Earning rate overseas sangat baik',
    ],
    cons: [
      'Annual fee Rp1 juta',
      'Min income Rp50 juta',
      'Local earning rate standar',
    ],
    bestFor: 'Traveler sering overseas dan loyal Singapore Airlines',
    notIdealFor: 'Pengguna mayoritas transaksi lokal',
  },
  {
    id: 'citi-premiermiles',
    name: 'Citi PremierMiles Visa Signature',
    shortName: 'Citi PremierMiles',
    bank: 'Citibank',
    network: 'Visa',
    tier: 'Signature',
    annualFee: 750_000,
    minIncome: 30_000_000,
    image: 'https://picsum.photos/seed/citi-premier/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 1 },
      overseas: { spend: 6_000, points: 1 },
      dining: { spend: 10_000, points: 1 },
      online: { spend: 10_000, points: 1 },
      travel: { spend: 6_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 2, milesReceived: 1 },
      { program: 'KrisFlyer', pointsRequired: 2, milesReceived: 1 },
      { program: 'Asia Miles', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: true, transfer: false },
    pros: [
      'Banyak transfer partner',
      'Annual fee lebih terjangkau',
      'Earning rate overseas baik',
    ],
    cons: [
      'Tidak ada lounge access',
      'Conversion ratio 2:1',
      'Min income masih tinggi',
    ],
    bestFor: 'Fleksibilitas transfer ke banyak program miles',
    notIdealFor: 'Yang butuh lounge access gratis',
  },
  {
    id: 'bri-krisflyer-platinum',
    name: 'BRI Singapore Airlines KrisFlyer Visa Platinum',
    shortName: 'BRI KrisFlyer Platinum',
    bank: 'BRI',
    network: 'Visa',
    tier: 'Platinum',
    annualFee: 500_000,
    minIncome: 10_000_000,
    image: 'https://picsum.photos/seed/bri-krisflyer/400/250.jpg',
    earningRates: {
      local: { spend: 15_000, points: 1 },
      overseas: { spend: 8_000, points: 1 },
      dining: { spend: 15_000, points: 1 },
      online: { spend: 15_000, points: 1 },
      travel: { spend: 8_000, points: 1 },
    },
    transferPartners: [
      { program: 'KrisFlyer', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: false, transfer: false },
    pros: ['Annual fee rendah', 'Min income sangat rendah', 'Cocok pemula'],
    cons: ['Earning rate rendah', 'Tidak ada lounge', 'Conversion 2:1'],
    bestFor: 'Pemula yang mulai kumpulkan KrisFlyer miles',
    notIdealFor: 'Traveler premium yang butuh benefit lengkap',
  },
  {
    id: 'mandiri-garuda-platinum',
    name: 'Mandiri Garuda Indonesia Visa Platinum',
    shortName: 'Mandiri Garuda Platinum',
    bank: 'Mandiri',
    network: 'Visa',
    tier: 'Platinum',
    annualFee: 500_000,
    minIncome: 10_000_000,
    image: 'https://picsum.photos/seed/mandiri-garuda/400/250.jpg',
    earningRates: {
      local: { spend: 15_000, points: 1 },
      overseas: { spend: 10_000, points: 1 },
      dining: { spend: 10_000, points: 1 },
      online: { spend: 15_000, points: 1 },
      travel: { spend: 10_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: false, transfer: false },
    pros: [
      'Langsung ke GarudaMiles',
      'Annual fee terjangkau',
      'Dining earning rate baik',
    ],
    cons: [
      'Tidak bisa transfer ke program lain',
      'Tidak ada lounge',
      'Local earning rate rendah',
    ],
    bestFor: 'Pengguna setia Garuda Indonesia',
    notIdealFor: 'Yang butuh fleksibilitas transfer miles',
  },
  {
    id: 'bca-ultimate',
    name: 'BCA Visa Infinite',
    shortName: 'BCA Visa Infinite',
    bank: 'BCA',
    network: 'Visa',
    tier: 'Infinite',
    annualFee: 1_500_000,
    minIncome: 50_000_000,
    image: 'https://picsum.photos/seed/bca-ultimate/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 2 },
      overseas: { spend: 10_000, points: 2 },
      dining: { spend: 10_000, points: 2 },
      online: { spend: 10_000, points: 2 },
      travel: { spend: 10_000, points: 2 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 6, milesReceived: 1 },
      { program: 'Asia Miles', pointsRequired: 6, milesReceived: 1 },
    ],
    benefits: { lounge: true, insurance: true, transfer: true },
    pros: [
      '2x poin semua transaksi',
      'Lounge access',
      'Airport transfer',
      'Travel insurance komprehensif',
    ],
    cons: [
      'Annual fee sangat tinggi',
      'Conversion ratio 6:1',
      'Min income Rp50 juta',
    ],
    bestFor: 'High spender yang menghargai benefit premium',
    notIdealFor: 'Yang fokus kumpulkan miles efisien',
  },
  {
    id: 'cimb-travelworld',
    name: 'CIMB TravelWorld Visa Platinum',
    shortName: 'CIMB TravelWorld',
    bank: 'CIMB',
    network: 'Visa',
    tier: 'Platinum',
    annualFee: 350_000,
    minIncome: 8_000_000,
    image: 'https://picsum.photos/seed/cimb-travel/400/250.jpg',
    earningRates: {
      local: { spend: 20_000, points: 1 },
      overseas: { spend: 10_000, points: 1 },
      dining: { spend: 20_000, points: 1 },
      online: { spend: 20_000, points: 1 },
      travel: { spend: 10_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 2, milesReceived: 1 },
      { program: 'KrisFlyer', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: false, transfer: false },
    pros: [
      'Annual fee paling rendah',
      'Min income rendah',
      'Dua transfer partner',
    ],
    cons: [
      'Earning rate sangat rendah',
      'Tidak ada benefit travel',
      'Conversion 2:1',
    ],
    bestFor: 'Budget traveler yang mulai belajar miles',
    notIdealFor: 'Yang ingin kumpulkan miles cepat',
  },
  {
    id: 'danamon-go-green',
    name: 'Danamon GO Green Visa Platinum',
    shortName: 'Danamon GO Green',
    bank: 'Danamon',
    network: 'Visa',
    tier: 'Platinum',
    annualFee: 400_000,
    minIncome: 10_000_000,
    image: 'https://picsum.photos/seed/danamon-green/400/250.jpg',
    earningRates: {
      local: { spend: 15_000, points: 1 },
      overseas: { spend: 10_000, points: 1 },
      dining: { spend: 15_000, points: 1 },
      online: { spend: 15_000, points: 1 },
      travel: { spend: 10_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 3, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: false, transfer: false },
    pros: ['Annual fee terjangkau', 'Overseas earning rate oke'],
    cons: [
      'Conversion 3:1 kurang kompetitif',
      'Tidak ada lounge',
      'Min transfer partner',
    ],
    bestFor: 'Pengguna yang transaksi overseas sesekali',
    notIdealFor: 'Collector miles serius',
  },
  {
    id: 'ocbc-nsp-platinum',
    name: 'OCBC Nokia Series Platinum',
    shortName: 'OCBC NSP Platinum',
    bank: 'OCBC',
    network: 'Mastercard',
    tier: 'Platinum',
    annualFee: 500_000,
    minIncome: 15_000_000,
    image: 'https://picsum.photos/seed/ocbc-nsp/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 1 },
      overseas: { spend: 5_000, points: 1 },
      dining: { spend: 5_000, points: 1 },
      online: { spend: 10_000, points: 1 },
      travel: { spend: 5_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 2, milesReceived: 1 },
      { program: 'KrisFlyer', pointsRequired: 2, milesReceived: 1 },
      { program: 'Asia Miles', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: false, transfer: false },
    pros: [
      'Earning rate overseas & dining sangat baik',
      'Banyak transfer partner',
      'Annual fee reasonable',
    ],
    cons: [
      'Tidak ada lounge access',
      'Local earning rate standar',
      'Min income Rp15 juta',
    ],
    bestFor: 'Foodie dan traveler yang sering overseas',
    notIdealFor: 'Yang butuh lounge dan benefit premium',
  },
  {
    id: 'uob-prvi-miles',
    name: 'UOB PRVI Miles Visa Signature',
    shortName: 'UOB PRVI Miles',
    bank: 'UOB',
    network: 'Visa',
    tier: 'Signature',
    annualFee: 800_000,
    minIncome: 30_000_000,
    image: 'https://picsum.photos/seed/uob-prvi/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 1.2 },
      overseas: { spend: 10_000, points: 2 },
      dining: { spend: 10_000, points: 1.2 },
      online: { spend: 10_000, points: 1.2 },
      travel: { spend: 10_000, points: 2 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 2, milesReceived: 1 },
      { program: 'KrisFlyer', pointsRequired: 2, milesReceived: 1 },
      { program: 'Asia Miles', pointsRequired: 2, milesReceived: 1 },
      { program: 'Emirates Skywards', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: true, transfer: false },
    pros: [
      '1.2x poin lokal, 2x overseas/travel',
      '4 transfer partner',
      'Travel insurance',
    ],
    cons: ['Tidak ada lounge', 'Conversion 2:1', 'Annual fee cukup tinggi'],
    bestFor: 'Traveler yang sering overseas dan butuh fleksibilitas',
    notIdealFor: 'Yang fokus transaksi lokal saja',
  },
  {
    id: 'hsbc-premier',
    name: 'HSBC Premier Mastercard',
    shortName: 'HSBC Premier',
    bank: 'HSBC',
    network: 'Mastercard',
    tier: 'Premier',
    annualFee: 1_250_000,
    minIncome: 50_000_000,
    image: 'https://picsum.photos/seed/hsbc-premier/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 1 },
      overseas: { spend: 5_000, points: 1 },
      dining: { spend: 10_000, points: 1 },
      online: { spend: 10_000, points: 1 },
      travel: { spend: 5_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 2, milesReceived: 1 },
      { program: 'KrisFlyer', pointsRequired: 2, milesReceived: 1 },
      { program: 'Asia Miles', pointsRequired: 2, milesReceived: 1 },
      { program: 'British Airways', pointsRequired: 2, milesReceived: 1 },
    ],
    benefits: { lounge: true, insurance: true, transfer: true },
    pros: [
      'Lounge access global',
      'Airport transfer',
      '5 transfer partner',
      'Earning rate overseas sangat baik',
    ],
    cons: ['Annual fee tinggi', 'Harus jadi nasabah Premier', 'Conversion 2:1'],
    bestFor: 'Nasabah HSBC Premier yang sering travel internasional',
    notIdealFor: 'Non-nasabah HSBC',
  },
  {
    id: 'bca-mcard-platinum',
    name: 'BCA Mastercard Black',
    shortName: 'BCA Mastercard Black',
    bank: 'BCA',
    network: 'Mastercard',
    tier: 'Black',
    annualFee: 1_200_000,
    minIncome: 30_000_000,
    image: 'https://picsum.photos/seed/bca-mcard-blk/400/250.jpg',
    earningRates: {
      local: { spend: 10_000, points: 1 },
      overseas: { spend: 5_000, points: 1 },
      dining: { spend: 10_000, points: 1 },
      online: { spend: 10_000, points: 1 },
      travel: { spend: 5_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 5, milesReceived: 1 },
      { program: 'KrisFlyer', pointsRequired: 5, milesReceived: 1 },
    ],
    benefits: { lounge: true, insurance: true, transfer: true },
    pros: ['Lounge access', 'Airport transfer', 'Earning rate overseas baik'],
    cons: [
      'Conversion 5:1 sangat buruk untuk miles',
      'Annual fee tinggi',
      'Lebih cocok untuk cashback',
    ],
    bestFor: 'Yang menghargai benefit lifestyle, bukan miles collector',
    notIdealFor: 'Yang fokus kumpulkan miles efisien',
  },
  {
    id: 'mega-travel-card',
    name: 'Mega Travel Card Visa Platinum',
    shortName: 'Mega Travel Card',
    bank: 'Mega',
    network: 'Visa',
    tier: 'Platinum',
    annualFee: 300_000,
    minIncome: 5_000_000,
    image: 'https://picsum.photos/seed/mega-travel/400/250.jpg',
    earningRates: {
      local: { spend: 20_000, points: 1 },
      overseas: { spend: 15_000, points: 1 },
      dining: { spend: 20_000, points: 1 },
      online: { spend: 20_000, points: 1 },
      travel: { spend: 15_000, points: 1 },
    },
    transferPartners: [
      { program: 'GarudaMiles', pointsRequired: 3, milesReceived: 1 },
    ],
    benefits: { lounge: false, insurance: false, transfer: false },
    pros: ['Annual fee sangat murah', 'Min income sangat rendah'],
    cons: [
      'Earning rate sangat rendah',
      'Conversion 3:1',
      'Tidak ada benefit travel',
    ],
    bestFor: 'Pemula dengan budget terbatas',
    notIdealFor: 'Siapa pun yang serius kumpulkan miles',
  },
] satisfies CreditCardSeed[]

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

async function main(): Promise<void> {
  console.log('🌱 Seeding database...')

  const cardCount = await seedCreditCards()

  console.log(`✅ Created ${cardCount} credit cards`)
}

main()
  .catch((error: unknown) => {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
