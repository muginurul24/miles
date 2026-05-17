import { CalendarDays, Clock3, UserRound } from 'lucide-react'
import { ArticleBadges } from '#/components/content/ArticleBadges'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleDetailHeroProps {
  article: Article
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatPublishedDate(article: Article): string {
  return dateFormatter.format(article.publishedAt ?? article.createdAt)
}

function calculateReadingMinutes(article: Article): number {
  const content = `${article.title} ${article.excerpt ?? ''} ${article.content ?? ''}`
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(wordCount / 180))
}

export function ArticleDetailHero({
  article,
}: ArticleDetailHeroProps): ReactElement {
  return (
    <header className="grid gap-7">
      <div className="grid gap-5">
        <ArticleBadges article={article} />

        <div className="max-w-4xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {article.excerpt}
            </p>
          ) : null}
        </div>

        <dl className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <ArticleMetaItem
            icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
            label="Author"
            value={article.author ?? 'JustMiles Editorial'}
          />
          <ArticleMetaItem
            icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
            label="Published"
            value={formatPublishedDate(article)}
          />
          <ArticleMetaItem
            icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}
            label="Reading time"
            value={`${calculateReadingMinutes(article)} menit baca`}
          />
        </dl>
      </div>

      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          width={1200}
          height={675}
          className="aspect-[16/9] w-full rounded-3xl border border-border object-cover shadow-xs"
          decoding="async"
          fetchPriority="high"
          loading="eager"
          sizes="(min-width: 1024px) 896px, 100vw"
        />
      ) : (
        <div
          className="aspect-[16/9] w-full rounded-3xl border border-border bg-secondary"
          aria-hidden="true"
        />
      )}
    </header>
  )
}

interface ArticleMetaItemProps {
  icon: ReactElement
  label: string
  value: string
}

function ArticleMetaItem({
  icon,
  label,
  value,
}: ArticleMetaItemProps): ReactElement {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-card-foreground">
      {icon}
      <dt className="sr-only">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
