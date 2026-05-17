import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, UserPlus } from 'lucide-react'
import { useState } from 'react'
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
import { cn } from '#/lib/utils.ts'

import type { ComponentProps, FormEvent } from 'react'

export function SignupForm({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Nama, email, dan password wajib diisi.')
      return
    }

    if (password.length < 8) {
      setFormError('Password minimal 8 karakter.')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Konfirmasi password tidak sama.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (result.error) {
        setFormError(result.error.message ?? 'Akun gagal dibuat.')
        return
      }

      await navigate({ to: '/' })
    } catch {
      setFormError('Pendaftaran gagal diproses. Coba lagi beberapa saat.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      className={cn('border-border bg-card shadow-sm', className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="font-display text-2xl">Daftar</CardTitle>
        <CardDescription>
          Buat akun untuk menyimpan preferensi kartu dan konsultasi JustMiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nama lengkap"
                aria-invalid={Boolean(formError)}
                required
              />
            </Field>
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
                autoComplete="new-password"
                aria-invalid={Boolean(formError)}
                required
              />
              <FieldDescription>Minimal 8 karakter.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Konfirmasi</FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(formError)}
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <FieldError>{formError}</FieldError>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Daftar
                </Button>
                <FieldDescription className="px-6 text-center">
                  Sudah punya akun? <Link to="/auth/login">Masuk</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
