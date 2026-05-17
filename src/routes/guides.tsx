import { Link, createFileRoute } from '@tanstack/react-router'
import { LockKeyhole, Route as RouteIcon, Sparkles } from 'lucide-react'
import { ArticleGrid } from '#/components/cards/ArticleGrid'
import {
  Badge,
  NewsletterCTA,
  PageHeader,
  PremiumContentCTA,
} from '#/components/shared'
import { Button } from '#/components/ui/button'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/guides')({
  loader: async ({ context }) => {
    const guides = await context.queryClient.ensureQueryData(
      context.trpc.articles.list.queryOptions({
        category: 'Guide',
        limit: 24,
      }),
    )

    return { guides }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Guides Points & Miles — JustMiles',
      description:
        'Panduan points, miles, kartu kredit, award chart, transfer partner, dan strategi redemption untuk traveler Indonesia.',
      path: '/guides',
    }),
    links: buildCanonicalLinks('/guides'),
  }),
  component: GuidesPage,
})

function GuidesPage() {
  const { guides } = Route.useLoaderData()
  const premiumGuidesCount = guides.filter((guide) => guide.premium).length

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Guides"
        title="Panduan praktis untuk naik level"
        description="Mulai dari dasar points dan miles sampai strategi multi-kartu. Semua ditulis untuk keputusan nyata: kartu apa dipakai, poin kapan ditransfer, dan redemption mana yang layak."
      />

      <section className="page-wrap grid gap-6">
        <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-center">
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent" size="md">
                  Learning path
                </Badge>
                {premiumGuidesCount > 0 ? (
                  <Badge
                    tone="warning"
                    size="md"
                    className="inline-flex items-center gap-1"
                  >
                    <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                    {premiumGuidesCount} premium guide
                  </Badge>
                ) : null}
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">
                Bangun sistem earning sebelum mengejar promo
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Guide terbuka cocok untuk fondasi. Guide premium ditandai jelas
                untuk strategi yang lebih taktis: portfolio kartu, timing
                transfer, dan prioritas redemption bernilai tinggi.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-light text-accent dark:text-primary">
                  <RouteIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Mulai dari pemula
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ikuti urutan guide, lalu validasi dengan kalkulator.
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link to="/calculator">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Coba kalkulator
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="island-kicker">All guides</p>
            <h2 className="font-display text-2xl font-bold text-primary">
              Playbook points & miles
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {guides.length} guide tersedia
          </p>
        </div>

        <ArticleGrid
          articles={guides}
          emptyTitle="Belum ada guide"
          emptyMessage="Belum ada guide."
        />
      </section>

      <PremiumContentCTA
        className="my-10"
        title="Butuh playbook lebih dalam dari guide publik?"
        description="Guide premium akan fokus pada strategi portfolio kartu, timing transfer, dan prioritas redemption yang lebih taktis untuk target trip tertentu."
        highlight="Guide premium"
      />

      <NewsletterCTA
        title="Dapatkan guide baru tanpa harus mengecek promo satu-satu"
        description="Kami rangkum strategi earning, transfer partner, dan redemption yang relevan untuk traveler Indonesia."
      />
    </main>
  )
}
