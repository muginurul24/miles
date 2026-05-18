import type { LegalPageContent } from './legal-types'

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
        'Mengelola akun, session, membership, dan akses konten member.',
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
