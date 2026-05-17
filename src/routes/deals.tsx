import { Link, createFileRoute } from '@tanstack/react-router'
import { BellRing, Clock3, ShieldCheck, Sparkles } from 'lucide-react'
import { ArticleGrid } from '#/components/cards/ArticleGrid'
import { Badge, NewsletterCTA, PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'

import type { ReactElement, ReactNode } from 'react'

export const Route = createFileRoute('/deals')({
  loader: async ({ context }) => {
    const deals = await context.queryClient.ensureQueryData(
      context.trpc.articles.list.queryOptions({
        category: 'Deal',
        limit: 24,
      }),
    )

    return { deals }
  },
  head: () => ({
    meta: [
      {
        title: 'Deals Points & Miles — JustMiles',
      },
      {
        name: 'description',
        content:
          'Promo transfer miles, sweet spot redemption, welcome bonus kartu kredit, dan travel deals pilihan untuk traveler Indonesia.',
      },
    ],
  }),
  component: DealsPage,
})

function DealsPage() {
  const { deals } = Route.useLoaderData()
  const hotDealsCount = deals.filter((deal) => deal.dealTag === 'HOT').length
  const sweetSpotsCount = deals.filter(
    (deal) => deal.dealTag === 'SWEET SPOT',
  ).length

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Deals"
        title="Promo dan sweet spot yang layak dicek"
        description="Deal page ini dibuat sebagai radar cepat: mana yang urgent, mana yang benar-benar bernilai, dan mana yang perlu dibaca syaratnya sebelum transfer poin."
      />

      <section className="page-wrap grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DealSignalCard
            icon={<BellRing className="h-5 w-5" aria-hidden="true" />}
            label="Hot deals"
            value={hotDealsCount.toString()}
            description="Promo terbatas yang perlu dicek lebih dulu."
          />
          <DealSignalCard
            icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
            label="Sweet spots"
            value={sweetSpotsCount.toString()}
            description="Redemption dengan value tinggi dibanding cash fare."
          />
          <DealSignalCard
            icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
            label="Rule check"
            value="Wajib"
            description="Selalu cek kuota, periode, dan bank partner."
          />
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="danger" size="md">
                  HOT
                </Badge>
                <Badge tone="success" size="md">
                  SWEET SPOT
                </Badge>
                <Badge tone="info" size="md">
                  PROMO
                </Badge>
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">
                Jangan transfer poin hanya karena ada bonus
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Badge membantu prioritas membaca. Keputusan final tetap harus
                melihat kebutuhan rute, availability award, expiry miles, dan
                biaya pajak/fees.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-light text-accent dark:text-primary">
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Hitung value dulu
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pastikan IDR/mile masih masuk akal.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link to="/calculator">Validasi dengan kalkulator</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="island-kicker">Curated deals</p>
            <h2 className="font-display text-2xl font-bold text-primary">
              Semua deals terbaru
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {deals.length} deal tersedia
          </p>
        </div>

        <ArticleGrid
          articles={deals}
          emptyTitle="Belum ada deal"
          emptyMessage="Belum ada deal terbaru."
        />
      </section>

      <NewsletterCTA
        title="Dapatkan alert deal yang sudah dikurasi"
        description="Kami prioritaskan promo yang layak dihitung, bukan sekadar headline bonus besar."
      />
    </main>
  )
}

interface DealSignalCardProps {
  icon: ReactNode
  label: string
  value: string
  description: string
}

function DealSignalCard({
  icon,
  label,
  value,
  description,
}: DealSignalCardProps): ReactElement {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-light text-accent dark:text-primary">
          {icon}
        </span>
        <span className="font-mono text-2xl font-bold text-primary">
          {value}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold text-primary">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
