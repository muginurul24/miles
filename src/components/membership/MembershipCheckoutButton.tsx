'use client'

import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { showErrorToast } from '#/components/Toast'
import { Button } from '#/components/ui/button'
import { useTRPC } from '#/integrations/trpc/react'
import { authClient } from '#/lib/auth-client'

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
    <Button
      type="button"
      className="w-full"
      variant={highlighted ? 'default' : 'outline'}
      disabled={createCheckout.isPending}
      onClick={() => createCheckout.mutate({ tierId })}
    >
      {createCheckout.isPending ? 'Membuat checkout...' : label}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
