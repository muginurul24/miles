import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { showErrorToast, showToast } from '#/components/Toast'
import { AdminArticleForm } from '#/components/dashboard/AdminArticleForm'
import { AdminArticlesTable } from '#/components/dashboard/AdminArticlesTable'
import { useTRPC } from '#/integrations/trpc/react'

import type {
  AdminArticleCreateInput,
  AdminArticleUpdateInput,
} from '#/lib/schemas/admin-article'
import type { AdminArticleRow } from '#/server/repositories/admin.repo'
import type { ReactElement } from 'react'

interface AdminArticlesManagerProps {
  initialArticles: AdminArticleRow[]
}

export function AdminArticlesManager({
  initialArticles,
}: AdminArticlesManagerProps): ReactElement {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const articlesQueryOptions = trpc.admin.articles.queryOptions()
  const [editingArticle, setEditingArticle] = useState<AdminArticleRow | null>(
    null,
  )
  const articlesQuery = useQuery({
    ...articlesQueryOptions,
    initialData: initialArticles,
  })

  async function refreshArticles(): Promise<void> {
    await queryClient.invalidateQueries({
      queryKey: articlesQueryOptions.queryKey,
    })
  }

  const createArticle = useMutation(
    trpc.admin.createArticle.mutationOptions({
      onSuccess: async () => {
        showToast('Artikel baru berhasil dibuat.')
        setEditingArticle(null)
        await refreshArticles()
      },
      onError: (error) => showErrorToast(error.message),
    }),
  )

  const updateArticle = useMutation(
    trpc.admin.updateArticle.mutationOptions({
      onSuccess: async () => {
        showToast('Artikel berhasil diperbarui.')
        setEditingArticle(null)
        await refreshArticles()
      },
      onError: (error) => showErrorToast(error.message),
    }),
  )

  const deleteArticle = useMutation(
    trpc.admin.deleteArticle.mutationOptions({
      onSuccess: async () => {
        showToast('Artikel berhasil dihapus.')
        await refreshArticles()
      },
      onError: (error) => showErrorToast(error.message),
    }),
  )

  function handleSubmit(
    value: AdminArticleCreateInput | AdminArticleUpdateInput,
  ): void {
    if (editingArticle) {
      updateArticle.mutate(value)
      return
    }

    createArticle.mutate(value)
  }

  function handleDelete(id: string): void {
    const confirmed = window.confirm(
      'Hapus artikel ini? Artikel akan hilang dari halaman publik.',
    )

    if (!confirmed) {
      return
    }

    deleteArticle.mutate({ id })
  }

  return (
    <section className="grid gap-5">
      <AdminArticleForm
        editingArticle={editingArticle}
        isPending={createArticle.isPending || updateArticle.isPending}
        onCancelEdit={() => setEditingArticle(null)}
        onSubmit={handleSubmit}
      />
      <AdminArticlesTable
        articles={articlesQuery.data}
        isDeleting={deleteArticle.isPending}
        onEdit={setEditingArticle}
        onDelete={handleDelete}
      />
    </section>
  )
}
