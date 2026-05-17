import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CalculatorForm,
  getInitialCalculatorFormValue,
} from '#/components/calculator/CalculatorForm'
import { PageHeader } from '#/components/shared'
import { Card, CardContent } from '#/components/ui/card'

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

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="grid gap-3 p-6">
            <p className="island-kicker">Next</p>
            <h2 className="font-display text-xl font-bold text-primary">
              Result panel sedang disiapkan
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Form inti sudah siap; story berikutnya akan menampilkan rating,
              poin, miles, dan IDR per mile secara real-time.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
