import { Breadcrumb } from '#/components/shared'

import type { BreadcrumbEntry } from '#/components/shared'
import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleBreadcrumbProps {
  article: Article
}

function getArticleParentEntry(article: Article): BreadcrumbEntry {
  if (article.category === 'News') {
    return { label: 'News', to: '/news' }
  }

  if (article.category === 'Guide') {
    return { label: 'Guides', to: '/guides' }
  }

  if (article.category === 'Deal') {
    return { label: 'Deals', to: '/deals' }
  }

  if (article.category === 'Review' && article.subCategory) {
    const label = `${article.subCategory.charAt(0).toUpperCase()}${article.subCategory.slice(1)} Reviews`

    return {
      label,
      href: `/reviews/${article.subCategory}`,
    }
  }

  return { label: article.category }
}

export function ArticleBreadcrumb({
  article,
}: ArticleBreadcrumbProps): ReactElement {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', to: '/' },
        getArticleParentEntry(article),
        { label: article.title },
      ]}
    />
  )
}
