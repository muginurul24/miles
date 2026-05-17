import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArticleSection } from '#/components/home/ArticleSection'
import { CalculatorPreview } from '#/components/home/CalculatorPreview'
import { HeroSection } from '#/components/home/HeroSection'
import { StatsBar } from '#/components/home/StatsBar'

const getHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ articlesRepo }, { calculatorRepo }] = await Promise.all([
    import('#/server/repositories/articles.repo'),
    import('#/server/repositories/calculator.repo'),
  ])

  const [cards, latestNews] = await Promise.all([
    calculatorRepo.getCards(),
    articlesRepo.findAll({ category: 'News', limit: 3 }),
  ])

  return {
    cards,
    latestNews,
  }
})

export const Route = createFileRoute('/')({
  loader: async () => getHomeData(),
  component: HomePage,
})

function HomePage() {
  const { cards, latestNews } = Route.useLoaderData()

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
    </main>
  )
}
