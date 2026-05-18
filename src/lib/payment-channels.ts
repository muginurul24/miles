export const PAYGATE_BANK_CODES = [
  'bni',
  'bri',
  'bsi',
  'mandiri',
  'permata',
  'cimb',
] as const

export const PAYGATE_EWALLET_CODES = ['gopay'] as const
export const PAYGATE_QRIS_CODES = ['qris_gopay'] as const
export const PAYGATE_PAYMENT_CHANNEL_CODES = [
  ...PAYGATE_BANK_CODES,
  ...PAYGATE_EWALLET_CODES,
  ...PAYGATE_QRIS_CODES,
] as const

export type BankCode = (typeof PAYGATE_BANK_CODES)[number]
export type EwalletCode = (typeof PAYGATE_EWALLET_CODES)[number]
export type QrisCode = (typeof PAYGATE_QRIS_CODES)[number]
export type PaymentChannelCode = (typeof PAYGATE_PAYMENT_CHANNEL_CODES)[number]
export type PaymentType = 'bank_transfer' | 'ewallet' | 'qris'
export type PaymentChannelCategory = PaymentType

export interface PaymentChannel {
  category: PaymentChannelCategory
  categoryLabel: string
  description: string
  estimatedProcessingTime: string
  id: PaymentChannelCode
  name: string
  paymentType: PaymentType
  shortName: string
}

export const DEFAULT_PAYMENT_CHANNEL_ID: PaymentChannelCode = 'qris_gopay'

const BANK_NAMES: Record<BankCode, { name: string; shortName: string }> = {
  bni: { name: 'BNI Virtual Account', shortName: 'BNI' },
  bri: { name: 'BRI Virtual Account', shortName: 'BRI' },
  bsi: { name: 'BSI Virtual Account', shortName: 'BSI' },
  cimb: { name: 'CIMB Niaga Virtual Account', shortName: 'CIMB Niaga' },
  mandiri: { name: 'Mandiri Virtual Account', shortName: 'Mandiri' },
  permata: { name: 'Permata Virtual Account', shortName: 'Permata' },
}

export const BANK_CHANNELS: readonly PaymentChannel[] = PAYGATE_BANK_CODES.map(
  (id) => ({
    category: 'bank_transfer',
    categoryLabel: 'Bank Transfer',
    description: 'Bayar lewat virtual account bank pilihanmu.',
    estimatedProcessingTime: '1-2 jam',
    id,
    name: BANK_NAMES[id].name,
    paymentType: 'bank_transfer',
    shortName: BANK_NAMES[id].shortName,
  }),
)

export const EWALLET_CHANNELS: readonly PaymentChannel[] = [
  {
    category: 'ewallet',
    categoryLabel: 'E-Wallet',
    description: 'Konfirmasi pembayaran langsung dari aplikasi GoPay.',
    estimatedProcessingTime: 'Instan',
    id: 'gopay',
    name: 'GoPay',
    paymentType: 'ewallet',
    shortName: 'GoPay',
  },
]

export const QRIS_CHANNELS: readonly PaymentChannel[] = [
  {
    category: 'qris',
    categoryLabel: 'QRIS',
    description: 'Scan QRIS dinamis dengan aplikasi bank atau e-wallet.',
    estimatedProcessingTime: 'Instan',
    id: 'qris_gopay',
    name: 'QRIS Dinamis GoPay',
    paymentType: 'qris',
    shortName: 'QRIS GoPay',
  },
]

export const ALL_PAYMENT_CHANNELS: readonly PaymentChannel[] = [
  ...BANK_CHANNELS,
  ...EWALLET_CHANNELS,
  ...QRIS_CHANNELS,
]

export const PAYMENT_CHANNELS_BY_CATEGORY = {
  bank_transfer: BANK_CHANNELS,
  ewallet: EWALLET_CHANNELS,
  qris: QRIS_CHANNELS,
} as const satisfies Record<PaymentChannelCategory, readonly PaymentChannel[]>

export function getPaymentChannelById(
  id: string | null | undefined,
): PaymentChannel | undefined {
  if (!id) {
    return undefined
  }

  return ALL_PAYMENT_CHANNELS.find((channel) => channel.id === id)
}

export function isPaymentChannelId(id: string): id is PaymentChannelCode {
  return getPaymentChannelById(id) !== undefined
}

export function isBankCode(id: string): id is BankCode {
  return PAYGATE_BANK_CODES.some((code) => code === id)
}

export function isEwalletCode(id: string): id is EwalletCode {
  return PAYGATE_EWALLET_CODES.some((code) => code === id)
}
