import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  BenefitsCell,
  SortableHeader,
} from '#/components/dashboard/AdminCardsTableCells'
import { Badge, EmptyState } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

import type { AdminCardRow } from '#/server/repositories/admin.repo'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { ReactElement } from 'react'

interface AdminCardsTableProps {
  cards: AdminCardRow[]
  isDeleting: boolean
  onEdit: (card: AdminCardRow) => void
  onDelete: (id: string) => void
}

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function AdminCardsTable({
  cards,
  isDeleting,
  onEdit,
  onDelete,
}: AdminCardsTableProps): ReactElement {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'bank', desc: false },
  ])
  const columns = useMemo(
    () => getColumns({ isDeleting, onEdit, onDelete }),
    [isDeleting, onDelete, onEdit],
  )
  const table = useReactTable({
    data: cards,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="island-kicker">Cards inventory</p>
            <CardTitle className="font-display text-2xl text-primary">
              Kelola kartu kredit
            </CardTitle>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={globalFilter}
              aria-label="Cari kartu"
              placeholder="Cari bank, kartu, tier..."
              className="pl-9"
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40">
                    <EmptyState
                      compact
                      eyebrow="No cards"
                      title="Tidak ada kartu"
                      description="Tidak ada kartu yang cocok dengan filter."
                      className="border-0 bg-transparent shadow-none"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} kartu ditemukan
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ColumnOptions {
  isDeleting: boolean
  onEdit: (card: AdminCardRow) => void
  onDelete: (id: string) => void
}

function getColumns(options: ColumnOptions): ColumnDef<AdminCardRow>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader
          label="Kartu"
          onClick={column.getToggleSortingHandler()}
        />
      ),
      cell: ({ row }) => (
        <div className="min-w-56">
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'bank',
      header: ({ column }) => (
        <SortableHeader
          label="Bank"
          onClick={column.getToggleSortingHandler()}
        />
      ),
      cell: ({ row }) => <Badge tone="accent">{row.original.bank}</Badge>,
    },
    {
      accessorKey: 'tier',
      header: 'Tier',
      cell: ({ row }) => (
        <div className="min-w-36 text-sm text-muted-foreground">
          {row.original.network} · {row.original.tier}
        </div>
      ),
    },
    {
      accessorKey: 'annualFee',
      header: ({ column }) => (
        <SortableHeader
          label="Annual fee"
          onClick={column.getToggleSortingHandler()}
        />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm text-foreground">
          {idrFormatter.format(row.original.annualFee)}
        </span>
      ),
    },
    {
      id: 'relations',
      header: 'Data',
      cell: ({ row }) => (
        <div className="flex min-w-40 flex-wrap gap-1">
          <Badge tone="neutral">{row.original.earningRatesCount} rates</Badge>
          <Badge tone="neutral">
            {row.original.transferPartnersCount} partners
          </Badge>
        </div>
      ),
    },
    {
      id: 'benefits',
      header: 'Benefits',
      cell: ({ row }) => <BenefitsCell card={row.original} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => options.onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={options.isDeleting}
            onClick={() => options.onDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      ),
    },
  ]
}
