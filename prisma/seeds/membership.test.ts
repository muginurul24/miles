import { describe, expect, it } from 'vitest'

import { consultingPackages } from './consulting-packages'
import { membershipTiers } from './membership-tiers'

describe('membership and consulting seed data', () => {
  it('should include four membership tiers when seeding subscriptions', () => {
    expect(membershipTiers).toHaveLength(4)
    expect(membershipTiers.map((tier) => tier.id)).toEqual([
      'free',
      'plus',
      'pro',
      'concierge',
    ])
  })

  it('should highlight only the Pro tier when rendering pricing cards', () => {
    const highlightedTiers = membershipTiers.filter((tier) => {
      return tier.isHighlighted
    })

    expect(highlightedTiers).toHaveLength(1)
    expect(highlightedTiers[0]?.id).toBe('pro')
    expect(highlightedTiers[0]?.priceIdr).toBe(99_000)
  })

  it('should store membership features as JSON-ready arrays', () => {
    for (const tier of membershipTiers) {
      expect(Array.isArray(tier.features)).toBe(true)
      expect(tier.features.length).toBeGreaterThan(0)
    }
  })

  it('should include four consulting packages when seeding services', () => {
    expect(consultingPackages).toHaveLength(4)
    expect(consultingPackages.map((item) => item.id)).toEqual([
      'card-audit',
      'redemption-plan',
      'full-strategy',
      'corporate',
    ])
  })

  it('should store consulting outputs as JSON-ready arrays', () => {
    for (const consultingPackage of consultingPackages) {
      expect(Array.isArray(consultingPackage.outputs)).toBe(true)
      expect(consultingPackage.outputs.length).toBeGreaterThan(0)
    }
  })

  it('should keep custom consulting pricing nullable when price is not fixed', () => {
    const corporate = consultingPackages.find((item) => item.id === 'corporate')

    expect(corporate?.priceIdr).toBeNull()
    expect(corporate?.priceLabel).toBe('Custom')
  })
})
