import {
  Calculator,
  Compass,
  CreditCard,
  MapPinned,
  Newspaper,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

export interface Metric {
  value: string
  label: string
}

export interface Service {
  title: string
  description: string
  icon: LucideIcon
}

export interface TeamMember {
  name: string
  role: string
  description: string
  icon: LucideIcon
}

export const metrics = [
  { value: '12+', label: 'kartu kredit dianalisis untuk earning rate' },
  { value: '5', label: 'program transfer miles utama Indonesia' },
  { value: '20+', label: 'artikel awal untuk news, guides, deals, reviews' },
  { value: '4', label: 'jalur keputusan: kartu, miles, konten, consulting' },
] as const satisfies readonly Metric[]

export const services = [
  {
    title: 'Credit card intelligence',
    description:
      'Direktori kartu, earning rate per transaksi, transfer partner, annual fee, benefits, dan trade-off yang mudah dibandingkan.',
    icon: CreditCard,
  },
  {
    title: 'Miles calculator',
    description:
      'Formula transparan untuk menghitung poin, miles, IDR per mile, dan rating value sebelum kamu memindahkan spending.',
    icon: Calculator,
  },
  {
    title: 'Travel media',
    description:
      'News, guides, deals, flight reviews, hotel reviews, dan lounge reviews yang disaring untuk traveler Indonesia.',
    icon: Newspaper,
  },
  {
    title: 'Strategy consulting',
    description:
      'Audit portfolio kartu, rencana redemption, dan roadmap miles saat keputusanmu sudah konkret dan bernilai tinggi.',
    icon: Compass,
  },
] as const satisfies readonly Service[]

export const principles = [
  'Nilai dihitung dengan asumsi yang bisa diaudit, bukan klaim promosi.',
  'Rekomendasi harus menjelaskan trade-off: biaya, effort, risiko devaluasi, dan availability.',
  'Konten gratis cukup berguna untuk memulai; premium dan consulting dipakai saat keputusan lebih mahal.',
  'Disclosure dan disclaimer ditulis jelas karena aturan bank dan program loyalty bisa berubah.',
] as const

export const teamMembers = [
  {
    name: 'Editorial Desk',
    role: 'News, guides, deals, dan review travel',
    description:
      'Memprioritaskan update yang berdampak pada keputusan nyata: promo transfer, kartu baru, sweet spot, dan perubahan program.',
    icon: Newspaper,
  },
  {
    name: 'Card Research',
    role: 'Kartu kredit, earning rate, dan transfer partner',
    description:
      'Menjaga struktur data kartu agar calculator dan compare tool tetap konsisten dengan formula JustMiles.',
    icon: CreditCard,
  },
  {
    name: 'Travel Strategy',
    role: 'Redemption planning dan consulting',
    description:
      'Menerjemahkan poin menjadi rute, cabin, timing transfer, dan fallback saat award seat tidak tersedia.',
    icon: MapPinned,
  },
] as const satisfies readonly TeamMember[]
