import { Link } from '@tanstack/react-router'
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { ArticleBody } from '#/components/content/ArticleBody'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement, ReactNode } from 'react'

export interface PremiumArticleGateProps {
  article: Article
  children: ReactNode
}

export function PremiumArticleGate({
  article,
  children,
}: PremiumArticleGateProps): ReactElement {
  const isLocked = article.premium && !article.content

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className="grid gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs">
        <ArticleBody
          article={{
            ...article,
            content:
              article.excerpt ??
              'Preview tersedia. Daftar untuk membuka analisis premium lengkap.',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card via-card/85 to-transparent"
          aria-hidden="true"
        />
      </div>

      <section className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-xs md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_18rem] md:items-center">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone="warning"
                size="md"
                className="inline-flex items-center gap-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
              >
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Premium locked
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Content protected
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Buka analisis premium ini
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
                Konten premium hanya ditampilkan untuk member berbayar. Untuk
                sekarang, daftar akun agar preferensi kamu siap saat membership
                diaktifkan.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent-hover"
            >
              <Link to="/auth/register">
                Daftar akses premium
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/auth/login">Sudah punya akun? Masuk</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
