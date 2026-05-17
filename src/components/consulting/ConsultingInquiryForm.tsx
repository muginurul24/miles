import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { showErrorToast, showToast } from '#/components/Toast'
import { ConsultingFormField } from '#/components/consulting/ConsultingFormField'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { useTRPC } from '#/integrations/trpc/react'
import { getFieldErrorId } from '#/lib/accessibility'
import { consultingInquiryInputSchema } from '#/lib/schemas/consulting'

import type { ConsultingPackageView } from '#/server/repositories/consulting.repo'
import type { FormEvent, ReactElement } from 'react'
import type { ZodIssue } from 'zod'

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

function getValidationErrors(issues: ZodIssue[]): ConsultingInquiryErrors {
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
  const trpc = useTRPC()
  const [value, setValue] = useState<ConsultingInquiryFormValue>(initialValue)
  const [errors, setErrors] = useState<ConsultingInquiryErrors>({})
  const submitInquiry = useMutation(
    trpc.consulting.submitInquiry.mutationOptions({
      onSuccess: () => {
        setErrors({})
        setValue(initialValue)
        showToast('Inquiry terkirim. Tim JustMiles akan meninjau detailnya.')
      },
      onError: () => {
        showErrorToast('Inquiry gagal dikirim. Coba lagi beberapa saat lagi.')
      },
    }),
  )

  function updateValue(nextValue: Partial<ConsultingInquiryFormValue>): void {
    setValue((currentValue) => ({ ...currentValue, ...nextValue }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const parsed = consultingInquiryInputSchema.safeParse(value)
    if (!parsed.success) {
      setErrors(getValidationErrors(parsed.error.issues))
      return
    }

    submitInquiry.mutate(parsed.data)
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
              <ConsultingFormField
                label="Nama"
                htmlFor="consulting-name"
                error={errors.name}
              >
                <Input
                  id="consulting-name"
                  value={value.name}
                  autoComplete="name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={
                    errors.name ? getFieldErrorId('consulting-name') : undefined
                  }
                  onChange={(event) =>
                    updateValue({ name: event.target.value })
                  }
                />
              </ConsultingFormField>

              <ConsultingFormField
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
                  aria-describedby={
                    errors.email
                      ? getFieldErrorId('consulting-email')
                      : undefined
                  }
                  onChange={(event) =>
                    updateValue({ email: event.target.value })
                  }
                />
              </ConsultingFormField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ConsultingFormField
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
                  aria-describedby={
                    errors.phone
                      ? getFieldErrorId('consulting-phone')
                      : undefined
                  }
                  onChange={(event) =>
                    updateValue({ phone: event.target.value })
                  }
                />
              </ConsultingFormField>

              <ConsultingFormField
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
                    aria-describedby={
                      errors.packageId
                        ? getFieldErrorId('consulting-package')
                        : undefined
                    }
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
              </ConsultingFormField>
            </div>

            <ConsultingFormField
              label="Kartu yang sekarang dipakai"
              htmlFor="consulting-current-cards"
              error={errors.currentCards}
            >
              <Textarea
                id="consulting-current-cards"
                value={value.currentCards}
                placeholder="Contoh: BCA KrisFlyer, Citi PremierMiles, Mandiri World Elite"
                aria-invalid={errors.currentCards ? 'true' : 'false'}
                aria-describedby={
                  errors.currentCards
                    ? getFieldErrorId('consulting-current-cards')
                    : undefined
                }
                onChange={(event) =>
                  updateValue({ currentCards: event.target.value })
                }
              />
            </ConsultingFormField>

            <ConsultingFormField
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
                aria-describedby={
                  errors.needs ? getFieldErrorId('consulting-needs') : undefined
                }
                onChange={(event) => updateValue({ needs: event.target.value })}
              />
            </ConsultingFormField>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                Data ini akan dipakai untuk menyiapkan scope konsultasi yang
                relevan.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={submitInquiry.isPending}
              >
                {submitInquiry.isPending ? 'Mengirim...' : 'Kirim inquiry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
