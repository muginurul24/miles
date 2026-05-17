import { ArticleCard } from '#/components/cards/ArticleCard'
import { EmptyState } from '#/components/shared'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleGridProps {
  articles: Article[]
  emptyMessage?: string
  emptyTitle?: string
}

export function ArticleGrid({
  articles,
  emptyMessage = 'Belum ada artikel untuk ditampilkan.',
  emptyTitle = 'Artikel belum tersedia',
}: ArticleGridProps): ReactElement {
  if (articles.length === 0) {
    return (
      <EmptyState
        eyebrow="No articles"
        title={emptyTitle}
        description={emptyMessage}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
