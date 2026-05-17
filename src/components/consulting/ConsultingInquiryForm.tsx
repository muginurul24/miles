import { useState } from 'react'
import { z } from 'zod'
import { showToast } from '#/components/Toast'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'

import type { ConsultingPackageView } from '#/server/repositories/consulting.repo'
import type { FormEvent, ReactElement, ReactNode } from 'react'

export interface ConsultingInquiryFormProps {
  packages: ConsultingPackageView[]
}

interface ConsultingInquiryFormValue {
  name: string
  email: string
  phone: string
  packageId: string
  currentCards: string
  needs: string
}

type ConsultingInquiryField = keyof ConsultingInquiryFormValue
type ConsultingInquiryErrors = Partial<Record<ConsultingInquiryField, string>>

const fieldNames = [
  'name',
  'email',
  'phone',
  'packageId',
  'currentCards',
  'needs',
] as const satisfies ConsultingInquiryField[]

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().trim().email('Email belum valid.'),
  phone: z.string().trim().optional(),
  packageId: z.string().trim().min(1, 'Pilih paket konsultasi.'),
  currentCards: z.string().trim().optional(),
  needs: z
    .string()
    .trim()
    .min(20, 'Jelaskan kebutuhan minimal 20 karakter.')
    .max(1200, 'Kebutuhan maksimal 1200 karakter.'),
})

const initialValue: ConsultingInquiryFormValue = {
  name: '',
  email: '',
  phone: '',
  packageId: '',
  currentCards: '',
  needs: '',
}

function isInquiryField(value: unknown): value is ConsultingInquiryField {
  return (
    typeof value === 'string' &&
    fieldNames.includes(value as ConsultingInquiryField)
  )
}

function getValidationErrors(issues: z.ZodIssue[]): ConsultingInquiryErrors {
  return issues.reduce<ConsultingInquiryErrors>((errors, issue) => {
    const field = issue.path.at(0)

    if (isInquiryField(field)) {
      errors[field] = issue.message
    }

    return errors
  }, {})
}

export function ConsultingInquiryForm({
  packages,
}: ConsultingInquiryFormProps): ReactElement {
  const [value, setValue] = useState<ConsultingInquiryFormValue>(initialValue)
  const [errors, setErrors] = useState<ConsultingInquiryErrors>({})

  function updateValue(nextValue: Partial<ConsultingInquiryFormValue>): void {
    setValue((currentValue) => ({ ...currentValue, ...nextValue }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const parsed = inquirySchema.safeParse(value)
    if (!parsed.success) {
      setErrors(getValidationErrors(parsed.error.issues))
      return
    }

    setErrors({})
    setValue(initialValue)
    showToast(
      'Inquiry tervalidasi. Pengiriman backend aktif di tahap berikutnya.',
    )
  }

  return (
    <section
      id="consulting-inquiry"
      className="page-wrap mt-8 scroll-mt-24"
      aria-labelledby="consulting-inquiry-title"
    >
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <p className="island-kicker">Inquiry form</p>
          <CardTitle
            id="consulting-inquiry-title"
            className="font-display text-2xl text-primary"
          >
            Ceritakan keputusan yang ingin dibantu
          </CardTitle>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Semakin konkret konteksnya, semakin cepat kami bisa memberi paket
            dan output yang tepat.
          </p>
        </CardHeader>

        <CardContent>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Nama"
                htmlFor="consulting-name"
                error={errors.name}
              >
                <Input
                  id="consulting-name"
                  value={value.name}
                  autoComplete="name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  onChange={(event) =>
                    updateValue({ name: event.target.value })
                  }
                />
              </FormField>

              <FormField
                label="Email"
                htmlFor="consulting-email"
                error={errors.email}
              >
                <Input
                  id="consulting-email"
                  type="email"
                  value={value.email}
                  autoComplete="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  onChange={(event) =>
                    updateValue({ email: event.target.value })
                  }
                />
              </FormField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="WhatsApp"
                htmlFor="consulting-phone"
                error={errors.phone}
              >
                <Input
                  id="consulting-phone"
                  value={value.phone}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+62..."
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  onChange={(event) =>
                    updateValue({ phone: event.target.value })
                  }
                />
              </FormField>

              <FormField
                label="Paket"
                htmlFor="consulting-package"
                error={errors.packageId}
              >
                <Select
                  value={value.packageId}
                  onValueChange={(packageId) => updateValue({ packageId })}
                >
                  <SelectTrigger
                    id="consulting-package"
                    className="w-full"
                    aria-invalid={errors.packageId ? 'true' : 'false'}
                  >
                    <SelectValue placeholder="Pilih paket" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((consultingPackage) => (
                      <SelectItem
                        key={consultingPackage.id}
                        value={consultingPackage.id}
                      >
                        {consultingPackage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField
              label="Kartu yang sekarang dipakai"
              htmlFor="consulting-current-cards"
              error={errors.currentCards}
            >
              <Textarea
                id="consulting-current-cards"
                value={value.currentCards}
                placeholder="Contoh: BCA KrisFlyer, Citi PremierMiles, Mandiri World Elite"
                aria-invalid={errors.currentCards ? 'true' : 'false'}
                onChange={(event) =>
                  updateValue({ currentCards: event.target.value })
                }
              />
            </FormField>

            <FormField
              label="Kebutuhan utama"
              htmlFor="consulting-needs"
              error={errors.needs}
            >
              <Textarea
                id="consulting-needs"
                value={value.needs}
                className="min-h-32"
                placeholder="Ceritakan target trip, rute, budget annual fee, atau keputusan transfer poin yang sedang dipertimbangkan."
                aria-invalid={errors.needs ? 'true' : 'false'}
                onChange={(event) => updateValue({ needs: event.target.value })}
              />
            </FormField>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Data ini akan dipakai untuk menyiapkan scope konsultasi yang
                relevan.
              </p>
              <Button type="submit" size="lg">
                Validasi inquiry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps): ReactElement {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
