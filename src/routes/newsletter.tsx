import { createFileRoute } from '@tanstack/react-router'
import { Bell, MailCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { NewsletterCTA, PageHeader } from '#/components/shared'
import { Card, CardContent } from '#/components/ui/card'

import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

export const Route = createFileRoute('/newsletter')({
  head: () => ({
    meta: [
      {
        title: 'Newsletter — JustMiles',
      },
      {
        name: 'description',
        content:
          'Subscribe newsletter JustMiles untuk update promo kartu, sweet spot redemption, dan strategi points and miles mingguan.',
      },
    ],
  }),
  component: NewsletterPage,
})

const newsletterBenefits = [
  {
    title: 'Promo yang perlu dicek',
    description:
      'Ringkasan promo transfer points, welcome bonus, dan perubahan program yang berpengaruh ke keputusan kartu.',
    icon: Bell,
  },
  {
    title: 'Sweet spot redemption',
    description:
      'Rute, cabin, dan program yang sedang menarik untuk traveler Indonesia tanpa harus membaca semua update global.',
    icon: Sparkles,
  },
  {
    title: 'Strategi yang bisa dipakai',
    description:
      'Checklist mingguan untuk menghindari transfer impulsif, annual fee buruk, dan redemption bernilai rendah.',
    icon: MailCheck,
  },
  {
    title: 'Privasi sederhana',
    description:
      'Email hanya dipakai untuk update JustMiles. Unsubscribe akan tersedia dari email campaign berikutnya.',
    icon: ShieldCheck,
  },
] as const

function NewsletterPage(): ReactElement {
  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="Newsletter"
        title="Update points & miles yang cukup ringkas untuk benar-benar dibaca"
        description="Masuk saat ada hal yang bisa mengubah keputusan: promo transfer, kartu baru, sweet spot redemption, dan warning sebelum value turun."
      />

      <section className="page-wrap grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {newsletterBenefits.map((benefit) => (
          <NewsletterBenefitCard key={benefit.title} benefit={benefit} />
        ))}
      </section>

      <NewsletterCTA
        className="mt-8"
        title="Subscribe sekali, aktif di semua update JustMiles"
        description="Kami simpan email secara aman dan idempotent: submit ulang tidak membuat duplikasi subscriber."
      />
    </main>
  )
}

interface NewsletterBenefit {
  title: string
  description: string
  icon: LucideIcon
}

interface NewsletterBenefitCardProps {
  benefit: NewsletterBenefit
}

function NewsletterBenefitCard({
  benefit,
}: NewsletterBenefitCardProps): ReactElement {
  const Icon = benefit.icon

  return (
    <Card className="h-full border-border bg-card shadow-xs">
      <CardContent className="grid gap-4 p-5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-light text-accent dark:text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-primary">
            {benefit.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {benefit.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
