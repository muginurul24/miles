import { hasPremiumAccess } from '#/lib/premium-access'

import type { PremiumAccessUser } from '#/lib/premium-access'

type PremiumGateLinkTarget = '/auth/register' | '/auth/login' | '/membership'

export interface PremiumGatePrimaryAction {
  kind: 'disabled' | 'link' | 'refresh'
  label: string
  to?: PremiumGateLinkTarget
}

export interface PremiumArticleGateCopy {
  cardText: string
  description: string
  mode: 'checking' | 'guest' | 'member-sync' | 'upgrade'
  primary: PremiumGatePrimaryAction
  secondary?: {
    label: string
    to: PremiumGateLinkTarget
  }
  title: string
}

export interface PremiumContentCtaCopy {
  buttonLabel: string
  buttonTo?: PremiumGateLinkTarget
  cardText: string
  disabled: boolean
}

export function getPremiumArticleGateCopy({
  isContentRefreshing,
  isSessionPending,
  user,
}: {
  isContentRefreshing: boolean
  isSessionPending: boolean
  user: PremiumAccessUser | null | undefined
}): PremiumArticleGateCopy {
  if (isSessionPending) {
    return {
      cardText: 'Sebentar, kami cek status akun kamu sebelum membuka akses.',
      description:
        'Kami sedang menyinkronkan status akun agar artikel yang tampil sesuai akses terbaru.',
      mode: 'checking',
      primary: {
        kind: 'disabled',
        label: 'Memuat akses...',
      },
      title: 'Memeriksa akses artikel',
    }
  }

  if (!user) {
    return {
      cardText:
        'Daftar gratis dalam 30 detik untuk mulai membaca seri exclusive. Tanpa spam, tanpa ribet.',
      description:
        'Artikel ini bagian dari seri exclusive yang kami tulis dari pengalaman nyata, data yang tidak dipublikasikan umum, dan analisis mendalam. Daftar gratis untuk mulai membaca.',
      mode: 'guest',
      primary: {
        kind: 'link',
        label: 'Baca selengkapnya — gratis',
        to: '/auth/register',
      },
      secondary: {
        label: 'Sudah daftar? Masuk di sini',
        to: '/auth/login',
      },
      title: 'Dapatkan strategi lengkapnya',
    }
  }

  if (hasPremiumAccess(user)) {
    return {
      cardText: isContentRefreshing
        ? 'Akses member kamu aktif. Versi lengkap artikel sedang dimuat.'
        : 'Akses member kamu aktif. Jika artikel belum terbuka otomatis, sinkronkan ulang akses artikel.',
      description:
        'Akses kamu aktif. Kami sedang memuat versi lengkap artikel ini dari server agar konten yang tampil sesuai status membership terbaru.',
      mode: 'member-sync',
      primary: {
        kind: isContentRefreshing ? 'disabled' : 'refresh',
        label: isContentRefreshing ? 'Memuat artikel...' : 'Sinkronkan akses',
      },
      title: 'Memuat akses member',
    }
  }

  return {
    cardText:
      'Akun kamu sudah siap. Pilih membership untuk membuka semua artikel exclusive dan analisis di balik data.',
    description:
      'Member JustMiles mendapat akses ke strategi mendalam, data aktual, award chart, timing transfer, dan rute yang benar-benar worth it.',
    mode: 'upgrade',
    primary: {
      kind: 'link',
      label: 'Lihat paket membership',
      to: '/membership',
    },
    title: 'Lanjutkan ke strategi lengkapnya',
  }
}

export function getPremiumContentCtaCopy({
  isSessionPending,
  user,
}: {
  isSessionPending: boolean
  user: PremiumAccessUser | null | undefined
}): PremiumContentCtaCopy {
  if (isSessionPending) {
    return {
      buttonLabel: 'Memuat akses...',
      cardText: 'Sebentar, kami cek status akun kamu.',
      disabled: true,
    }
  }

  if (!user) {
    return {
      buttonLabel: 'Baca semua artikel exclusive',
      buttonTo: '/auth/register',
      cardText:
        'Daftar gratis dalam 30 detik untuk buka semua artikel exclusive. Tanpa spam, tanpa ribet.',
      disabled: false,
    }
  }

  if (hasPremiumAccess(user)) {
    return {
      buttonLabel: 'Lihat benefit membership',
      buttonTo: '/membership',
      cardText:
        'Akses member kamu aktif. Jelajahi strategi mendalam dan lanjutkan membaca seri exclusive JustMiles.',
      disabled: false,
    }
  }

  return {
    buttonLabel: 'Lihat paket membership',
    buttonTo: '/membership',
    cardText:
      'Akun kamu sudah siap. Pilih membership untuk membuka semua artikel exclusive dan analisis di balik data.',
    disabled: false,
  }
}
