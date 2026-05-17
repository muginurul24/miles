import { Link } from '@tanstack/react-router'
import { ArrowRight, Compass, MessageSquareText } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'

import type { ReactElement } from 'react'

const ctas = [
  {
    title: 'Butuh strategi kartu yang lebih personal?',
    description:
      'Diskusikan portfolio, target miles, dan pola spending kamu lewat sesi consulting terarah.',
    href: '/consulting',
    label: 'Lihat Consulting',
    icon: MessageSquareText,
  },
  {
    title: 'Belum yakin kartu mana yang paling cocok?',
    description:
      'Jawab beberapa pertanyaan singkat untuk mendapat rekomendasi awal yang lebih relevan.',
    href: '/quiz',
    label: 'Mulai Quiz',
    icon: Compass,
  },
] as const

export function BottomCtas(): ReactElement {
  return (
    <section className="page-wrap py-10 md:py-14">
      <div className="grid gap-4 md:grid-cols-2">
        {ctas.map((cta) => {
          const Icon = cta.icon

          return (
            <Card key={cta.title} className="border-border bg-card shadow-xs">
              <CardContent className="grid gap-5 p-5 sm:p-6">
                <span className="flex size-10 items-center justify-center rounded-md bg-accent-light text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold leading-7 text-primary">
                    {cta.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {cta.description}
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-fit">
                  <Link to={cta.href} className="no-underline">
                    {cta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
