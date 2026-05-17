import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CompareForm,
  getInitialCompareFormValue,
} from '#/components/compare/CompareForm'
import { CompareDisclaimer } from '#/components/compare/CompareDisclaimer'
import { CompareResults } from '#/components/compare/CompareResults'
import {
  CompareSpendingInputs,
  getInitialCompareSpendingValue,
} from '#/components/compare/CompareSpendingInputs'
import { PageHeader } from '#/components/shared'

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

        <CompareResults
          cards={cards}
          selections={formValue}
          spending={spendingValue}
        />

        <CompareDisclaimer />
      </section>
    </main>
  )
}
