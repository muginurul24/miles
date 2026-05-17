import { useQuery } from '@tanstack/react-query'
import { showToast } from '#/components/Toast'
import { AdminSubscribersTable } from '#/components/dashboard/AdminSubscribersTable'
import { useTRPC } from '#/integrations/trpc/react'
import { buildSubscribersCsv } from '#/lib/subscribers-csv'

import type { AdminSubscriberRow } from '#/server/repositories/admin-subscribers.repo'
import type { ReactElement } from 'react'

interface AdminSubscribersManagerProps {
  initialSubscribers: AdminSubscriberRow[]
}

export function AdminSubscribersManager({
  initialSubscribers,
}: AdminSubscribersManagerProps): ReactElement {
  const trpc = useTRPC()
  const subscribersQueryOptions = trpc.admin.subscribers.queryOptions()
  const subscribersQuery = useQuery({
    ...subscribersQueryOptions,
    initialData: initialSubscribers,
  })

  function handleExportCsv(subscribers: AdminSubscriberRow[]): void {
    const csv = buildSubscribersCsv(subscribers)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'justmiles-subscribers.csv'
    anchor.click()
    window.URL.revokeObjectURL(url)
    showToast('CSV subscribers berhasil dibuat.')
  }

  return (
    <section className="grid gap-5">
      <AdminSubscribersTable
        subscribers={subscribersQuery.data}
        onExportCsv={handleExportCsv}
      />
    </section>
  )
}
