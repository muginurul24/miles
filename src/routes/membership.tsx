import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, Crown, Sparkles } from 'lucide-react'
import { Badge, PageHeader } from '#/components/shared'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'
import { cn } from '#/lib/utils'

import type { MembershipTierView } from '#/server/repositories/membership.repo'
import type { ReactElement } from 'react'

const membershipFaqs = [
  {
    question: 'Kapan membership mulai terasa worth it?',
    answer:
      'Saat kamu punya target trip, rencana transfer poin, atau sedang memilih kartu dengan annual fee besar. Kalau masih eksplorasi dasar, tier Free sudah cukup.',
  },
  {
    question: 'Apakah Plus cukup untuk membuka premium guide?',
    answer:
      'Plus ditujukan untuk akses premium pilihan dan alert promo. Pro lebih cocok kalau kamu ingin akses semua konten premium dan strategy briefing rutin.',
  },
  {
    question: 'Apakah Concierge sama dengan konsultasi personal?',
    answer:
      'Concierge adalah level dengan dukungan paling personal. Untuk kebutuhan sekali jalan, paket consulting tetap akan tersedia sebagai opsi terpisah.',
  },
  {
    question: 'Apakah membership menggantikan kalkulator?',
    answer:
      'Tidak. Kalkulator tetap menjadi alat validasi value. Membership memberi konteks keputusan: kapan transfer, kartu apa dipakai, dan redemption mana yang diprioritaskan.',
  },
] as const

export const Route = createFileRoute('/membership')({
  loader: async ({ context }) => {
    const tiers = await context.queryClient.ensureQueryData(
      context.trpc.membership.tiers.queryOptions(),
    )

    return { tiers }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Membership — JustMiles',
      description:
        'Pilih membership JustMiles untuk membuka premium guides, review mendalam, dan strategy briefing points and miles.',
      path: '/membership',
    }),
    links: buildCanonicalLinks('/membership'),
  }),
  component: MembershipPage,
})

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function formatTierPrice(tier: MembershipTierView): string {
  if (tier.priceIdr === 0 && tier.period === 'custom') {
    return 'Custom'
  }

  if (tier.priceIdr === 0) {
    return 'Gratis'
  }

  return idrFormatter.format(tier.priceIdr)
}

function formatPeriod(period: string): string {
  if (period === 'month') {
    return '/bulan'
  }

  if (period === 'forever') {
    return 'selamanya'
  }

  return 'sesuai kebutuhan'
}

function MembershipPage() {
  const { tiers } = Route.useLoaderData()

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Membership"
        title="Pilih level analisis yang kamu butuhkan"
        description="Mulai gratis untuk fondasi, lalu naik ke membership saat kamu butuh strategi premium untuk portfolio kartu, transfer points, dan redemption bernilai tinggi."
        actions={
          <Button asChild size="lg">
            <Link to="/auth/register">
              Mulai sekarang
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <section className="page-wrap grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => (
          <MembershipTierCard key={tier.id} tier={tier} />
        ))}
      </section>

      <section className="page-wrap mt-8 rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_20rem] md:items-center">
          <div>
            <p className="island-kicker">Best practice</p>
            <h2 className="font-display text-2xl font-bold text-primary">
              Jangan upgrade sebelum ada target trip
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Membership paling bernilai saat kamu punya target redemption,
              rencana aplikasi kartu, atau keputusan transfer poin yang
              irreversible.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-light text-accent dark:text-primary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Premium content siap
                </p>
                <p className="text-xs text-muted-foreground">
                  Gating konten premium sudah aktif di article detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap mt-8 grid gap-5 rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
        <div>
          <p className="island-kicker">FAQ</p>
          <h2 className="font-display text-2xl font-bold text-primary">
            Pertanyaan sebelum upgrade
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Jawaban ringkas untuk memastikan membership dipakai pada konteks
            yang tepat, bukan sekadar karena fitur terlihat lengkap.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {membershipFaqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-base text-primary hover:text-accent hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  )
}

interface MembershipTierCardProps {
  tier: MembershipTierView
}

function MembershipTierCard({ tier }: MembershipTierCardProps): ReactElement {
  const isConcierge = tier.period === 'custom'
  const ctaLabel =
    tier.id === 'free'
      ? 'Mulai gratis'
      : isConcierge
        ? 'Ajukan konsultasi'
        : 'Pilih paket'

  return (
    <Card
      className={cn(
        'relative h-full gap-5 overflow-hidden border-border bg-card shadow-xs',
        tier.isHighlighted && 'border-accent shadow-lg shadow-accent/10',
      )}
    >
      {tier.isHighlighted ? (
        <div className="absolute top-4 right-4">
          <Badge tone="warning" className="inline-flex items-center gap-1">
            <Crown className="h-3 w-3" aria-hidden="true" />
            Most Popular
          </Badge>
        </div>
      ) : null}

      <CardHeader className="gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">
            {tier.name}
          </h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-primary">
              {formatTierPrice(tier)}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatPeriod(tier.period)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grow">
        <ul className="grid gap-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm leading-6">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={tier.isHighlighted ? 'default' : 'outline'}
        >
          <Link to="/auth/register">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
