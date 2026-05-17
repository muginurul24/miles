import { Badge } from '#/components/shared'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

import type { CardWithRelations } from '#/server/repositories/cards.repo'
import type { ReactElement } from 'react'

export interface TransferPartnerTableProps {
  card: CardWithRelations
}

const POINT_SAMPLE = 10_000
const numberFormatter = new Intl.NumberFormat('id-ID')

export function TransferPartnerTable({
  card,
}: TransferPartnerTableProps): ReactElement {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 grid gap-2">
        <h2 className="font-display text-2xl font-bold text-primary">
          Transfer Partner
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Program airline yang tersedia dan estimasi miles dari 10.000 poin.
        </p>
      </div>

      <Table>
        <TableCaption>
          Conversion ratio ditulis sebagai poin kartu : miles airline.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            <TableHead className="text-center">Conversion Ratio</TableHead>
            <TableHead className="text-right">Miles dari 10.000 Poin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {card.transferPartners.map((partner) => {
            const miles = Math.floor(
              (POINT_SAMPLE * partner.milesReceived) / partner.pointsRequired,
            )

            return (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.program}</TableCell>
                <TableCell className="text-center">
                  <Badge tone="accent">
                    {partner.pointsRequired}:{partner.milesReceived}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-primary">
                  {numberFormatter.format(miles)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}
