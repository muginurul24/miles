'use client'

import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { showErrorToast } from '#/components/Toast'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useTRPC } from '#/integrations/trpc/react'
import { authClient } from '#/lib/auth-client'
import {
  DEFAULT_PAYMENT_CHANNEL_ID,
  PAYMENT_CHANNELS_BY_CATEGORY,
  isPaymentChannelId,
} from '#/lib/payment-channels'

import type { PaymentChannelCode } from '#/lib/payment-channels'
import type { ReactElement } from 'react'

export interface MembershipCheckoutButtonProps {
  tierId: string
  label: string
  highlighted: boolean
}

export function MembershipCheckoutButton({
  tierId,
  label,
  highlighted,
}: MembershipCheckoutButtonProps): ReactElement {
  const trpc = useTRPC()
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [paymentMethod, setPaymentMethod] = useState<PaymentChannelCode>(
    DEFAULT_PAYMENT_CHANNEL_ID,
  )
  const createCheckout = useMutation(
    trpc.payments.createMembershipCheckout.mutationOptions({
      onSuccess: async ({ orderId }) => {
        await navigate({
          to: '/membership/checkout/$orderId',
          params: { orderId },
        })
      },
      onError: () => {
        showErrorToast('Checkout belum bisa dibuat. Coba lagi beberapa saat.')
      },
    }),
  )

  if (!session) {
    return (
      <Button
        asChild
        className="w-full"
        variant={highlighted ? 'default' : 'outline'}
      >
        <Link to="/auth/register">
          {label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    )
  }

  return (
    <div className="grid w-full gap-3">
      <div className="grid gap-2">
        <label
          htmlFor={`payment-method-${tierId}`}
          className="text-xs font-medium text-muted-foreground"
        >
          Metode pembayaran
        </label>
        <Select
          value={paymentMethod}
          onValueChange={(value) => {
            if (isPaymentChannelId(value)) {
              setPaymentMethod(value)
            }
          }}
        >
          <SelectTrigger id={`payment-method-${tierId}`} className="w-full">
            <SelectValue placeholder="Pilih metode pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bank Transfer</SelectLabel>
              {PAYMENT_CHANNELS_BY_CATEGORY.bank_transfer.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>E-Wallet</SelectLabel>
              {PAYMENT_CHANNELS_BY_CATEGORY.ewallet.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>QRIS</SelectLabel>
              {PAYMENT_CHANNELS_BY_CATEGORY.qris.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        className="w-full"
        variant={highlighted ? 'default' : 'outline'}
        disabled={createCheckout.isPending}
        onClick={() => createCheckout.mutate({ tierId, paymentMethod })}
      >
        {createCheckout.isPending ? 'Membuat checkout...' : label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
