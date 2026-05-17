import { LockKeyhole } from 'lucide-react'
import { Badge } from '#/components/shared'
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
    <Card
      className={cn(
        'overflow-hidden border-border bg-card py-0 shadow-xs',
        className,
      )}
    >
      <img
        src={article.imageUrl ?? '/images/article-placeholder.jpg'}
        alt=""
        className="aspect-[16/9] w-full object-cover"
      />
      <CardContent className="grid gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{article.category}</Badge>
          {article.premium ? (
            <Badge tone="warning" className="inline-flex items-center gap-1">
              <LockKeyhole className="h-3 w-3" aria-hidden="true" />
              Premium
            </Badge>
          ) : null}
        </div>

        <div className="grid gap-2">
          <h3 className="font-display text-lg leading-6 font-bold text-primary">
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
  )
}
