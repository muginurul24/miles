import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, EmptyState } from '#/components/shared'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

import type { AdminInquiryStatus } from '#/lib/schemas/admin-inquiry'
import type { AdminInquiryRow } from '#/server/repositories/admin-inquiries.repo'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { ReactElement } from 'react'

interface AdminInquiriesTableProps {
  inquiries: AdminInquiryRow[]
  isUpdating: boolean
  onStatusChange: (id: string, status: AdminInquiryStatus) => void
  onView: (inquiry: AdminInquiryRow) => void
}

type StatusFilter = AdminInquiryStatus | 'all'

const statuses: AdminInquiryStatus[] = [
  'new',
  'contacted',
  'resolved',
  'closed',
]
const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export function AdminInquiriesTable({
  inquiries,
  isUpdating,
  onStatusChange,
  onView,
}: AdminInquiriesTableProps): ReactElement {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const filteredInquiries = useMemo(
    () =>
      statusFilter === 'all'
        ? inquiries
        : inquiries.filter((inquiry) => inquiry.status === statusFilter),
    [inquiries, statusFilter],
  )
  const columns = useMemo(
    () => getColumns({ isUpdating, onStatusChange, onView }),
    [isUpdating, onStatusChange, onView],
  )
  const table = useReactTable({
    data: filteredInquiries,
    columns,
    state: { globalFilter, sorting },
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
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="island-kicker">Consulting pipeline</p>
            <CardTitle className="font-display text-2xl text-primary">
              Kelola inquiries
            </CardTitle>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={globalFilter}
                placeholder="Cari nama, email, paket..."
                className="pl-9"
                onChange={(event) => setGlobalFilter(event.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                      eyebrow="No inquiries"
                      title="Tidak ada inquiry"
                      description="Tidak ada inquiry yang cocok dengan filter."
                      className="border-0 bg-transparent shadow-none"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface ColumnOptions {
  isUpdating: boolean
  onStatusChange: (id: string, status: AdminInquiryStatus) => void
  onView: (inquiry: AdminInquiryRow) => void
}

function getColumns(options: ColumnOptions): ColumnDef<AdminInquiryRow>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="min-w-56">
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      id: 'package',
      header: 'Package',
      cell: ({ row }) => (
        <div className="min-w-48 text-sm text-muted-foreground">
          {row.original.package?.name ?? 'Paket belum dipilih'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex min-w-44 items-center gap-2">
          <Badge tone={getStatusTone(row.original.status)}>
            {row.original.status}
          </Badge>
          <Select
            value={row.original.status}
            disabled={options.isUpdating}
            onValueChange={(value) =>
              options.onStatusChange(
                row.original.id,
                value as AdminInquiryStatus,
              )
            }
          >
            <SelectTrigger className="h-8 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="min-w-32 text-sm text-muted-foreground">
          {dateFormatter.format(new Date(row.original.createdAt))}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => options.onView(row.original)}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Detail
          </Button>
        </div>
      ),
    },
  ]
}

function getStatusTone(status: string): 'neutral' | 'success' | 'warning' {
  if (status === 'new' || status === 'contacted') {
    return 'warning'
  }

  if (status === 'resolved' || status === 'closed') {
    return 'success'
  }

  return 'neutral'
}
