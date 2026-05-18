import {
  DEFAULT_PAYMENT_CHANNEL_ID,
  getPaymentChannelById,
} from '#/lib/payment-channels'

import type { PaymentChannel } from '#/lib/payment-channels'

export interface CheckoutOrderPaymentView {
  gatewayPayload: unknown
  paymentMethod: string | null
  paymentType: string
}

export interface CheckoutStatus {
  label: string
  description: string | null
  tone: 'success' | 'pending' | 'error'
}

export interface PaymentAction {
  name?: string
  type?: string
  url?: string
}

export function getCheckoutStatus(status: string): CheckoutStatus {
  switch (status) {
    case 'paid':
      return {
        label: 'Pembayaran diterima',
        description: 'Membership kamu sudah aktif.',
        tone: 'success',
      }
    case 'failed':
      return {
        label: 'Pembayaran gagal',
        description:
          'Checkout ini tidak berhasil diproses. Kembali ke halaman membership untuk membuat pembayaran baru.',
        tone: 'error',
      }
    case 'expired':
    case 'cancelled':
      return {
        label: 'Checkout berakhir',
        description:
          'Masa berlaku pembayaran sudah selesai. Buat checkout baru jika kamu masih ingin melanjutkan.',
        tone: 'error',
      }
    default:
      return {
        label: 'Menunggu pembayaran',
        description:
          'Status akan diperbarui otomatis setelah pembayaran dikonfirmasi.',
        tone: 'pending',
      }
  }
}

export function getCheckoutPaymentChannel(
  order: CheckoutOrderPaymentView,
): PaymentChannel | undefined {
  const explicitChannel = getPaymentChannelById(order.paymentMethod)
  if (explicitChannel) {
    return explicitChannel
  }

  if (order.paymentType === 'qris') {
    return getPaymentChannelById(DEFAULT_PAYMENT_CHANNEL_ID)
  }

  if (order.paymentType === 'ewallet') {
    return getPaymentChannelById('gopay')
  }

  const vaBank = getVaNumbers(order.gatewayPayload)[0]?.bank
  return getPaymentChannelById(vaBank)
}

export function getVaNumbers(
  gatewayPayload: unknown,
): Array<{ bank: string; vaNumber: string }> {
  if (
    !gatewayPayload ||
    typeof gatewayPayload !== 'object' ||
    !('midtrans' in gatewayPayload)
  ) {
    return []
  }

  const midtrans = gatewayPayload.midtrans
  if (
    !midtrans ||
    typeof midtrans !== 'object' ||
    !('va_numbers' in midtrans) ||
    !Array.isArray(midtrans.va_numbers)
  ) {
    return []
  }

  return midtrans.va_numbers.flatMap((item) => {
    if (
      item &&
      typeof item === 'object' &&
      'bank' in item &&
      'va_number' in item &&
      typeof item.bank === 'string' &&
      typeof item.va_number === 'string'
    ) {
      return [{ bank: item.bank, vaNumber: item.va_number }]
    }

    return []
  })
}

export function getQrUrl(gatewayPayload: unknown): string | null {
  return (
    getStringField(gatewayPayload, 'qr_url') ??
    getNestedStringField(gatewayPayload, 'midtrans', 'qr_url') ??
    getActionUrl(gatewayPayload, (action) => {
      const name = action.name?.toLowerCase() ?? ''
      const type = action.type?.toLowerCase() ?? ''

      return name.includes('qr') || type.includes('qr')
    })
  )
}

export function getQrString(gatewayPayload: unknown): string | null {
  return (
    getStringField(gatewayPayload, 'qr_string') ??
    getNestedStringField(gatewayPayload, 'midtrans', 'qr_string')
  )
}

export function getEwalletActionUrl(gatewayPayload: unknown): string | null {
  return getActionUrl(gatewayPayload, (action) => {
    const type = action.type?.toLowerCase() ?? ''
    const name = action.name?.toLowerCase() ?? ''

    return type.includes('deeplink') || name.includes('deeplink')
  })
}

function getActionUrl(
  gatewayPayload: unknown,
  predicate: (action: PaymentAction) => boolean,
): string | null {
  const actions = getPaymentActions(gatewayPayload)
  return actions.find((action) => action.url && predicate(action))?.url ?? null
}

function getPaymentActions(gatewayPayload: unknown): PaymentAction[] {
  return [
    ...getActionList(gatewayPayload),
    ...getNestedActionList(gatewayPayload, 'midtrans'),
  ]
}

function getActionList(gatewayPayload: unknown): PaymentAction[] {
  if (
    !gatewayPayload ||
    typeof gatewayPayload !== 'object' ||
    !('actions' in gatewayPayload) ||
    !Array.isArray(gatewayPayload.actions)
  ) {
    return []
  }

  return gatewayPayload.actions.flatMap(toPaymentAction)
}

function getNestedActionList(
  gatewayPayload: unknown,
  parentKey: string,
): PaymentAction[] {
  if (
    !gatewayPayload ||
    typeof gatewayPayload !== 'object' ||
    !(parentKey in gatewayPayload)
  ) {
    return []
  }

  const parent = (gatewayPayload as Record<string, unknown>)[parentKey]
  return getActionList(parent)
}

function toPaymentAction(value: unknown): PaymentAction[] {
  if (!value || typeof value !== 'object') {
    return []
  }

  const action: PaymentAction = {}
  if ('name' in value && typeof value.name === 'string') {
    action.name = value.name
  }
  if ('type' in value && typeof value.type === 'string') {
    action.type = value.type
  }
  if ('url' in value && typeof value.url === 'string') {
    action.url = value.url
  }

  return Object.keys(action).length > 0 ? [action] : []
}

function getStringField(value: unknown, key: string): string | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const field = (value as Record<string, unknown>)[key]
  return typeof field === 'string' ? field : null
}

function getNestedStringField(
  value: unknown,
  parentKey: string,
  childKey: string,
): string | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const parent = (value as Record<string, unknown>)[parentKey]
  return getStringField(parent, childKey)
}
