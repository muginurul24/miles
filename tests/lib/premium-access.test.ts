import { describe, expect, it } from 'vitest'
import { hasPremiumAccess } from '#/lib/premium-access'

const now = new Date('2026-05-18T00:00:00.000Z')

describe('hasPremiumAccess', () => {
  it('should reject access when user is missing', () => {
    expect(hasPremiumAccess(null, now)).toBe(false)
  })

  it('should allow access when user is admin', () => {
    expect(hasPremiumAccess({ role: 'admin' }, now)).toBe(true)
  })

  it('should reject access when user has free tier', () => {
    expect(hasPremiumAccess({ membershipTier: 'free' }, now)).toBe(false)
  })

  it('should allow access when paid membership is still active', () => {
    expect(
      hasPremiumAccess(
        {
          membershipExpiresAt: '2026-06-18T00:00:00.000Z',
          membershipTier: 'plus',
        },
        now,
      ),
    ).toBe(true)
  })

  it('should reject access when paid membership has expired', () => {
    expect(
      hasPremiumAccess(
        {
          membershipExpiresAt: '2026-04-18T00:00:00.000Z',
          membershipTier: 'pro',
        },
        now,
      ),
    ).toBe(false)
  })

  it('should allow access when concierge tier has no expiry', () => {
    expect(hasPremiumAccess({ membershipTier: 'concierge' }, now)).toBe(true)
  })
})
