import type { ConsultingPackageSeed } from './types'

export const consultingPackages = [
  {
    id: 'card-audit',
    name: 'Card Audit',
    description:
      'Audit portfolio kartu kredit untuk menemukan kartu yang perlu dipertahankan, di-upgrade, atau ditutup.',
    priceIdr: 299_000,
    priceLabel: 'Rp299K',
    outputs: [
      'Ringkasan value tiap kartu',
      'Rekomendasi keep, upgrade, atau cancel',
      'Prioritas kartu untuk transaksi utama',
    ],
    icon: 'CreditCard',
  },
  {
    id: 'redemption-plan',
    name: 'Redemption Plan',
    description:
      'Rencana penukaran miles untuk rute tertentu dengan opsi program, pajak, dan fallback availability.',
    priceIdr: 499_000,
    priceLabel: 'Rp499K',
    outputs: [
      'Opsi program miles terbaik',
      'Estimasi miles dan surcharge',
      'Checklist tanggal dan partner booking',
    ],
    icon: 'Route',
  },
  {
    id: 'full-strategy',
    name: 'Full Strategy',
    description:
      'Strategi end-to-end untuk earning, transfer, dan redemption berdasarkan profil transaksi tahunan.',
    priceIdr: 899_000,
    priceLabel: 'Rp899K',
    outputs: [
      'Roadmap kartu 12 bulan',
      'Strategi earning per kategori transaksi',
      'Plan redemption utama dan alternatif',
    ],
    icon: 'Sparkles',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description:
      'Konsultasi untuk tim atau bisnis yang ingin mengoptimalkan pengeluaran travel dan kartu korporat.',
    priceIdr: null,
    priceLabel: 'Custom',
    outputs: [
      'Workshop strategi miles untuk tim',
      'Framework kebijakan kartu korporat',
      'Dashboard rekomendasi pengeluaran travel',
    ],
    icon: 'Building2',
  },
] satisfies ConsultingPackageSeed[]
