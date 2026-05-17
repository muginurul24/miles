import type { LegalPageContent } from './legal-types'

export const disclaimerContent = {
  eyebrow: 'Disclaimer',
  title: 'Disclaimer JustMiles',
  description:
    'Batasan penting atas informasi kartu kredit, points and miles, calculator, konten travel, membership, referral, dan consulting di JustMiles.',
  lastUpdated: '17 Mei 2026',
  summary:
    'JustMiles membantu kamu mengambil keputusan dengan data dan konteks, tetapi hasil aktual tetap bergantung pada bank, airline, hotel, program loyalty, merchant, regulasi, dan keputusan pengguna.',
  notice:
    'Baca disclaimer ini sebelum memakai informasi JustMiles untuk keputusan finansial, perjalanan, transfer points, atau pembelian produk pihak ketiga.',
  contact: {
    title: 'Disclaimer request',
    description:
      'Hubungi kami jika ada klaim, koreksi data, atau disclosure yang perlu diperjelas.',
    subject: 'Disclaimer Request',
  },
  sections: [
    {
      id: 'educational-purpose',
      title: 'Informasi untuk edukasi',
      body: [
        'Konten JustMiles disediakan untuk edukasi, riset, dan bahan pertimbangan. Informasi ini bukan nasihat keuangan, hukum, pajak, investasi, asuransi, atau rekomendasi produk finansial yang dipersonalisasi.',
        'Keputusan membuka kartu kredit, menutup kartu, membayar annual fee, membeli miles, melakukan transfer points, atau menukar award tetap menjadi tanggung jawab pengguna.',
      ],
    },
    {
      id: 'accuracy',
      title: 'Akurasi data dan perubahan program',
      body: [
        'Kami berupaya menjaga data kartu, earning rate, transfer partner, promo, benefit, biaya, dan ketentuan program tetap akurat. Namun, bank, airline, hotel, merchant, dan loyalty program dapat mengubah aturan tanpa pemberitahuan kepada JustMiles.',
      ],
      bullets: [
        'Selalu verifikasi biaya, benefit, eligibility, dan syarat promo di sumber resmi sebelum transaksi.',
        'Award availability, fuel surcharge, pajak, kurs, dan nilai redemption dapat berubah sewaktu-waktu.',
        'Perhitungan IDR per mile adalah estimasi berdasarkan input dan asumsi yang tersedia.',
      ],
    },
    {
      id: 'calculator-estimates',
      title: 'Calculator, compare, dan advisor quiz',
      body: [
        'Tools JustMiles memakai formula dan data yang disederhanakan agar keputusan lebih mudah dibandingkan. Hasilnya tidak menjamin value aktual, approval kartu, jumlah miles final, atau benefit tertentu.',
        'Input yang tidak lengkap, rounding, kategori merchant, cap transaksi, perubahan MCC, dan aturan kartu tertentu dapat membuat hasil aktual berbeda.',
      ],
    },
    {
      id: 'premium-consulting',
      title: 'Membership dan consulting',
      body: [
        'Konten premium dan consulting memberikan struktur analisis, bukan jaminan hasil. Award seat bisa hilang, program dapat devaluasi, routing dapat berubah, dan bank dapat menolak aplikasi kartu.',
      ],
      bullets: [
        'Output consulting bergantung pada data yang kamu berikan dan kondisi saat analisis dibuat.',
        'Kami tidak bertindak sebagai agen perjalanan, lembaga keuangan, penasihat pajak, atau kuasa hukum.',
        'Jika keputusan memiliki konsekuensi material, gunakan penasihat profesional yang sesuai.',
      ],
    },
    {
      id: 'affiliate-disclosure',
      title: 'Affiliate, referral, dan sponsor',
      body: [
        'JustMiles dapat menerima komisi, referral fee, sponsor, akses media, atau benefit lain dari sebagian tautan, produk, atau kerja sama komersial.',
        'Kompensasi dapat memengaruhi ketersediaan tautan atau penempatan komersial, tetapi tidak mengubah kewajiban kami untuk menampilkan disclosure dan menjaga analisis tetap berguna bagi pengguna.',
      ],
    },
    {
      id: 'third-party',
      title: 'Pihak ketiga',
      body: [
        'Tautan ke bank, airline, hotel, merchant, payment gateway, loyalty program, atau situs lain berada di bawah kendali pihak ketiga. JustMiles tidak bertanggung jawab atas konten, kebijakan, biaya, approval, perubahan benefit, atau keputusan pihak ketiga tersebut.',
      ],
    },
    {
      id: 'availability',
      title: 'Ketersediaan layanan',
      body: [
        'Kami tidak menjamin JustMiles selalu tersedia tanpa gangguan, bebas error, atau aman dari seluruh risiko teknis. Maintenance, perubahan dependency, insiden, atau masalah penyedia layanan dapat memengaruhi akses.',
      ],
    },
    {
      id: 'user-responsibility',
      title: 'Tanggung jawab pengguna',
      body: [
        'Gunakan JustMiles dengan judgment sendiri. Simpan bukti promo, baca syarat resmi, cek tagihan, pantau perubahan program, dan evaluasi kemampuan finansial sebelum mengambil keputusan.',
      ],
    },
    {
      id: 'contact',
      title: 'Koreksi dan kontak',
      body: [
        'Jika kamu menemukan data yang salah atau disclosure yang perlu diperjelas, hubungi hello@justmiles.id dengan subjek “Disclaimer Request”. Sertakan sumber resmi agar koreksi bisa diverifikasi.',
      ],
    },
  ],
} as const satisfies LegalPageContent
