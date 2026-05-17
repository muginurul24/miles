import { Link, createFileRoute } from '@tanstack/react-router'
import { Armchair, BedDouble, Plane, Star } from 'lucide-react'
import { ArticleGrid } from '#/components/cards/ArticleGrid'
import { Badge, NewsletterCTA, PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

const REVIEW_SECTIONS = [
  {
    id: 'flight',
    label: 'Flight',
    title: 'Flight reviews dengan konteks miles',
    description:
      'Cabin, seat, service, meal, award availability, dan apakah redemption-nya masuk akal untuk traveler Indonesia.',
    emptyMessage: 'Belum ada flight review.',
  },
  {
    id: 'hotel',
    label: 'Hotel',
    title: 'Hotel reviews untuk stay pakai points',
    description:
      'Review properti, elite benefit, cash rate comparison, dan kapan points hotel memberi value yang layak.',
    emptyMessage: 'Belum ada hotel review.',
  },
  {
    id: 'lounge',
    label: 'Lounge',
    title: 'Lounge reviews sebelum kamu masuk',
    description:
      'Fasilitas, crowding, food spread, akses kartu, dan apakah lounge-nya worth untuk transit maupun pre-flight.',
    emptyMessage: 'Belum ada lounge review.',
  },
] as const

type ReviewSubCategory = (typeof REVIEW_SECTIONS)[number]['id']

const reviewIcons = {
  flight: Plane,
  hotel: BedDouble,
  lounge: Armchair,
} satisfies Record<ReviewSubCategory, LucideIcon>

function isReviewSubCategory(value: string): value is ReviewSubCategory {
  return REVIEW_SECTIONS.some((section) => section.id === value)
}

function getReviewSection(value: string) {
  return REVIEW_SECTIONS.find((section) => section.id === value)
}

export const Route = createFileRoute('/reviews/$subCategory')({
  loader: async ({ context, params }) => {
    const reviews = await context.queryClient.ensureQueryData(
      context.trpc.articles.list.queryOptions({
        category: 'Review',
        subCategory: params.subCategory,
        limit: 24,
      }),
    )

    return { reviews, subCategory: params.subCategory }
  },
  head: ({ loaderData }) => {
    const section = getReviewSection(loaderData.subCategory)
    const label = section?.label ?? 'Reviews'

    return {
      meta: [
        {
          title: `${label} Reviews — JustMiles`,
        },
        {
          name: 'description',
          content:
            section?.description ??
            'Review flight, hotel, dan lounge dengan konteks points and miles untuk traveler Indonesia.',
        },
      ],
    }
  },
  component: ReviewsPage,
})

function ReviewsPage() {
  const { reviews, subCategory } = Route.useLoaderData()
  const section = getReviewSection(subCategory)
  const activeSubCategory = isReviewSubCategory(subCategory)
    ? subCategory
    : undefined
  const title = section?.title ?? 'Review belum tersedia'
  const description =
    section?.description ??
    'Pilih kategori review yang tersedia untuk melihat artikel terbaru.'

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Reviews"
        title={title}
        description={description}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Reviews' },
          { label: section?.label ?? subCategory },
        ]}
      />

      <section className="page-wrap grid gap-6">
        <ReviewSubNavigation activeSubCategory={activeSubCategory} />

        <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_18rem] md:items-center">
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent" size="md">
                  Review framework
                </Badge>
                <Badge tone="neutral" size="md">
                  Miles-first lens
                </Badge>
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">
                Review bagus harus menjawab “worth pakai miles atau cash?”
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Setiap review perlu dibaca sebagai keputusan redemption: value,
                comfort, availability, dan alternatif cash fare tetap lebih
                penting daripada foto kabin yang terlihat mahal.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-light text-accent dark:text-primary">
                  <Star className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Compare before redeem
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cocokkan review dengan value di kalkulator.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link to="/calculator">Cek IDR/mile</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="island-kicker">
              {section ? `${section.label} reviews` : 'Reviews'}
            </p>
            <h2 className="font-display text-2xl font-bold text-primary">
              Artikel review terbaru
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {reviews.length} review tersedia
          </p>
        </div>

        <ArticleGrid
          articles={reviews}
          emptyMessage={section?.emptyMessage ?? 'Belum ada review.'}
        />
      </section>

      <NewsletterCTA
        title="Dapatkan review baru sebelum menentukan redemption"
        description="Kami kirim review flight, hotel, dan lounge yang punya implikasi nyata untuk strategi points dan miles."
      />
    </main>
  )
}

interface ReviewSubNavigationProps {
  activeSubCategory?: ReviewSubCategory
}

function ReviewSubNavigation({
  activeSubCategory,
}: ReviewSubNavigationProps): ReactElement {
  return (
    <nav
      aria-label="Review categories"
      className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs sm:grid-cols-3"
    >
      {REVIEW_SECTIONS.map((section) => {
        const Icon = reviewIcons[section.id]
        const isActive = section.id === activeSubCategory

        return (
          <Button
            key={section.id}
            asChild
            variant={isActive ? 'default' : 'ghost'}
            className={cn(
              'h-auto justify-start gap-3 px-3 py-3 text-left',
              !isActive && 'text-muted-foreground hover:text-primary',
            )}
          >
            <Link
              to="/reviews/$subCategory"
              params={{ subCategory: section.id }}
              aria-current={isActive ? 'page' : undefined}
              className="no-underline"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="grid gap-0.5">
                <span className="font-semibold">{section.label} Reviews</span>
                <span className="text-xs opacity-80">
                  {section.id === 'flight'
                    ? 'Cabin & redemption'
                    : section.id === 'hotel'
                      ? 'Rooms & points value'
                      : 'Access & facilities'}
                </span>
              </span>
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
