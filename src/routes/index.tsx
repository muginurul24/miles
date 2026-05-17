import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArticleSection } from '#/components/home/ArticleSection'
import { BottomCtas } from '#/components/home/BottomCtas'
import { CalculatorPreview } from '#/components/home/CalculatorPreview'
import { HeroSection } from '#/components/home/HeroSection'
import { MembershipBanner } from '#/components/home/MembershipBanner'
import { StatsBar } from '#/components/home/StatsBar'
import { TopCardsSection } from '#/components/home/TopCardsSection'
import { NewsletterCTA } from '#/components/shared'
import { buildCanonicalLinks, buildSeoMeta, DEFAULT_SEO } from '#/lib/seo'

const getHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ articlesRepo }, { calculatorRepo }, { cardsRepo }] =
    await Promise.all([
      import('#/server/repositories/articles.repo'),
      import('#/server/repositories/calculator.repo'),
      import('#/server/repositories/cards.repo'),
    ])

  const [cards, latestNews, topCards, latestGuides, latestReviews] =
    await Promise.all([
      calculatorRepo.getCards(),
      articlesRepo.findAll({ category: 'News', limit: 3 }),
      cardsRepo.findTopByEarning(3),
      articlesRepo.findAll({ category: 'Guide', limit: 3 }),
      articlesRepo.findAll({ category: 'Review', limit: 3 }),
    ])

  return {
    cards,
    latestNews,
    topCards,
    latestGuides,
    latestReviews,
  }
})

export const Route = createFileRoute('/')({
  loader: async () => getHomeData(),
  head: () => ({
    meta: buildSeoMeta(DEFAULT_SEO),
    links: [
      ...buildCanonicalLinks(DEFAULT_SEO.path),
      {
        rel: 'preload',
        as: 'image',
        href: '/images/hero-airport.jpg',
        fetchPriority: 'high',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { cards, latestNews, topCards, latestGuides, latestReviews } =
    Route.useLoaderData()

  return (
    <main>
      <HeroSection />
      <StatsBar />
      <CalculatorPreview cards={cards} />
      <ArticleSection
        eyebrow="Latest News"
        title="Update terbaru points dan miles"
        description="Perubahan program, promo transfer, dan berita yang bisa langsung memengaruhi keputusan redemption kamu."
        articles={latestNews}
      />
      <TopCardsSection cards={topCards} />
      <ArticleSection
        eyebrow="Latest Guides"
        title="Panduan yang bisa langsung dipakai"
        description="Mulai dari dasar sampai strategi yang lebih lanjut untuk transfer poin, award chart, dan portfolio kartu."
        articles={latestGuides}
      />
      <ArticleSection
        eyebrow="Latest Reviews"
        title="Review trip yang lebih transparan"
        description="Lihat pengalaman nyata di flight, hotel, dan lounge sebelum kamu menukar poin untuk itinerary berikutnya."
        articles={latestReviews}
      />
      <NewsletterCTA />
      <MembershipBanner />
      <BottomCtas />
    </main>
  )
}
