import { Send } from 'lucide-react'
import { useId, useState } from 'react'
import { z } from 'zod'
import { showToast } from '#/components/Toast'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'

import type { FormEvent, ReactElement } from 'react'

export interface NewsletterCTAProps {
  title?: string
  description?: string
  className?: string
}

const newsletterSchema = z.object({
  email: z.string().trim().email('Masukkan email yang valid.'),
})

export function NewsletterCTA({
  title = 'Dapatkan update miles terbaik setiap minggu',
  description = 'Ringkasan promo kartu, sweet spot redemption, dan strategi poin yang relevan untuk traveler Indonesia.',
  className,
}: NewsletterCTAProps): ReactElement {
  const inputId = useId()
  const errorId = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const parsed = newsletterSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Email belum valid.')
      return
    }

    setError(null)
    setEmail('')
    showToast('Email kamu masuk daftar tunggu JustMiles.')
  }

  return (
    <section
      className={cn(
        'border-y border-border bg-card px-4 py-10 text-card-foreground md:py-12',
        className,
      )}
    >
      <div className="page-wrap grid gap-6 md:grid-cols-[1fr_minmax(20rem,26rem)] md:items-center">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Newsletter
          </p>
          <h2 className="m-0 font-display text-2xl font-bold tracking-normal text-primary sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id={inputId}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? errorId : undefined}
              className="h-11 bg-background"
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" className="h-11 shrink-0">
              <Send className="h-4 w-4" aria-hidden="true" />
              Subscribe
            </Button>
          </div>
          {error ? (
            <p id={errorId} className="m-0 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
