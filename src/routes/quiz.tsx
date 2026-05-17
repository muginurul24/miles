import { createFileRoute } from '@tanstack/react-router'
import { AdvisorQuizForm } from '#/components/quiz/AdvisorQuizForm'
import { PageHeader } from '#/components/shared'

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
    meta: [
      {
        title: 'Advisor Quiz — JustMiles',
      },
      {
        name: 'description',
        content:
          'Quiz JustMiles untuk mengumpulkan preferensi spending, travel, airline, lounge, annual fee, dan target redemption sebelum rekomendasi kartu.',
      },
    ],
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
      />

      <AdvisorQuizForm cards={cards} />
    </main>
  )
}
