import { prisma } from '#/db'

export interface MembershipTierView {
  id: string
  name: string
  priceIdr: number
  period: string
  features: string[]
  isHighlighted: boolean
  sortOrder: number | null
}

function normalizeFeatures(features: unknown): string[] {
  if (!Array.isArray(features)) {
    return []
  }

  return features.filter(
    (feature): feature is string => typeof feature === 'string',
  )
}

export const membershipRepo = {
  async findTiers(): Promise<MembershipTierView[]> {
    const tiers = await prisma.membershipTier.findMany({
      orderBy: [{ sortOrder: 'asc' }, { priceIdr: 'asc' }],
    })

    return tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      priceIdr: tier.priceIdr,
      period: tier.period,
      features: normalizeFeatures(tier.features),
      isHighlighted: tier.isHighlighted,
      sortOrder: tier.sortOrder,
    }))
  },
}
