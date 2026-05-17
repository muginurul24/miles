import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/home/HeroSection'
import { StatsBar } from '#/components/home/StatsBar'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
    </main>
  )
}
