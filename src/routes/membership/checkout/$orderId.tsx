import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, CircleCheckBig, CircleX, Clock3 } from 'lucide-react'
import { CheckoutPaymentInstructions } from '#/components/membership/CheckoutPaymentInstructions'
import { PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { useTRPC } from '#/integrations/trpc/react'
import {
  getCheckoutPaymentChannel,
  getCheckoutStatus,
  getEwalletActionUrl,
  getQrString,
  getQrUrl,
  getVaNumbers,
} from '#/lib/payment-checkout'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

import type { ReactElement } from 'react'

export const Route = createFileRoute('/membership/checkout/$orderId')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Checkout Membership — JustMiles',
      description: 'Status pembayaran membership JustMiles.',
      path: '/membership',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/membership'),
  }),
  component: MembershipCheckoutPage,
})

function MembershipCheckoutPage(): ReactElement {
  const trpc = useTRPC()
  const { orderId } = Route.useParams()
  const orderQuery = useQuery(
    trpc.payments.order.queryOptions(
      { orderId },
      {
        refetchInterval: (query) =>
          query.state.data?.status === 'pending' ? 15_000 : false,
      },
    ),
  )

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Checkout"
        title="Selesaikan pembayaran membership"
        description="Status akan diperbarui otomatis setelah pembayaran dikonfirmasi."
        actions={
          <Button asChild variant="outline">
            <Link to="/membership">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke membership
            </Link>
          </Button>
        }
      />

      <section className="page-wrap max-w-3xl">
        {orderQuery.isPending ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Memuat detail pembayaran...
            </CardContent>
          </Card>
        ) : null}

        {orderQuery.error ? (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">
              Detail pembayaran belum bisa dimuat.
            </CardContent>
          </Card>
        ) : null}

        {orderQuery.data ? <CheckoutSummary order={orderQuery.data} /> : null}
      </section>
    </main>
  )
}

function CheckoutSummary({
  order,
}: {
  order: {
    orderId: string
    tierName: string
    amount: number
    currency: string
    status: string
    paymentType: string
    paymentMethod: string | null
    gatewayPayload: unknown
  }
}): ReactElement {
  const vaNumbers = getVaNumbers(order.gatewayPayload)
  const status = getCheckoutStatus(order.status)
  const paymentChannel = getCheckoutPaymentChannel(order)
  const qrUrl = getQrUrl(order.gatewayPayload)
  const qrString = getQrString(order.gatewayPayload)
  const ewalletActionUrl = getEwalletActionUrl(order.gatewayPayload)

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-2xl text-primary">
          <CheckoutStatusIcon tone={status.tone} />
          {status.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {status.description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {status.description}
          </p>
        ) : null}

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Order ID</dt>
            <dd className="mt-1 font-mono font-semibold text-primary">
              {order.orderId}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Paket</dt>
            <dd className="mt-1 font-semibold text-primary">
              {order.tierName}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Nominal</dt>
            <dd className="mt-1 font-semibold text-primary">
              {formatAmount(order.amount, order.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Metode</dt>
            <dd className="mt-1 font-semibold text-primary">
              {paymentChannel?.name ?? order.paymentMethod ?? order.paymentType}
            </dd>
          </div>
        </dl>

        <CheckoutPaymentInstructions
          ewalletActionUrl={ewalletActionUrl}
          paymentChannel={paymentChannel}
          qrString={qrString}
          qrUrl={qrUrl}
          vaNumbers={vaNumbers}
        />
      </CardContent>
    </Card>
  )
}

function CheckoutStatusIcon({
  tone,
}: {
  tone: 'success' | 'pending' | 'error'
}): ReactElement {
  if (tone === 'success') {
    return <CircleCheckBig className="h-5 w-5 text-green-600" />
  }

  if (tone === 'error') {
    return <CircleX className="h-5 w-5 text-destructive" />
  }

  return <Clock3 className="h-5 w-5 text-accent" />
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
