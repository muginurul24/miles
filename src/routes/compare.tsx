import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CompareForm,
  getInitialCompareFormValue,
} from '#/components/compare/CompareForm'
import {
  CompareSpendingInputs,
  getInitialCompareSpendingValue,
} from '#/components/compare/CompareSpendingInputs'
import { PageHeader } from '#/components/shared'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/compare')({
  loader: async ({ context }) => {
    const cards = await context.queryClient.ensureQueryData(
      context.trpc.calculator.cards.queryOptions(),
    )

    return { cards }
  },
  head: () => ({
    meta: [
      {
        title: 'Bandingkan Kartu Kredit — JustMiles',
      },
      {
        name: 'description',
        content:
          'Bandingkan earning rate, transfer partner, dan estimasi miles dari beberapa kartu kredit.',
      },
    ],
  }),
  component: ComparePage,
})

function ComparePage() {
  const { cards } = Route.useLoaderData()
  const [formValue, setFormValue] = useState(() =>
    getInitialCompareFormValue(cards),
  )
  const [spendingValue, setSpendingValue] = useState(() =>
    getInitialCompareSpendingValue(),
  )

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Compare"
        title="Bandingkan kartu kredit miles"
        description="Pilih hingga tiga kartu dan transfer partner untuk mulai membandingkan earning strategy kamu."
      />

      <section className="page-wrap grid gap-6">
        <CompareForm
          cards={cards}
          value={formValue}
          onValueChange={setFormValue}
        />

        <CompareSpendingInputs
          value={spendingValue}
          onValueChange={setSpendingValue}
        />

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="grid gap-3 p-6">
            <p className="island-kicker">Next</p>
            <h2 className="font-display text-xl font-bold text-primary">
              Results panel menyusul
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Story berikutnya akan mengubah pilihan kartu dan komposisi
              spending menjadi side-by-side metrics.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
