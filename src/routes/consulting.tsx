import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Route as RouteIcon,
  Sparkles,
} from 'lucide-react'
import { ConsultingInquiryForm } from '#/components/consulting/ConsultingInquiryForm'
import { Badge, PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

import type { ConsultingPackageView } from '#/server/repositories/consulting.repo'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

export const Route = createFileRoute('/consulting')({
  loader: async ({ context }) => {
    const packages = await context.queryClient.ensureQueryData(
      context.trpc.consulting.packages.queryOptions(),
    )

    return { packages }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Consulting — JustMiles',
      description:
        'Paket konsultasi JustMiles untuk audit kartu kredit, rencana redemption, strategi miles end-to-end, dan kebutuhan corporate travel.',
      path: '/consulting',
    }),
    links: buildCanonicalLinks('/consulting'),
  }),
  component: ConsultingPage,
})

const packageIcons = {
  CreditCard,
  Route: RouteIcon,
  Sparkles,
  Building2,
} satisfies Record<string, LucideIcon>

function getPackageIcon(icon: string | null): LucideIcon {
  return icon ? (packageIcons[icon] ?? Sparkles) : Sparkles
}

function ConsultingPage() {
  const { packages } = Route.useLoaderData()

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Consulting"
        title="Konsultasi untuk keputusan miles yang lebih mahal"
        description="Gunakan consulting saat keputusanmu sudah konkret: kartu mana dipertahankan, rute mana ditukar, kapan transfer poin, dan apa fallback kalau availability berubah."
        actions={
          <Button asChild size="lg">
            <a href="#consulting-inquiry" className="no-underline">
              Mulai inquiry
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        }
      />

      <section
        id="consulting-packages"
        className="page-wrap grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {packages.map((consultingPackage) => (
          <ConsultingPackageCard
            key={consultingPackage.id}
            consultingPackage={consultingPackage}
          />
        ))}
      </section>

      <ConsultingInquiryForm packages={packages} />

      <section className="page-wrap mt-8 rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_20rem] md:items-center">
          <div>
            <p className="island-kicker">When to book</p>
            <h2 className="font-display text-2xl font-bold text-primary">
              Consulting dipakai saat ada keputusan, bukan rasa penasaran
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kalau pertanyaannya masih umum, mulai dari guides dan calculator.
              Kalau sudah menyangkut annual fee, transfer poin, atau rute mahal,
              consulting memberi struktur keputusan yang lebih cepat.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/50 p-4">
            <p className="text-sm font-semibold text-primary">
              Output harus actionable
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Setiap paket berakhir dengan checklist atau roadmap, bukan hanya
              opini umum.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

interface ConsultingPackageCardProps {
  consultingPackage: ConsultingPackageView
}

function ConsultingPackageCard({
  consultingPackage,
}: ConsultingPackageCardProps): ReactElement {
  const Icon = getPackageIcon(consultingPackage.icon)

  return (
    <Card className="h-full border-border bg-card shadow-xs">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <Badge tone="accent" size="md">
            {consultingPackage.priceLabel ?? 'Custom'}
          </Badge>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-primary">
            {consultingPackage.name}
          </h2>
          {consultingPackage.description ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {consultingPackage.description}
            </p>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grow">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          Outputs
        </p>
        <ul className="grid gap-3">
          {consultingPackage.outputs.map((output) => (
            <li key={output} className="flex gap-2 text-sm leading-6">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{output}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <a href="#consulting-inquiry" className="no-underline">
            Pilih paket
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
