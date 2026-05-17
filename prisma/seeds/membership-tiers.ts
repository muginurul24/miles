import type { MembershipTierSeed } from './types'

export const membershipTiers = [
  {
    id: 'free',
    name: 'Free',
    priceIdr: 0,
    period: 'forever',
    features: [
      'Akses artikel news dan deals gratis',
      'Kalkulator miles dasar',
      'Newsletter mingguan JustMiles',
    ],
    isHighlighted: false,
    sortOrder: 1,
  },
  {
    id: 'plus',
    name: 'Plus',
    priceIdr: 49_000,
    period: 'month',
    features: [
      'Semua fitur Free',
      'Akses guide premium pilihan',
      'Notifikasi promo transfer bonus',
      'Saved card shortlist',
    ],
    isHighlighted: false,
    sortOrder: 2,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceIdr: 99_000,
    period: 'month',
    features: [
      'Semua fitur Plus',
      'Akses semua konten premium',
      'Compare tool lanjutan',
      'Monthly strategy briefing',
    ],
    isHighlighted: true,
    sortOrder: 3,
  },
  {
    id: 'concierge',
    name: 'Concierge',
    priceIdr: 0,
    period: 'custom',
    features: [
      'Semua fitur Pro',
      'Sesi strategi personal',
      'Review portfolio kartu',
      'Perencanaan redemption kompleks',
    ],
    isHighlighted: false,
    sortOrder: 4,
  },
] satisfies MembershipTierSeed[]
