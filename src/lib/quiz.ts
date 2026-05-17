export interface QuizOption {
  value: string
  label: string
  description: string
}

export interface QuizQuestion {
  id: string
  title: string
  description: string
  options: QuizOption[]
}

export const quizQuestions = [
  {
    id: 'monthlySpend',
    title: 'Berapa spending kartu kredit per bulan?',
    description:
      'Estimasi total transaksi yang realistis, bukan target yang dipaksakan.',
    options: [
      {
        value: 'under-5m',
        label: '< Rp5 juta',
        description: 'Masih eksplorasi kartu utama dan welcome bonus kecil.',
      },
      {
        value: '5m-10m',
        label: 'Rp5–10 juta',
        description: 'Cukup untuk mulai optimasi kartu harian.',
      },
      {
        value: '10m-20m',
        label: 'Rp10–20 juta',
        description: 'Sudah layak membandingkan earning rate lintas bank.',
      },
      {
        value: '20m-40m',
        label: 'Rp20–40 juta',
        description: 'Annual fee dan benefit premium mulai masuk hitungan.',
      },
      {
        value: 'over-40m',
        label: '> Rp40 juta',
        description: 'Butuh strategi portfolio dan limit allocation.',
      },
    ],
  },
  {
    id: 'largestCategory',
    title: 'Kategori transaksi terbesar kamu apa?',
    description:
      'Pilih kategori yang paling sering menyerap budget kartu kredit.',
    options: [
      {
        value: 'daily',
        label: 'Belanja harian',
        description: 'Grocery, e-wallet, transport, dan kebutuhan rutin.',
      },
      {
        value: 'dining',
        label: 'Dining',
        description: 'Restoran, cafe, dan entertainment.',
      },
      {
        value: 'online',
        label: 'Online',
        description: 'Marketplace, subscriptions, dan digital spending.',
      },
      {
        value: 'travel',
        label: 'Travel',
        description: 'Tiket, hotel, OTA, dan transaksi luar negeri.',
      },
      {
        value: 'business',
        label: 'Bisnis',
        description: 'Inventory, ads, tools, atau operasional usaha.',
      },
    ],
  },
  {
    id: 'destination',
    title: 'Destinasi travel yang paling kamu incar?',
    description:
      'Tujuan menentukan program miles, partner transfer, dan sweet spot.',
    options: [
      {
        value: 'domestic',
        label: 'Domestik Indonesia',
        description: 'Fokus GarudaMiles, hotel, atau benefit airport.',
      },
      {
        value: 'southeast-asia',
        label: 'Asia Tenggara',
        description: 'Rute regional dengan kebutuhan miles sedang.',
      },
      {
        value: 'north-asia',
        label: 'Jepang / Korea / Hong Kong',
        description: 'Sweet spot populer untuk leisure dan family trip.',
      },
      {
        value: 'europe',
        label: 'Eropa',
        description: 'Butuh partner kuat dan redemption long-haul.',
      },
      {
        value: 'usa-australia',
        label: 'USA / Australia',
        description: 'Nilai tinggi, availability lebih kompetitif.',
      },
    ],
  },
  {
    id: 'airlinePreference',
    title: 'Preferensi airline atau program utama?',
    description:
      'Kalau belum punya preferensi, pilih flexible agar rekomendasi tidak terkunci.',
    options: [
      {
        value: 'garuda',
        label: 'Garuda Indonesia',
        description: 'Cocok untuk domestik dan beberapa rute regional.',
      },
      {
        value: 'singapore-airlines',
        label: 'Singapore Airlines',
        description: 'Kuat untuk KrisFlyer dan premium cabin.',
      },
      {
        value: 'cathay',
        label: 'Cathay Pacific',
        description: 'Asia Miles dan koneksi via Hong Kong.',
      },
      {
        value: 'middle-east',
        label: 'Emirates / Qatar / Etihad',
        description: 'Pilihan long-haul dengan koneksi Timur Tengah.',
      },
      {
        value: 'flexible',
        label: 'Flexible',
        description: 'Saya ingin kartu yang membuka banyak opsi.',
      },
    ],
  },
  {
    id: 'overseasFrequency',
    title: 'Seberapa sering transaksi luar negeri?',
    description:
      'Transaksi overseas bisa mengubah kartu terbaik karena multiplier dan fee.',
    options: [
      {
        value: 'never',
        label: 'Hampir tidak pernah',
        description: 'Fokus earning domestik dan promo lokal.',
      },
      {
        value: 'yearly',
        label: '1–2 kali setahun',
        description: 'Butuh kartu cadangan untuk travel tahunan.',
      },
      {
        value: 'quarterly',
        label: 'Beberapa kali per kuartal',
        description: 'Multiplier overseas mulai berpengaruh.',
      },
      {
        value: 'monthly',
        label: 'Hampir setiap bulan',
        description: 'Fee, kurs, dan earning overseas perlu dioptimasi.',
      },
      {
        value: 'frequent',
        label: 'Sangat sering',
        description: 'Butuh kartu travel utama dan backup network.',
      },
    ],
  },
  {
    id: 'loungeImportance',
    title: 'Seberapa penting lounge access?',
    description:
      'Benefit airport sering terlihat menarik, tapi nilainya sangat tergantung pola travel.',
    options: [
      {
        value: 'not-important',
        label: 'Tidak penting',
        description: 'Saya lebih peduli earning rate dan annual fee rendah.',
      },
      {
        value: 'nice-to-have',
        label: 'Nice to have',
        description: 'Bagus kalau ada, tapi bukan alasan utama.',
      },
      {
        value: 'important',
        label: 'Penting',
        description: 'Saya rutin travel dan lounge menghemat biaya nyata.',
      },
      {
        value: 'must-have',
        label: 'Wajib',
        description: 'Saya butuh lounge sebagai bagian dari travel workflow.',
      },
    ],
  },
  {
    id: 'annualFeeTolerance',
    title: 'Batas annual fee yang masih nyaman?',
    description:
      'Batas ini membantu menghindari kartu premium yang benefitnya tidak terpakai.',
    options: [
      {
        value: 'free-low',
        label: 'Gratis / sangat rendah',
        description: 'Prioritas biaya rendah dan fleksibilitas.',
      },
      {
        value: 'under-1m',
        label: '< Rp1 juta',
        description: 'Masih terbuka untuk kartu entry travel.',
      },
      {
        value: '1m-3m',
        label: 'Rp1–3 juta',
        description: 'Siap bayar kalau earning dan benefit jelas.',
      },
      {
        value: '3m-8m',
        label: 'Rp3–8 juta',
        description: 'Premium card boleh masuk shortlist.',
      },
      {
        value: 'value-based',
        label: 'Tergantung value',
        description: 'Annual fee besar oke jika return-nya terukur.',
      },
    ],
  },
  {
    id: 'redemptionTarget',
    title: 'Target redemption utama?',
    description:
      'Target akhir menentukan apakah kartu harus kuat di miles, hotel, atau cashback sederhana.',
    options: [
      {
        value: 'regional-economy',
        label: 'Economy regional',
        description: 'Trip dekat dengan miles requirement lebih rendah.',
      },
      {
        value: 'regional-business',
        label: 'Business regional',
        description: 'Value tinggi tanpa kebutuhan miles ekstrem.',
      },
      {
        value: 'long-haul-business',
        label: 'Long-haul business',
        description: 'Butuh earning tinggi dan partner transfer kuat.',
      },
      {
        value: 'family-trip',
        label: 'Family trip',
        description: 'Kursi banyak, fleksibilitas tanggal, dan fees penting.',
      },
      {
        value: 'hotel-lifestyle',
        label: 'Hotel / lifestyle',
        description: 'Benefit non-flight punya value lebih nyata.',
      },
      {
        value: 'simple-cashback',
        label: 'Cashback sederhana',
        description: 'Saya ingin value mudah tanpa award availability.',
      },
    ],
  },
] as const satisfies QuizQuestion[]

export type QuizQuestionId = (typeof quizQuestions)[number]['id']
export type QuizAnswers = Partial<Record<QuizQuestionId, string>>

export function getAnsweredQuestionCount(answers: QuizAnswers): number {
  return quizQuestions.filter((question) => answers[question.id]).length
}

export function isQuizComplete(answers: QuizAnswers): boolean {
  return getAnsweredQuestionCount(answers) === quizQuestions.length
}
