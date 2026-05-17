import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { showErrorToast, showToast } from '#/components/Toast'
import { AdminInquiriesTable } from '#/components/dashboard/AdminInquiriesTable'
import { AdminInquiryDetailDrawer } from '#/components/dashboard/AdminInquiryDetailDrawer'
import { useTRPC } from '#/integrations/trpc/react'

import type { AdminInquiryStatus } from '#/lib/schemas/admin-inquiry'
import type { AdminInquiryRow } from '#/server/repositories/admin-inquiries.repo'
import type { ReactElement } from 'react'

interface AdminInquiriesManagerProps {
  initialInquiries: AdminInquiryRow[]
}

export function AdminInquiriesManager({
  initialInquiries,
}: AdminInquiriesManagerProps): ReactElement {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const inquiriesQueryOptions = trpc.admin.inquiries.queryOptions()
  const [selectedInquiry, setSelectedInquiry] =
    useState<AdminInquiryRow | null>(null)
  const inquiriesQuery = useQuery({
    ...inquiriesQueryOptions,
    initialData: initialInquiries,
  })

  async function refreshInquiries(): Promise<void> {
    await queryClient.invalidateQueries({
      queryKey: inquiriesQueryOptions.queryKey,
    })
  }

  const updateStatus = useMutation(
    trpc.admin.updateInquiryStatus.mutationOptions({
      onSuccess: async (inquiry) => {
        showToast(`Inquiry ${inquiry.name} diperbarui.`)
        await refreshInquiries()
      },
      onError: (error) => showErrorToast(error.message),
    }),
  )

  function handleStatusChange(id: string, status: AdminInquiryStatus): void {
    updateStatus.mutate({ id, status })
  }

  return (
    <section className="grid gap-5">
      <AdminInquiriesTable
        inquiries={inquiriesQuery.data}
        isUpdating={updateStatus.isPending}
        onStatusChange={handleStatusChange}
        onView={setSelectedInquiry}
      />
      <AdminInquiryDetailDrawer
        inquiry={selectedInquiry}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInquiry(null)
          }
        }}
      />
    </section>
  )
}
