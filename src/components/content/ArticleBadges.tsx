import { LockKeyhole } from 'lucide-react'
import { Badge } from '#/components/shared'

import type { BadgeTone } from '#/components/shared'
import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export type ArticleBadgeData = Pick<Article, 'category' | 'dealTag' | 'premium'>

export interface ArticleBadgesProps {
  article: ArticleBadgeData
}

function getDealTagTone(dealTag: string): BadgeTone {
  if (dealTag === 'HOT') {
    return 'danger'
  }

  if (dealTag === 'SWEET SPOT') {
    return 'success'
  }

  if (dealTag === 'PROMO') {
    return 'info'
  }

  return 'warning'
}

export function ArticleBadges({ article }: ArticleBadgesProps): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="accent">{article.category}</Badge>
      {article.dealTag ? (
        <Badge tone={getDealTagTone(article.dealTag)}>{article.dealTag}</Badge>
      ) : null}
      {article.premium ? (
        <Badge tone="warning" className="inline-flex items-center gap-1">
          <LockKeyhole className="h-3 w-3" aria-hidden="true" />
          Premium
        </Badge>
      ) : null}
    </div>
  )
}
