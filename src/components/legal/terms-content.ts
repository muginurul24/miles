import type { LegalPageContent } from './legal-types'

export const termsContent = {
  eyebrow: 'Terms & Conditions',
  title: 'Syarat dan Ketentuan JustMiles',
  description:
    'Aturan penggunaan JustMiles untuk konten, calculator, compare tool, membership, newsletter, akun, dan layanan consulting.',
  lastUpdated: '17 Mei 2026',
  summary:
    'Dengan menggunakan JustMiles, kamu setuju memakai informasi dan tools sebagai bahan bantu keputusan, bukan sebagai jaminan hasil dari bank, airline, hotel, atau program loyalty.',
  notice:
    'Dokumen ini menjelaskan batas penggunaan layanan JustMiles. Jika kamu tidak setuju dengan ketentuan ini, hentikan penggunaan layanan.',
  contact: {
    title: 'Terms request',
    description: 'Hubungi kami untuk pertanyaan penggunaan layanan atau akun.',
    subject: 'Terms Request',
  },
  sections: [
    {
      id: 'acceptance',
      title: 'Penerimaan ketentuan',
      body: [
        'Ketentuan ini berlaku saat kamu mengakses situs, membuat akun, subscribe newsletter, memakai calculator, mengikuti membership, atau mengirim inquiry consulting.',
        'Kami dapat memperbarui ketentuan ini dari waktu ke waktu. Penggunaan layanan setelah pembaruan berarti kamu menerima versi terbaru.',
      ],
    },
    {
      id: 'account',
      title: 'Akun dan keamanan',
      body: [
        'Kamu bertanggung jawab menjaga keamanan email, password, session, dan aktivitas yang terjadi melalui akunmu.',
      ],
      bullets: [
        'Gunakan informasi yang akurat saat membuat akun atau mengirim inquiry.',
        'Jangan membagikan akses akun kepada pihak yang tidak berwenang.',
        'Laporkan aktivitas mencurigakan ke hello@justmiles.id.',
      ],
    },
    {
      id: 'service-scope',
      title: 'Ruang lingkup layanan',
      body: [
        'JustMiles menyediakan informasi kartu kredit, points and miles, travel media, calculator, compare tool, advisor quiz, membership, newsletter, dan consulting.',
        'Hasil calculator, compare, quiz, artikel, dan rekomendasi adalah estimasi berdasarkan data yang tersedia saat diproses. Nilai aktual dapat berubah karena kebijakan bank, airline, hotel, merchant, pajak, kurs, award availability, atau aturan program loyalty.',
      ],
    },
    {
      id: 'not-financial-advice',
      title: 'Bukan nasihat keuangan, pajak, atau hukum',
      body: [
        'Konten JustMiles dibuat untuk edukasi dan bahan pertimbangan. Keputusan membuka kartu, membayar annual fee, melakukan transfer points, membeli tiket, atau membeli produk finansial tetap menjadi tanggung jawab pengguna.',
        'Jika keputusanmu memiliki dampak finansial, pajak, hukum, atau akuntansi yang material, gunakan penasihat profesional yang sesuai.',
      ],
    },
    {
      id: 'membership-consulting',
      title: 'Membership dan consulting',
      body: [
        'Membership membuka akses konten atau benefit sesuai paket yang tersedia saat pembelian. Consulting memberikan analisis dan roadmap berdasarkan informasi yang kamu berikan.',
      ],
      bullets: [
        'Kami tidak menjamin approval kartu, ketersediaan award seat, harga tiket, upgrade, status elite, atau nilai redemption tertentu.',
        'Output consulting bergantung pada kelengkapan data, timing, dan perubahan program pihak ketiga.',
        'Jadwal, refund, reschedule, dan scope tambahan mengikuti kebijakan yang dikomunikasikan pada saat transaksi atau inquiry.',
      ],
    },
    {
      id: 'content-ip',
      title: 'Konten dan hak kekayaan intelektual',
      body: [
        'Konten, desain, formula presentasi, struktur data, dan materi JustMiles dilindungi oleh hak kekayaan intelektual. Kamu boleh memakai layanan untuk kebutuhan pribadi yang wajar.',
      ],
      bullets: [
        'Jangan menyalin, scraping, menjual ulang, atau menerbitkan ulang konten JustMiles tanpa izin tertulis.',
        'Kamu boleh membagikan tautan publik dengan atribusi yang wajar.',
      ],
    },
    {
      id: 'third-party',
      title: 'Produk dan pihak ketiga',
      body: [
        'JustMiles dapat menautkan produk bank, airline, hotel, loyalty program, merchant, atau partner lain. Pihak ketiga tersebut memiliki syarat, kebijakan privasi, biaya, dan aturan sendiri.',
        'Kami dapat menerima komisi atau benefit referral dari sebagian tautan atau kerja sama. Disclosure relevan akan ditampilkan pada halaman produk atau konten terkait.',
      ],
    },
    {
      id: 'prohibited-use',
      title: 'Penggunaan yang dilarang',
      body: ['Kamu tidak boleh menggunakan JustMiles untuk aktivitas berikut:'],
      bullets: [
        'Melanggar hukum, melakukan fraud, spam, scraping agresif, probing keamanan, atau percobaan akses tidak sah.',
        'Mengirim data palsu, melanggar hak pihak ketiga, atau mengganggu stabilitas layanan.',
        'Menggunakan konten premium untuk redistribusi publik atau komersial tanpa izin.',
      ],
    },
    {
      id: 'liability',
      title: 'Batas tanggung jawab',
      body: [
        'Kami berupaya menjaga data tetap akurat, tetapi tidak menjamin layanan bebas kesalahan, selalu tersedia, atau selalu mencerminkan perubahan terbaru dari pihak ketiga.',
        'Sejauh diizinkan hukum, JustMiles tidak bertanggung jawab atas kerugian tidak langsung, kehilangan peluang redemption, perubahan benefit, penolakan aplikasi kartu, atau keputusan pengguna berdasarkan informasi di platform.',
      ],
    },
    {
      id: 'contact',
      title: 'Kontak',
      body: [
        'Untuk pertanyaan terkait ketentuan ini, hubungi hello@justmiles.id dengan subjek “Terms Request”.',
      ],
    },
  ],
} as const satisfies LegalPageContent
