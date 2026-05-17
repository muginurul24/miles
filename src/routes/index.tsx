import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/home/HeroSection'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <HeroSection />
    </main>
  )
}
