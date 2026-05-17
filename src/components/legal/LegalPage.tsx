import { ExternalLink, Mail, ShieldCheck } from 'lucide-react'
import { Badge, PageHeader } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'

import type { LegalPageContent, LegalSection } from './legal-content'
import type { ReactElement } from 'react'

export interface LegalPageProps {
  content: LegalPageContent
}

export function LegalPage({ content }: LegalPageProps): ReactElement {
  return (
    <main className="pb-12">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <section className="page-wrap grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader>
              <Badge tone="accent" size="md" className="w-fit">
                Updated
              </Badge>
              <CardTitle className="font-display text-xl text-primary">
                {content.lastUpdated}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {content.summary}
              </p>
              <Separator />
              <nav aria-label="Daftar bagian kebijakan privasi">
                <ul className="grid gap-2">
                  {content.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-accent"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </aside>

        <article className="rounded-3xl border border-border bg-card p-5 shadow-xs md:p-7">
          <div className="mb-6 flex gap-3 rounded-2xl border border-border bg-background/70 p-4">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <p className="m-0 text-sm leading-6 text-muted-foreground">
              Halaman ini ditulis agar pengguna memahami tujuan pemrosesan data
              dengan bahasa praktis. Jika ada perubahan material, tanggal
              pembaruan akan diganti.
            </p>
          </div>

          <div className="grid gap-7">
            {content.sections.map((section) => (
              <LegalSectionBlock key={section.id} section={section} />
            ))}
          </div>

          {content.source ? (
            <div className="mt-8 rounded-2xl border border-border bg-background/70 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                Rujukan regulasi
              </p>
              <Button asChild variant="outline">
                <a href={content.source.href} target="_blank" rel="noreferrer">
                  {content.source.label}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-primary p-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Privacy request</p>
              <p className="mt-1 text-sm text-primary-foreground/70">
                Gunakan email khusus agar permintaan data mudah ditriage.
              </p>
            </div>
            <Button asChild variant="secondary">
              <a href="mailto:hello@justmiles.id?subject=Privacy%20Request">
                <Mail className="h-4 w-4" aria-hidden="true" />
                hello@justmiles.id
              </a>
            </Button>
          </div>
        </article>
      </section>
    </main>
  )
}

function LegalSectionBlock({
  section,
}: {
  section: LegalSection
}): ReactElement {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-primary">
        {section.title}
      </h2>
      <div className="mt-3 grid gap-3">
        {section.body.map((paragraph) => (
          <p
            key={paragraph}
            className="m-0 text-sm leading-7 text-muted-foreground sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>
      {section.bullets ? (
        <ul className="mt-4 grid gap-2">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-sm leading-6">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-muted-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
