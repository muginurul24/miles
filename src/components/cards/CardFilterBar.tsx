import { Search, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

import type { CardSort } from '#/server/repositories/cards.repo'
import type { ChangeEvent, ReactElement } from 'react'

export interface CardDirectoryFilters {
  search: string
  bank: string
  partner: string
  sort: CardSort
}

export interface CardFilterBarProps {
  banks: string[]
  partners: string[]
  filters: CardDirectoryFilters
  onFiltersChange: (filters: CardDirectoryFilters) => void
}

const sortOptions = [
  { value: 'name', label: 'Nama' },
  { value: 'fee_asc', label: 'Annual fee rendah' },
  { value: 'fee_desc', label: 'Annual fee tinggi' },
  { value: 'earning_best', label: 'Earning terbaik' },
] satisfies { value: CardSort; label: string }[]

const ALL_BANKS = 'all-banks'
const ALL_PARTNERS = 'all-partners'

function isCardSort(value: string): value is CardSort {
  return sortOptions.some((option) => option.value === value)
}

export function CardFilterBar({
  banks,
  partners,
  filters,
  onFiltersChange,
}: CardFilterBarProps): ReactElement {
  function updateFilters(nextFilters: Partial<CardDirectoryFilters>): void {
    onFiltersChange({
      ...filters,
      ...nextFilters,
    })
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    updateFilters({ search: event.target.value })
  }

  function handleReset(): void {
    onFiltersChange({
      search: '',
      bank: '',
      partner: '',
      sort: 'name',
    })
  }

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.bank.length > 0 ||
    filters.partner.length > 0 ||
    filters.sort !== 'name'

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,1.2fr)_repeat(3,minmax(0,1fr))_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Cari kartu
          <span className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={filters.search}
              placeholder="Nama, bank, atau tier"
              className="pl-9"
              onChange={handleSearchChange}
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Bank
          <Select
            value={filters.bank || ALL_BANKS}
            onValueChange={(value) =>
              updateFilters({ bank: value === ALL_BANKS ? '' : value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_BANKS}>Semua bank</SelectItem>
              {banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Partner
          <Select
            value={filters.partner || ALL_PARTNERS}
            onValueChange={(value) =>
              updateFilters({ partner: value === ALL_PARTNERS ? '' : value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua partner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PARTNERS}>Semua partner</SelectItem>
              {partners.map((partner) => (
                <SelectItem key={partner} value={partner}>
                  {partner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Urutkan
          <Select
            value={filters.sort}
            onValueChange={(value) => {
              if (isCardSort(value)) {
                updateFilters({ sort: value })
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <Button
          type="button"
          variant="outline"
          className="w-full lg:w-auto"
          disabled={!hasActiveFilters}
          onClick={handleReset}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
      </div>
    </section>
  )
}
