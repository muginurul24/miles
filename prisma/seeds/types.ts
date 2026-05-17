export const transactionTypes = [
  'local',
  'overseas',
  'dining',
  'online',
  'travel',
] as const

export type TransactionType = (typeof transactionTypes)[number]

export interface EarningRateSeed {
  spend: number
  points: number
}

export interface TransferPartnerSeed {
  program: string
  pointsRequired: number
  milesReceived: number
}

export interface BenefitsSeed {
  lounge: boolean
  insurance: boolean
  transfer: boolean
}

export interface CreditCardSeed {
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

export interface ArticleSeed {
  id: string
  title: string
  category: string
  subCategory?: string
  excerpt: string
  author: string
  date: string
  image: string
  premium: boolean
  dealTag?: string
}

export interface MembershipTierSeed {
  id: string
  name: string
  priceIdr: number
  period: string
  features: string[]
  isHighlighted: boolean
  sortOrder: number
}

export interface ConsultingPackageSeed {
  id: string
  name: string
  description: string
  priceIdr: number | null
  priceLabel: string
  outputs: string[]
  icon: string
}
