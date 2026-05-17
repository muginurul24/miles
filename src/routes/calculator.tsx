import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CalculatorCompareTable } from '#/components/calculator/CalculatorCompareTable'
import {
  CalculatorForm,
  getInitialCalculatorFormValue,
} from '#/components/calculator/CalculatorForm'
import { CalculatorResult } from '#/components/calculator/CalculatorResult'
import { PageHeader } from '#/components/shared'

export const Route = createFileRoute('/calculator')({
  loader: async ({ context }) => {
    const cards = await context.queryClient.ensureQueryData(
      context.trpc.calculator.cards.queryOptions(),
    )

    return { cards }
  },
  head: () => ({
    meta: [
      {
        title: 'Kalkulator Miles — JustMiles',
      },
      {
        name: 'description',
        content:
          'Hitung estimasi poin, miles, dan IDR per mile dari transaksi kartu kredit di Indonesia.',
      },
    ],
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
    </main>
  )
}
