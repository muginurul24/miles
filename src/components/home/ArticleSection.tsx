import { ArticleCard } from '#/components/cards/ArticleCard'
import { EmptyState } from '#/components/shared'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleSectionProps {
  eyebrow: string
  title: string
  description: string
  articles: Article[]
}

export function ArticleSection({
  eyebrow,
  title,
  description,
  articles,
}: ArticleSectionProps): ReactElement {
  return (
    <section className="page-wrap py-10 md:py-14">
      <div className="mb-6 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="No articles"
          title="Artikel belum tersedia"
          description="Belum ada artikel untuk ditampilkan."
        />
      )}
    </section>
  )
}
