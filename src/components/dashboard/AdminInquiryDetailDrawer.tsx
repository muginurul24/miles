import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '#/components/ui/drawer'
import { Separator } from '#/components/ui/separator'

import type { AdminInquiryRow } from '#/server/repositories/admin-inquiries.repo'
import type { ReactElement } from 'react'

interface AdminInquiryDetailDrawerProps {
  inquiry: AdminInquiryRow | null
  onOpenChange: (open: boolean) => void
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function AdminInquiryDetailDrawer({
  inquiry,
  onOpenChange,
}: AdminInquiryDetailDrawerProps): ReactElement {
  return (
    <Drawer open={inquiry !== null} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-display text-2xl text-primary">
              {inquiry?.name ?? 'Inquiry detail'}
            </DrawerTitle>
          </DrawerHeader>
          {inquiry ? (
            <div className="grid gap-4 px-4 pb-6">
              <DetailRow label="Email" value={inquiry.email} />
              <DetailRow label="Phone" value={inquiry.phone ?? '—'} />
              <DetailRow
                label="Package"
                value={inquiry.package?.name ?? 'Paket belum dipilih'}
              />
              <DetailRow label="Status" value={inquiry.status} />
              <DetailRow
                label="Created"
                value={dateFormatter.format(new Date(inquiry.createdAt))}
              />
              <Separator />
              <DetailBlock label="Current cards" value={inquiry.currentCards} />
              <DetailBlock label="Needs" value={inquiry.needs} />
            </div>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface DetailRowProps {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps): ReactElement {
  return (
    <div className="grid gap-1 rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}

interface DetailBlockProps {
  label: string
  value: string | null
}

function DetailBlock({ label, value }: DetailBlockProps): ReactElement {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-foreground">
        {value ?? '—'}
      </p>
    </div>
  )
}
