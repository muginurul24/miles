export interface LegalSection {
  id: string
  title: string
  body: string[]
  bullets?: string[]
}

export interface LegalSource {
  label: string
  href: string
}

export interface LegalPageContent {
  eyebrow: string
  title: string
  description: string
  lastUpdated: string
  summary: string
  notice: string
  sections: LegalSection[]
  contact: {
    title: string
    description: string
    subject: string
  }
  source?: LegalSource
}

export const privacyPolicyContent = {
  eyebrow: 'Privacy Policy',
  title: 'Kebijakan Privasi JustMiles',
  description:
    'Bagaimana JustMiles mengumpulkan, menggunakan, menyimpan, dan melindungi data yang kamu berikan saat memakai newsletter, membership, consulting, dan akun.',
  lastUpdated: '17 Mei 2026',
  summary:
    'Kami hanya meminta data yang diperlukan untuk menjalankan layanan JustMiles, menjaga konteks keputusan points and miles, dan menghubungi kamu terkait layanan yang kamu pilih.',
  notice:
    'Halaman ini ditulis agar pengguna memahami tujuan pemrosesan data dengan bahasa praktis. Jika ada perubahan material, tanggal pembaruan akan diganti.',
  contact: {
    title: 'Privacy request',
    description: 'Gunakan email khusus agar permintaan data mudah ditriage.',
    subject: 'Privacy Request',
  },
  source: {
    label: 'UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi',
    href: 'https://www.peraturan.go.id/id/uu-no-27-tahun-2022',
  },
  sections: [
    {
      id: 'data-we-collect',
      title: 'Data yang kami kumpulkan',
      body: [
        'Data yang dikumpulkan bergantung pada fitur yang kamu gunakan. Kamu dapat membaca konten publik tanpa membuat akun.',
      ],
      bullets: [
        'Akun: nama, email, dan informasi autentikasi yang dikelola melalui Better Auth.',
        'Newsletter: alamat email dan status berlangganan.',
        'Consulting: nama, email, paket yang dipilih, deskripsi kebutuhan, budget opsional, dan preferensi jadwal.',
        'Preferensi produk: pilihan kartu, kategori transaksi, partner miles, dan input calculator/quiz yang kamu submit.',
        'Data teknis: informasi perangkat, log dasar, dan metadata keamanan yang diperlukan untuk menjaga layanan tetap stabil.',
      ],
    },
    {
      id: 'how-we-use-data',
      title: 'Cara kami menggunakan data',
      body: [
        'Data digunakan untuk menyediakan fitur yang kamu minta, meningkatkan kualitas rekomendasi, dan menjaga keamanan platform.',
      ],
      bullets: [
        'Mengelola akun, session, membership, dan akses konten premium.',
        'Mengirim newsletter, update produk, dan komunikasi terkait inquiry consulting.',
        'Menampilkan hasil calculator, compare, quiz, dan rekomendasi yang relevan.',
        'Menganalisis performa konten dan memperbaiki data kartu atau artikel.',
        'Mencegah penyalahgunaan, spam, akses tidak sah, dan aktivitas yang merusak layanan.',
      ],
    },
    {
      id: 'legal-basis',
      title: 'Dasar pemrosesan',
      body: [
        'Kami memproses data berdasarkan persetujuan, kebutuhan kontraktual untuk layanan yang kamu pilih, kewajiban hukum, dan kepentingan sah yang seimbang dengan hak pengguna.',
      ],
      bullets: [
        'Persetujuan: newsletter, komunikasi marketing, dan pilihan preferensi tertentu.',
        'Pelaksanaan layanan: akun, membership, consulting, invoice, dan dukungan pengguna.',
        'Kepentingan sah: keamanan, pencegahan fraud, audit operasional, dan peningkatan fitur.',
        'Kewajiban hukum: kepatuhan, pembukuan, atau permintaan otoritas yang sah.',
      ],
    },
    {
      id: 'sharing',
      title: 'Pembagian data kepada pihak ketiga',
      body: [
        'Kami tidak menjual data pribadi. Data dapat diproses oleh penyedia layanan yang membantu JustMiles beroperasi.',
      ],
      bullets: [
        'Penyedia database, hosting, autentikasi, email, analitik, pembayaran, dan customer support.',
        'Konsultan atau partner operasional jika diperlukan untuk memenuhi layanan yang kamu minta.',
        'Otoritas atau pihak lain jika diwajibkan oleh hukum atau diperlukan untuk melindungi hak pengguna dan JustMiles.',
      ],
    },
    {
      id: 'retention',
      title: 'Retensi dan penghapusan',
      body: [
        'Kami menyimpan data selama diperlukan untuk menyediakan layanan, menyelesaikan kewajiban operasional, memenuhi kewajiban hukum, atau menjaga catatan keamanan.',
        'Jika data tidak lagi diperlukan, data akan dihapus, dianonimkan, atau dibatasi pemrosesannya sesuai konteks layanan.',
      ],
    },
    {
      id: 'your-rights',
      title: 'Hak pengguna',
      body: [
        'Kamu dapat meminta akses, koreksi, pembaruan, penghentian pemrosesan, penarikan persetujuan, atau penghapusan data tertentu sepanjang diizinkan oleh hukum dan kewajiban operasional.',
      ],
      bullets: [
        'Gunakan email kontak di halaman ini untuk permintaan terkait data pribadi.',
        'Kami dapat meminta verifikasi identitas sebelum memproses permintaan.',
        'Beberapa data mungkin tetap disimpan jika diwajibkan untuk keamanan, pembukuan, sengketa, atau kepatuhan hukum.',
      ],
    },
    {
      id: 'security',
      title: 'Keamanan',
      body: [
        'Kami menggunakan kontrol akses, pemisahan lingkungan, enkripsi transport, praktik autentikasi aman, dan pembatasan akses internal untuk mengurangi risiko akses tidak sah.',
        'Tidak ada sistem yang sepenuhnya bebas risiko. Jika terjadi insiden yang relevan, kami akan menilai dampak dan memberi notifikasi sesuai kewajiban yang berlaku.',
      ],
    },
    {
      id: 'contact',
      title: 'Kontak privasi',
      body: [
        'Untuk pertanyaan atau permintaan terkait data pribadi, hubungi hello@justmiles.id dengan subjek “Privacy Request”.',
      ],
    },
  ],
} as const satisfies LegalPageContent

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
