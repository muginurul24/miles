import { describe, expect, it } from 'vitest'
import {
  getCheckoutPaymentChannel,
  getEwalletActionUrl,
  getQrString,
  getQrUrl,
  getVaNumbers,
} from '#/lib/payment-checkout'

describe('payment checkout helpers', () => {
  it('should parse virtual account details for bank transfers', () => {
    expect(
      getVaNumbers({
        midtrans: {
          va_numbers: [{ bank: 'bsi', va_number: '20203746028460412' }],
        },
      }),
    ).toEqual([{ bank: 'bsi', vaNumber: '20203746028460412' }])
  })

  it('should preserve virtual account instructions for legacy bank channels', () => {
    expect(
      getCheckoutPaymentChannel({
        gatewayPayload: {
          midtrans: {
            va_numbers: [{ bank: 'bca', va_number: '123456789' }],
          },
        },
        paymentMethod: 'bca',
        paymentType: 'bank_transfer',
      }),
    ).toBeUndefined()

    expect(
      getVaNumbers({
        midtrans: {
          va_numbers: [{ bank: 'bca', va_number: '123456789' }],
        },
      }),
    ).toEqual([{ bank: 'bca', vaNumber: '123456789' }])
  })

  it('should resolve QRIS details from top-level and nested payload fields', () => {
    const payload = {
      qr_url: 'https://pay.example/qr.png',
      midtrans: {
        qr_string: '000201010212',
      },
    }

    expect(getQrUrl(payload)).toBe('https://pay.example/qr.png')
    expect(getQrString(payload)).toBe('000201010212')
    expect(
      getCheckoutPaymentChannel({
        gatewayPayload: payload,
        paymentMethod: null,
        paymentType: 'qris',
      }),
    ).toMatchObject({ id: 'qris_gopay' })
  })

  it('should expose GoPay deeplink actions for e-wallet checkout', () => {
    expect(
      getEwalletActionUrl({
        actions: [{ type: 'deeplink', url: 'https://wallet.example/gopay' }],
      }),
    ).toBe('https://wallet.example/gopay')
  })
})
