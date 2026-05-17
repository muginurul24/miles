import type { Article } from '#/generated/prisma/client'
import type { ReactElement } from 'react'

export interface ArticleBodyProps {
  article: Article
}

export function ArticleBody({ article }: ArticleBodyProps): ReactElement {
  const content = article.content?.trim() || article.excerpt?.trim() || ''
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-p:leading-8">
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
        ))
      ) : (
        <p>Konten artikel belum tersedia.</p>
      )}
    </article>
  )
}
