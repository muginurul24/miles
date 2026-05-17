import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { cn } from '#/lib/utils.ts'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { authClient } from '#/lib/auth-client.ts'

import type { ComponentProps, FormEvent } from 'react'

export function LoginForm({ className, ...props }: ComponentProps<'div'>) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      setFormError('Email dan password wajib diisi.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      })

      if (result.error) {
        setFormError(result.error.message ?? 'Email atau password tidak valid.')
        return
      }

      await navigate({ to: '/' })
    } catch {
      setFormError('Login gagal diproses. Coba lagi beberapa saat.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Masuk</CardTitle>
          <CardDescription>
            Kelola membership, konsultasi, dan preferensi kartu JustMiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  aria-invalid={Boolean(formError)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(formError)}
                  required
                />
              </Field>
              <Field>
                <FieldError>{formError}</FieldError>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                  )}
                  Masuk
                </Button>
                <FieldDescription className="text-center">
                  Belum punya akun? <a href="/auth/register">Daftar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
