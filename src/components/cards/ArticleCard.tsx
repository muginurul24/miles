import { Link } from '@tanstack/react-router'
import { ArticleBadges } from '#/components/content/ArticleBadges'
import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleCardProps {
  article: Article
  className?: string
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatPublishedDate(article: Article): string {
  const date = article.publishedAt ?? article.createdAt
  return dateFormatter.format(date)
}

export function ArticleCard({
  article,
  className,
}: ArticleCardProps): ReactElement {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.id }}
      className="group block h-full no-underline"
    >
      <Card
        className={cn(
          'h-full overflow-hidden border-border bg-card py-0 shadow-xs transition duration-200 group-hover:-translate-y-0.5 group-hover:border-accent/45',
          className,
        )}
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div
            className="aspect-[16/9] w-full bg-secondary"
            aria-hidden="true"
          />
        )}
        <CardContent className="grid gap-3 p-4 sm:p-5">
          <ArticleBadges article={article} />

          <div className="grid gap-2">
            <h3 className="font-display text-lg leading-6 font-bold text-primary group-hover:text-accent">
              {article.title}
            </h3>
            {article.excerpt ? (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {article.excerpt}
              </p>
            ) : null}
          </div>

          <p className="text-xs font-medium text-muted-foreground">
            {formatPublishedDate(article)}
            {article.author ? ` · ${article.author}` : ''}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
