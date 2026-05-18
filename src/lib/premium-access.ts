export interface PremiumAccessUser {
  membershipExpiresAt?: Date | string | null
  membershipTier?: string | null
  role?: string | null
}

const premiumTiers = new Set(['plus', 'pro', 'concierge'])

function getExpiryTime(value: Date | string | null | undefined): number | null {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)
  const time = date.getTime()

  return Number.isFinite(time) ? time : null
}

export function hasPremiumAccess(
  user: PremiumAccessUser | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!user) {
    return false
  }

  if (user.role === 'admin') {
    return true
  }

  const tier = user.membershipTier ?? 'free'

  if (!premiumTiers.has(tier)) {
    return false
  }

  const expiryTime = getExpiryTime(user.membershipExpiresAt)

  if (!expiryTime) {
    return tier === 'concierge'
  }

  return expiryTime > now.getTime()
}
