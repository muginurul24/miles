import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { showErrorToast, showToast } from '#/components/Toast'
import { AdminCardForm } from '#/components/dashboard/AdminCardForm'
import { AdminCardsTable } from '#/components/dashboard/AdminCardsTable'
import { useTRPC } from '#/integrations/trpc/react'

import type {
  AdminCardCreateInput,
  AdminCardUpdateInput,
} from '#/lib/schemas/admin-card'
import type { AdminCardRow } from '#/server/repositories/admin.repo'
import type { ReactElement } from 'react'

interface AdminCardsManagerProps {
  initialCards: AdminCardRow[]
}

export function AdminCardsManager({
  initialCards,
}: AdminCardsManagerProps): ReactElement {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const cardsQueryOptions = trpc.admin.cards.queryOptions()
  const [editingCard, setEditingCard] = useState<AdminCardRow | null>(null)
  const cardsQuery = useQuery({
    ...cardsQueryOptions,
    initialData: initialCards,
  })

  async function refreshCards(): Promise<void> {
    await queryClient.invalidateQueries({
      queryKey: cardsQueryOptions.queryKey,
    })
  }

  const createCard = useMutation(
    trpc.admin.createCard.mutationOptions({
      onSuccess: async () => {
        showToast('Kartu baru berhasil dibuat.')
        setEditingCard(null)
        await refreshCards()
      },
      onError: (error) => {
        showErrorToast(error.message)
      },
    }),
  )

  const updateCard = useMutation(
    trpc.admin.updateCard.mutationOptions({
      onSuccess: async () => {
        showToast('Kartu berhasil diperbarui.')
        setEditingCard(null)
        await refreshCards()
      },
      onError: (error) => {
        showErrorToast(error.message)
      },
    }),
  )

  const deleteCard = useMutation(
    trpc.admin.deleteCard.mutationOptions({
      onSuccess: async () => {
        showToast('Kartu berhasil dihapus.')
        await refreshCards()
      },
      onError: (error) => {
        showErrorToast(error.message)
      },
    }),
  )

  function handleSubmit(
    value: AdminCardCreateInput | AdminCardUpdateInput,
  ): void {
    if (editingCard) {
      updateCard.mutate(value)
      return
    }

    createCard.mutate(value)
  }

  function handleDelete(id: string): void {
    const confirmed = window.confirm(
      'Hapus kartu ini? Earning rates, transfer partners, pros, dan cons terkait ikut terhapus.',
    )

    if (!confirmed) {
      return
    }

    deleteCard.mutate({ id })
  }

  return (
    <section className="grid gap-5">
      <AdminCardForm
        editingCard={editingCard}
        isPending={createCard.isPending || updateCard.isPending}
        onCancelEdit={() => setEditingCard(null)}
        onSubmit={handleSubmit}
      />
      <AdminCardsTable
        cards={cardsQuery.data}
        isDeleting={deleteCard.isPending}
        onEdit={setEditingCard}
        onDelete={handleDelete}
      />
    </section>
  )
}
