import { prisma } from '#/db'

import type { SitemapEntry } from '#/lib/seo'

export const seoRepo = {
  async getSitemapEntries(): Promise<SitemapEntry[]> {
    const [cards, articles] = await Promise.all([
      prisma.creditCard.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { id: true, updatedAt: true },
      }),
      prisma.article.findMany({
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        select: { id: true, publishedAt: true, updatedAt: true },
      }),
    ])

    return [
      ...cards.map((card) => ({
        path: `/credit-cards/${card.id}`,
        lastModified: card.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...articles.map((article) => ({
        path: `/articles/${article.id}`,
        lastModified: article.publishedAt ?? article.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  },
}
