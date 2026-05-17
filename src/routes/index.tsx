import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArticleSection } from '#/components/home/ArticleSection'
import { CalculatorPreview } from '#/components/home/CalculatorPreview'
import { HeroSection } from '#/components/home/HeroSection'
import { StatsBar } from '#/components/home/StatsBar'
import { TopCardsSection } from '#/components/home/TopCardsSection'

const getHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ articlesRepo }, { calculatorRepo }, { cardsRepo }] =
    await Promise.all([
      import('#/server/repositories/articles.repo'),
      import('#/server/repositories/calculator.repo'),
      import('#/server/repositories/cards.repo'),
    ])

  const [cards, latestNews, topCards] = await Promise.all([
    calculatorRepo.getCards(),
    articlesRepo.findAll({ category: 'News', limit: 3 }),
    cardsRepo.findAll({ sort: 'earning_best' }),
  ])

  return {
    cards,
    latestNews,
    topCards: topCards.slice(0, 3),
  }
})

export const Route = createFileRoute('/')({
  loader: async () => getHomeData(),
  component: HomePage,
})

function HomePage() {
  const { cards, latestNews, topCards } = Route.useLoaderData()

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
    </main>
  )
}
