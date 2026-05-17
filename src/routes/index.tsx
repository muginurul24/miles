import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { CalculatorPreview } from '#/components/home/CalculatorPreview'
import { HeroSection } from '#/components/home/HeroSection'
import { StatsBar } from '#/components/home/StatsBar'

const getCalculatorCards = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { calculatorRepo } =
      await import('#/server/repositories/calculator.repo')

    return calculatorRepo.getCards()
  },
)

export const Route = createFileRoute('/')({
  loader: async () => ({
    cards: await getCalculatorCards(),
  }),
  component: HomePage,
})

function HomePage() {
  const { cards } = Route.useLoaderData()

  return (
    <main>
      <HeroSection />
      <StatsBar />
      <CalculatorPreview cards={cards} />
    </main>
  )
}
