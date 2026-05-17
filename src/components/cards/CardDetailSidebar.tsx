'use client'

import { useMutation } from '@tanstack/react-query'
import { Calculator, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { RatingBadge } from '#/components/shared'
import { showErrorToast, showToast } from '#/components/Toast'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useTRPC } from '#/integrations/trpc/react'
import { calculateMiles, getRating } from '#/lib/calculator'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ChangeEvent, ReactElement } from 'react'

export interface CardDetailSidebarProps {
  card: CardWithRelations
}

const DEFAULT_AMOUNT = 10_000_000

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
})

const transactionOptions = [
  { value: 'local', label: 'Transaksi Lokal' },
  { value: 'overseas', label: 'Transaksi Overseas' },
  { value: 'dining', label: 'Dining & Restoran' },
  { value: 'online', label: 'Online & E-Commerce' },
  { value: 'travel', label: 'Travel & Penerbangan' },
] as const

type TransactionType = (typeof transactionOptions)[number]['value']

function formatIdr(value: number): string {
  return `Rp${numberFormatter.format(value)}`
}

function getInitialTransactionType(card: CardWithRelations): TransactionType {
  return (
    transactionOptions.find((option) =>
      card.earningRates.some((rate) => rate.transactionType === option.value),
    )?.value ?? 'local'
  )
}

function isTransactionType(value: string): value is TransactionType {
  return transactionOptions.some((option) => option.value === value)
}

export function CardDetailSidebar({
  card,
}: CardDetailSidebarProps): ReactElement {
  const trpc = useTRPC()
  const [transactionType, setTransactionType] = useState<TransactionType>(
    getInitialTransactionType(card),
  )
  const [partnerProgram, setPartnerProgram] = useState(
    card.transferPartners[0]?.program ?? '',
  )
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)

  const earningRate = card.earningRates.find(
    (rate) => rate.transactionType === transactionType,
  )
  const transferPartner = card.transferPartners.find(
    (partner) => partner.program === partnerProgram,
  )
  const calculation =
    earningRate && transferPartner
      ? calculateMiles({
          amount,
          spendPerPoint: earningRate.spendPerPoint,
          pointsEarned: earningRate.pointsEarned,
          pointsRequired: transferPartner.pointsRequired,
          milesReceived: transferPartner.milesReceived,
        })
      : null
  const rating =
    calculation?.idrPerMile === null || calculation?.idrPerMile === undefined
      ? null
      : getRating(calculation.idrPerMile)
  const recordApplication = useMutation(
    trpc.cards.recordApplication.mutationOptions({
      onSuccess: () => {
        showToast('Minat pengajuan kartu tercatat.')
      },
      onError: () => {
        showErrorToast('Minat pengajuan gagal dicatat. Coba lagi nanti.')
      },
    }),
  )

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    setAmount(Number(event.target.value))
  }

  function handleApplyClick(): void {
    recordApplication.mutate({ cardId: card.id })
  }

  return (
    <aside className="grid gap-4 lg:sticky lg:top-24">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl text-primary">
            <Calculator className="h-5 w-5 text-accent" aria-hidden="true" />
            Hitung Miles
          </CardTitle>
          <CardDescription>
            Simulasi cepat untuk kartu ini berdasarkan nominal spending kamu.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="card-detail-transaction">Jenis Transaksi</Label>
            <Select
              value={transactionType}
              onValueChange={(value) => {
                if (isTransactionType(value)) {
                  setTransactionType(value)
                }
              }}
            >
              <SelectTrigger id="card-detail-transaction" className="w-full">
                <SelectValue placeholder="Pilih transaksi" />
              </SelectTrigger>
              <SelectContent>
                {transactionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="card-detail-partner">Partner Miles</Label>
            <Select value={partnerProgram} onValueChange={setPartnerProgram}>
              <SelectTrigger id="card-detail-partner" className="w-full">
                <SelectValue placeholder="Pilih partner" />
              </SelectTrigger>
              <SelectContent>
                {card.transferPartners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.program}>
                    {partner.program} ({partner.pointsRequired}:
                    {partner.milesReceived})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="card-detail-amount">Nominal Transaksi</Label>
            <Input
              id="card-detail-amount"
              type="number"
              min={0}
              step={10_000}
              value={amount}
              onChange={handleAmountChange}
            />
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-primary">Hasil</p>
              {rating ? <RatingBadge rating={rating} /> : null}
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Poin</dt>
                <dd className="font-mono font-semibold text-primary">
                  {calculation
                    ? numberFormatter.format(calculation.points)
                    : '-'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Miles</dt>
                <dd className="font-mono font-semibold text-primary">
                  {calculation
                    ? numberFormatter.format(calculation.miles)
                    : '-'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">IDR/Mile</dt>
                <dd className="font-mono font-semibold text-primary">
                  {calculation?.idrPerMile
                    ? formatIdr(calculation.idrPerMile)
                    : '-'}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/30 bg-accent text-accent-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Tertarik dengan kartu ini?
          </CardTitle>
          <CardDescription className="text-accent-foreground/75">
            Cek persyaratan dan ajukan saat kanal partner sudah tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={recordApplication.isPending}
            onClick={handleApplyClick}
          >
            {recordApplication.isPending ? 'Mencatat...' : 'Ajukan Kartu Ini'}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Button>
          <p className="text-xs leading-5 text-accent-foreground/60">
            Disclosure: JustMiles dapat menerima komisi jika kamu mendaftar
            melalui link partner.
          </p>
        </CardContent>
      </Card>
    </aside>
  )
}
