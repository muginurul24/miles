import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Download, Search } from 'lucide-react'
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

import type { AdminSubscriberRow } from '#/server/repositories/admin-subscribers.repo'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { ReactElement } from 'react'

interface AdminSubscribersTableProps {
  subscribers: AdminSubscriberRow[]
  onExportCsv: (subscribers: AdminSubscriberRow[]) => void
}

type SubscriberFilter = 'all' | 'active' | 'unsubscribed'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function AdminSubscribersTable({
  subscribers,
  onExportCsv,
}: AdminSubscribersTableProps): ReactElement {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubscriberFilter>('all')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'subscribedAt', desc: true },
  ])
  const filteredSubscribers = useMemo(
    () => filterSubscribers(subscribers, statusFilter),
    [subscribers, statusFilter],
  )
  const columns = useMemo(() => getColumns(), [])
  const table = useReactTable({
    data: filteredSubscribers,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const exportRows = table.getFilteredRowModel().rows.map((row) => row.original)

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="island-kicker">Audience ops</p>
            <CardTitle className="font-display text-2xl text-primary">
              Kelola subscribers
            </CardTitle>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={globalFilter}
                aria-label="Cari subscriber"
                placeholder="Cari email..."
                className="pl-9"
                onChange={(event) => setGlobalFilter(event.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as SubscriberFilter)
              }
            >
              <SelectTrigger aria-label="Filter status subscriber">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={() => onExportCsv(exportRows)}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </Button>
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
                      eyebrow="No subscribers"
                      title="Tidak ada subscriber"
                      description="Tidak ada subscriber yang cocok dengan filter."
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

function getColumns(): ColumnDef<AdminSubscriberRow>[] {
  return [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="min-w-64 font-medium text-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge tone={row.original.unsubscribedAt ? 'neutral' : 'success'}>
          {row.original.unsubscribedAt ? 'Unsubscribed' : 'Active'}
        </Badge>
      ),
    },
    {
      accessorKey: 'subscribedAt',
      header: 'Subscribed',
      cell: ({ row }) => (
        <span className="min-w-40 text-sm text-muted-foreground">
          {dateFormatter.format(new Date(row.original.subscribedAt))}
        </span>
      ),
    },
    {
      accessorKey: 'unsubscribedAt',
      header: 'Unsubscribed',
      cell: ({ row }) => (
        <span className="min-w-40 text-sm text-muted-foreground">
          {row.original.unsubscribedAt
            ? dateFormatter.format(new Date(row.original.unsubscribedAt))
            : '—'}
        </span>
      ),
    },
  ]
}

function filterSubscribers(
  subscribers: AdminSubscriberRow[],
  statusFilter: SubscriberFilter,
): AdminSubscriberRow[] {
  if (statusFilter === 'active') {
    return subscribers.filter((subscriber) => !subscriber.unsubscribedAt)
  }

  if (statusFilter === 'unsubscribed') {
    return subscribers.filter((subscriber) => subscriber.unsubscribedAt)
  }

  return subscribers
}
