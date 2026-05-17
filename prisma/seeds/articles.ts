import type { ArticleSeed } from './types'

const articleCatalog = [
  {
    id: 'news-1',
    title: 'Promo Transfer Bonus: KrisFlyer 30% Bonus Hingga Akhir Bulan',
    category: 'News',
    excerpt:
      'Singapore Airlines menghadirkan promo transfer bonus 30% untuk semua member KrisFlyer yang transfer poin dari kartu kredit partner.',
    author: 'Rizky Pratama',
    date: '2026-05-10',
    image: 'https://picsum.photos/seed/news-krisflyer/600/340.jpg',
    premium: false,
  },
  {
    id: 'news-2',
    title: 'GarudaMiles Resmi Naik Tarif Redemption Kelas Bisnis',
    category: 'News',
    excerpt:
      'Mulai Juni 2026, GarudaMiles menaikkan jumlah miles yang dibutuhkan untuk redemption kelas bisnis rute internasional.',
    author: 'Dian Sari',
    date: '2026-05-08',
    image: 'https://picsum.photos/seed/news-garuda/600/340.jpg',
    premium: false,
  },
  {
    id: 'news-3',
    title:
      'BCA Luncurkan Kartu KrisFlyer Versi Terbaru dengan Benefit Tambahan',
    category: 'News',
    excerpt:
      'BCA memperbarui kartu KrisFlyer Visa Infinite dengan tambahan benefit lounge access di lebih dari 30 bandara.',
    author: 'Rizky Pratama',
    date: '2026-05-05',
    image: 'https://picsum.photos/seed/news-bca-new/600/340.jpg',
    premium: false,
  },
  {
    id: 'news-4',
    title: 'Asia Miles Umumkan Devaluasi Besar-besaran untuk Rute Eropa',
    category: 'News',
    excerpt:
      'Cathay Pacific mengumumkan perubahan award chart Asia Miles yang membuat redemption ke Eropa membutuhkan lebih banyak miles.',
    author: 'Dian Sari',
    date: '2026-05-02',
    image: 'https://picsum.photos/seed/news-asia/600/340.jpg',
    premium: true,
  },
  {
    id: 'cc-1',
    title: 'Review Lengkap: BCA KrisFlyer Visa Infinite 2026',
    category: 'Credit Card',
    excerpt:
      'Apakah kartu andalan BCA untuk kolektor KrisFlyer miles ini masih worth it di tahun 2026? Simak analisis lengkap kami.',
    author: 'Rizky Pratama',
    date: '2026-05-09',
    image: 'https://picsum.photos/seed/cc-bca-review/600/340.jpg',
    premium: false,
  },
  {
    id: 'cc-2',
    title: 'Ranking 10 Kartu Kredit Terbaik untuk Miles di Indonesia',
    category: 'Credit Card',
    excerpt:
      'Kami membandingkan earning rate, transfer partner, dan value proposition dari 10 kartu kredit miles populer di Indonesia.',
    author: 'Rizky Pratama',
    date: '2026-05-06',
    image: 'https://picsum.photos/seed/cc-ranking/600/340.jpg',
    premium: true,
  },
  {
    id: 'cc-3',
    title: 'Citi PremierMiles vs UOB PRVI Miles: Mana yang Lebih Baik?',
    category: 'Credit Card',
    excerpt:
      'Dua kartu miles populer dengan positioning berbeda. Kami bandingkan earning rate, transfer partner, dan overall value.',
    author: 'Dian Sari',
    date: '2026-05-03',
    image: 'https://picsum.photos/seed/cc-citi-uob/600/340.jpg',
    premium: false,
  },
  {
    id: 'cc-4',
    title: 'Strategi Annual Fee: Kapan Harus Bayar dan Kapan Harus Cancel?',
    category: 'Credit Card',
    excerpt:
      'Tidak semua annual fee sama. Pelajari kapan annual fee worth it dan kapan lebih baik nego atau cancel kartu.',
    author: 'Rizky Pratama',
    date: '2026-05-01',
    image: 'https://picsum.photos/seed/cc-annual/600/340.jpg',
    premium: true,
  },
  {
    id: 'guide-1',
    title:
      'Panduan Lengkap Miles untuk Pemula: Dari Nol Sampai Terbang Business Class',
    category: 'Guide',
    excerpt:
      'Guide komprehensif untuk kamu yang baru mengenal dunia points dan miles. Dari konsep dasar sampai strategi redemption pertama.',
    author: 'Rizky Pratama',
    date: '2026-05-10',
    image: 'https://picsum.photos/seed/guide-pemula/600/340.jpg',
    premium: false,
  },
  {
    id: 'guide-2',
    title: 'Cara Membaca Award Chart dan Menemukan Sweet Spot Redemption',
    category: 'Guide',
    excerpt:
      'Award chart bisa membingungkan. Panduan ini mengajarkan kamu cara membacanya dan menemukan value terbaik.',
    author: 'Dian Sari',
    date: '2026-05-07',
    image: 'https://picsum.photos/seed/guide-award/600/340.jpg',
    premium: false,
  },
  {
    id: 'guide-3',
    title: 'Cara Transfer Poin Kartu Kredit ke Airline Miles: Step-by-Step',
    category: 'Guide',
    excerpt:
      'Tutorial lengkap cara transfer poin dari kartu kredit ke program miles GarudaMiles, KrisFlyer, dan Asia Miles.',
    author: 'Rizky Pratama',
    date: '2026-05-04',
    image: 'https://picsum.photos/seed/guide-transfer/600/340.jpg',
    premium: false,
  },
  {
    id: 'guide-4',
    title:
      'Strategi Multi-Kartu: Mengoptimalkan Portfolio Kartu Kredit untuk Miles',
    category: 'Guide',
    excerpt:
      'Punya lebih dari satu kartu kredit bisa jadi strategi yang sangat efektif. Pelajari cara mengoptimalkan kombinasi kartu.',
    author: 'Dian Sari',
    date: '2026-05-01',
    image: 'https://picsum.photos/seed/guide-multi/600/340.jpg',
    premium: true,
  },
  {
    id: 'rev-1',
    title:
      'Flight Review: Garuda Indonesia Business Class Jakarta-Tokyo (Boeing 777-300ER)',
    category: 'Review',
    subCategory: 'flight',
    excerpt:
      'Pengalaman terbang business class Garuda Indonesia rute CGK-NRT. Seat, makanan, layanan, dan apakah worth menggunakan miles.',
    author: 'Rizky Pratama',
    date: '2026-05-09',
    image: 'https://picsum.photos/seed/rev-garuda-biz/600/340.jpg',
    premium: false,
  },
  {
    id: 'rev-2',
    title: 'Hotel Review: Grand Hyatt Tokyo dengan World of Hyatt Points',
    category: 'Review',
    subCategory: 'hotel',
    excerpt:
      'Menginap di Grand Hyatt Tokyo menggunakan 30.000 World of Hyatt points per malam. Apakah valuenya sebanding?',
    author: 'Dian Sari',
    date: '2026-05-06',
    image: 'https://picsum.photos/seed/rev-hyatt/600/340.jpg',
    premium: false,
  },
  {
    id: 'rev-3',
    title: 'Lounge Review: XPR Lounge Soekarno-Hatta Terminal 3',
    category: 'Review',
    subCategory: 'lounge',
    excerpt:
      'Review lengkap XPR Lounge di Terminal 3 Soekarno-Hatta: makanan, fasilitas, keramaian, dan apakah worth menggunakan Priority Pass.',
    author: 'Rizky Pratama',
    date: '2026-05-03',
    image: 'https://picsum.photos/seed/rev-xpr/600/340.jpg',
    premium: false,
  },
  {
    id: 'rev-4',
    title: 'Flight Review: Singapore Airlines Suites A380 Jakarta-Singapore',
    category: 'Review',
    subCategory: 'flight',
    excerpt:
      'Pengalaman di kelas tertinggi Singapore Airlines. Suites Class A380 dari Jakarta ke Singapore menggunakan KrisFlyer miles.',
    author: 'Dian Sari',
    date: '2026-04-30',
    image: 'https://picsum.photos/seed/rev-sia-suites/600/340.jpg',
    premium: true,
  },
  {
    id: 'deal-1',
    title: 'Flash Deal: Transfer KrisFlyer Bonus 40% Hanya 3 Hari',
    category: 'Deal',
    excerpt:
      'Promo terbatas! Transfer poin dari kartu kredit ke KrisFlyer dan dapatkan bonus 40% miles tambahan.',
    author: 'Rizky Pratama',
    date: '2026-05-10',
    image: 'https://picsum.photos/seed/deal-kris40/600/340.jpg',
    premium: false,
    dealTag: 'HOT',
  },
  {
    id: 'deal-2',
    title: 'Sweet Spot: Business Class Jakarta-London Hanya 75.000 Asia Miles',
    category: 'Deal',
    excerpt:
      'Redemption business class Cathay Pacific CGK-LHR via HKG masih tersedia di 75.000 miles one-way. Buruan sebelum berubah!',
    author: 'Dian Sari',
    date: '2026-05-08',
    image: 'https://picsum.photos/seed/deal-asia-lon/600/340.jpg',
    premium: false,
    dealTag: 'SWEET SPOT',
  },
  {
    id: 'deal-3',
    title: 'Promo Welcome Bonus: Citi PremierMiles Gratis 15.000 Poin',
    category: 'Deal',
    excerpt:
      'Daftar Citi PremierMiles sebelum akhir bulan dan dapatkan welcome bonus 15.000 poin (setara 7.500 miles).',
    author: 'Rizky Pratama',
    date: '2026-05-05',
    image: 'https://picsum.photos/seed/deal-citi-wb/600/340.jpg',
    premium: false,
    dealTag: 'PROMO',
  },
  {
    id: 'deal-4',
    title: 'Hotel Points Deal: Stay 2 Nights Get Free Night di Hilton',
    category: 'Deal',
    excerpt:
      'Hilton Honors menghadirkan promo stay 2 nights, get 1 free night yang bisa dikombinasikan dengan points.',
    author: 'Dian Sari',
    date: '2026-05-02',
    image: 'https://picsum.photos/seed/deal-hilton/600/340.jpg',
    premium: false,
    dealTag: 'HOT',
  },
] satisfies ArticleSeed[]

export const articles: ArticleSeed[] = [...articleCatalog].sort(
  (first, second) => second.date.localeCompare(first.date),
)
