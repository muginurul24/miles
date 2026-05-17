import { BadgeCheck, CreditCard, Newspaper, PlaneTakeoff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

const stats = [
  {
    label: 'Kartu Kredit',
    value: '12+',
    icon: CreditCard,
  },
  {
    label: 'Program Miles',
    value: '5',
    icon: PlaneTakeoff,
  },
  {
    label: 'Artikel',
    value: '50+',
    icon: Newspaper,
  },
  {
    label: 'Gratis',
    value: '100%',
    icon: BadgeCheck,
  },
] as const

export function StatsBar() {
  return (
    <section className="border-y border-border bg-background py-6">
      <div className="page-wrap grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card
              key={stat.label}
              className="rounded-lg border-border bg-card/95 py-4 shadow-xs"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-3 px-4">
                <CardTitle className="font-mono text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-md bg-accent-light text-accent">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
