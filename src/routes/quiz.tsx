import { Link, createFileRoute } from '@tanstack/react-router'
import { Calculator, GitCompareArrows, MessageSquareText } from 'lucide-react'
import { AdvisorQuizForm } from '#/components/quiz/AdvisorQuizForm'
import { Badge, PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

export const Route = createFileRoute('/quiz')({
  loader: async ({ context }) => {
    const cards = await context.queryClient.ensureQueryData(
      context.trpc.cards.list.queryOptions({
        sort: 'earning_best',
      }),
    )

    return { cards }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Advisor Quiz — JustMiles',
      description:
        'Quiz JustMiles untuk mengumpulkan preferensi spending, travel, airline, lounge, annual fee, dan target redemption sebelum rekomendasi kartu.',
      path: '/quiz',
    }),
    links: buildCanonicalLinks('/quiz'),
  }),
  component: QuizPage,
})

function QuizPage() {
  const { cards } = Route.useLoaderData()

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Advisor Quiz"
        title="Temukan kartu yang paling masuk akal untuk pola travelmu"
        description="Jawab 8 pertanyaan inti. Form ini menjadi fondasi scoring rekomendasi top 3 kartu di tahap berikutnya."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Advisor Quiz' }]}
        actions={
          <>
            <Button asChild variant="outline" size="lg">
              <Link to="/calculator">
                Buka calculator
                <Calculator className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/compare">
                Compare kartu
                <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      <QuizDecisionFlow />
      <AdvisorQuizForm cards={cards} />
    </main>
  )
}

const decisionFlowItems = [
  {
    title: '1. Jawab quiz',
    description:
      'Pilih pola spending, destinasi, airline, lounge, annual fee, dan target redemption.',
    label: 'Input preferensi',
    icon: GitCompareArrows,
  },
  {
    title: '2. Validasi angka',
    description:
      'Cek IDR/mile dan estimasi miles/tahun sebelum apply kartu atau bayar annual fee.',
    label: 'Calculator siap',
    icon: Calculator,
  },
  {
    title: '3. Eskalasi keputusan',
    description:
      'Kalau hasilnya high-stakes, bawa shortlist ke consulting untuk strategi yang lebih presisi.',
    label: 'Consulting optional',
    icon: MessageSquareText,
  },
] as const

interface DecisionFlowItem {
  title: string
  description: string
  label: string
  icon: LucideIcon
}

function QuizDecisionFlow(): ReactElement {
  return (
    <section className="page-wrap mb-6 grid gap-4 md:grid-cols-3">
      {decisionFlowItems.map((item) => (
        <DecisionFlowCard key={item.title} item={item} />
      ))}
    </section>
  )
}

interface DecisionFlowCardProps {
  item: DecisionFlowItem
}

function DecisionFlowCard({ item }: DecisionFlowCardProps): ReactElement {
  const Icon = item.icon

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardContent className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <Badge tone="accent" size="md">
            {item.label}
          </Badge>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-primary">
            {item.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
