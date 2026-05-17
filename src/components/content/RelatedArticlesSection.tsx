import { ArticleGrid } from '#/components/cards/ArticleGrid'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface RelatedArticlesSectionProps {
  articles: Article[]
}

export function RelatedArticlesSection({
  articles,
}: RelatedArticlesSectionProps): ReactElement | null {
  if (articles.length === 0) {
    return null
  }

  return (
    <section className="grid gap-5 border-t border-border pt-8">
      <div>
        <p className="island-kicker">Related reads</p>
        <h2 className="font-display text-2xl font-bold text-primary">
          Lanjut baca topik sejenis
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Artikel terkait ini dipilih dari kategori yang sama agar konteks
          strategi points dan miles tetap nyambung.
        </p>
      </div>

      <ArticleGrid
        articles={articles}
        emptyMessage="Belum ada artikel terkait."
      />
    </section>
  )
}
