import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDownUp, Pencil, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '#/components/shared'
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

import type { AdminArticleRow } from '#/server/repositories/admin.repo'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { ReactElement } from 'react'

interface AdminArticlesTableProps {
  articles: AdminArticleRow[]
  isDeleting: boolean
  onEdit: (article: AdminArticleRow) => void
  onDelete: (id: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
})

export function AdminArticlesTable({
  articles,
  isDeleting,
  onEdit,
  onDelete,
}: AdminArticlesTableProps): ReactElement {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'publishedAt', desc: true },
  ])
  const columns = useMemo(
    () => getColumns({ isDeleting, onEdit, onDelete }),
    [isDeleting, onDelete, onEdit],
  )
  const table = useReactTable({
    data: articles,
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
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="island-kicker">Content inventory</p>
            <CardTitle className="font-display text-2xl text-primary">
              Kelola artikel
            </CardTitle>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={globalFilter}
              placeholder="Cari judul, kategori, author..."
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
                  <TableCell colSpan={columns.length} className="h-24">
                    <p className="text-center text-sm text-muted-foreground">
                      Tidak ada artikel yang cocok dengan filter.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} artikel ditemukan
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
            <Button
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
  onEdit: (article: AdminArticleRow) => void
  onDelete: (id: string) => void
}

function getColumns(options: ColumnOptions): ColumnDef<AdminArticleRow>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <SortableHeader
          label="Artikel"
          onClick={column.getToggleSortingHandler()}
        />
      ),
      cell: ({ row }) => (
        <div className="min-w-64">
          <p className="font-medium text-foreground">{row.original.title}</p>
          <p className="text-sm text-muted-foreground">{row.original.id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Kategori',
      cell: ({ row }) => (
        <div className="flex min-w-36 flex-wrap gap-1">
          <Badge tone="accent">{row.original.category}</Badge>
          {row.original.subCategory ? (
            <Badge tone="neutral">{row.original.subCategory}</Badge>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'premium',
      header: 'Access',
      cell: ({ row }) => (
        <Badge tone={row.original.premium ? 'warning' : 'success'}>
          {row.original.premium ? 'Premium' : 'Public'}
        </Badge>
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }) => (
        <SortableHeader
          label="Published"
          onClick={column.getToggleSortingHandler()}
        />
      ),
      cell: ({ row }) => (
        <span className="min-w-32 text-sm text-muted-foreground">
          {row.original.publishedAt
            ? dateFormatter.format(new Date(row.original.publishedAt))
            : 'Draft'}
        </span>
      ),
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <span className="min-w-36 text-sm text-muted-foreground">
          {row.original.author ?? '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => options.onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button
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

interface SortableHeaderProps {
  label: string
  onClick: (() => void) | undefined
}

function SortableHeader({ label, onClick }: SortableHeaderProps): ReactElement {
  return (
    <Button type="button" variant="ghost" className="-ml-3" onClick={onClick}>
      {label}
      <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
