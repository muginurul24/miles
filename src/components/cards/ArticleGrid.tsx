import { ArticleCard } from '#/components/cards/ArticleCard'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleGridProps {
  articles: Article[]
  emptyMessage?: string
}

export function ArticleGrid({
  articles,
  emptyMessage = 'Belum ada artikel untuk ditampilkan.',
}: ArticleGridProps): ReactElement {
  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
        {emptyMessage}
      </p>
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
