import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CalculatorCompareTable } from '#/components/calculator/CalculatorCompareTable'
import { CalculatorFormulaExplainer } from '#/components/calculator/CalculatorFormulaExplainer'
import {
  CalculatorForm,
  getInitialCalculatorFormValue,
} from '#/components/calculator/CalculatorForm'
import { CalculatorResult } from '#/components/calculator/CalculatorResult'
import { PageHeader } from '#/components/shared'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/calculator')({
  loader: async ({ context }) => {
    const cards = await context.queryClient.ensureQueryData(
      context.trpc.calculator.cards.queryOptions(),
    )

    return { cards }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Kalkulator Miles — JustMiles',
      description:
        'Hitung estimasi poin, miles, dan IDR per mile dari transaksi kartu kredit di Indonesia.',
      path: '/calculator',
    }),
    links: buildCanonicalLinks('/calculator'),
  }),
  component: CalculatorPage,
})

function CalculatorPage() {
  const { cards } = Route.useLoaderData()
  const [formValue, setFormValue] = useState(() =>
    getInitialCalculatorFormValue(cards),
  )

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Calculator"
        title="Kalkulator miles kartu kredit"
        description="Pilih kartu, tipe transaksi, partner transfer, dan nominal belanja untuk mulai menghitung value miles kamu."
      />

      <section className="page-wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <CalculatorForm
          cards={cards}
          value={formValue}
          onValueChange={setFormValue}
        />

        <CalculatorResult cards={cards} value={formValue} />
      </section>

      <section className="page-wrap mt-6">
        <CalculatorCompareTable cards={cards} value={formValue} />
      </section>

      <CalculatorFormulaExplainer />
    </main>
  )
}
