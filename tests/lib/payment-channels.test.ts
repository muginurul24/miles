import { describe, expect, it } from 'vitest'
import {
  ALL_PAYMENT_CHANNELS,
  BANK_CHANNELS,
  DEFAULT_PAYMENT_CHANNEL_ID,
  EWALLET_CHANNELS,
  PAYGATE_BANK_CODES,
  QRIS_CHANNELS,
  getPaymentChannelById,
  isBankCode,
  isEwalletCode,
  isPaymentChannelId,
} from '#/lib/payment-channels'

describe('payment channels', () => {
  it('should mirror the production-tested PayGate channel allowlist', () => {
    expect(PAYGATE_BANK_CODES).toEqual([
      'bni',
      'bri',
      'bsi',
      'mandiri',
      'permata',
      'cimb',
    ])
    expect(ALL_PAYMENT_CHANNELS.map((channel) => channel.id)).toEqual([
      ...BANK_CHANNELS.map((channel) => channel.id),
      ...EWALLET_CHANNELS.map((channel) => channel.id),
      ...QRIS_CHANNELS.map((channel) => channel.id),
    ])
  })

  it('should expose QRIS GoPay as the default payment method', () => {
    expect(DEFAULT_PAYMENT_CHANNEL_ID).toBe('qris_gopay')
    expect(getPaymentChannelById(DEFAULT_PAYMENT_CHANNEL_ID)).toMatchObject({
      category: 'qris',
      paymentType: 'qris',
    })
  })

  it('should reject channels that are not enabled in production', () => {
    expect(isPaymentChannelId('bca')).toBe(false)
    expect(isPaymentChannelId('gopay')).toBe(true)
  })

  it('should expose typed guards for bank and e-wallet payload mapping', () => {
    expect(isBankCode('bsi')).toBe(true)
    expect(isBankCode('gopay')).toBe(false)
    expect(isEwalletCode('gopay')).toBe(true)
    expect(isEwalletCode('bsi')).toBe(false)
  })
})
