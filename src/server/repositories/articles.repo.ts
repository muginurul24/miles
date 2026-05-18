import { prisma } from '#/db'
import { DEFAULT_TTL, cached } from '#/lib/cache'

import type { Article, Prisma } from '#/generated/prisma/client'

export interface ArticleFilters {
  category?: string
  subCategory?: string
  limit?: number
  offset?: number
}

const articlePreviewSelect = {
  id: true,
  title: true,
  excerpt: true,
  category: true,
  subCategory: true,
  author: true,
  imageUrl: true,
  premium: true,
  dealTag: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ArticleSelect

type ArticlePreviewRecord = Prisma.ArticleGetPayload<{
  select: typeof articlePreviewSelect
}>

function buildArticleWhere(filters: ArticleFilters): Prisma.ArticleWhereInput {
  return {
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.subCategory ? { subCategory: filters.subCategory } : {}),
  }
}

function normalizeLimit(limit: number | undefined, fallback: number): number {
  if (!limit || limit < 1) {
    return fallback
  }

  return Math.min(limit, 50)
}

function withEmptyArticleContent(article: ArticlePreviewRecord): Article {
  return { ...article, content: null }
}

export const articlesRepo = {
  async findAll(filters: ArticleFilters = {}): Promise<Article[]> {
    const limit = normalizeLimit(filters.limit, 20)
    const offset = filters.offset ?? 0
    const category = filters.category ?? 'all'
    const subCategory = filters.subCategory ?? 'all'

    return cached(
      `articles:list:${category}:${subCategory}:${offset}:${limit}`,
      DEFAULT_TTL.ARTICLES_LIST,
      async () => {
        const articles = await prisma.article.findMany({
          where: buildArticleWhere(filters),
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          take: limit,
          skip: offset,
          select: articlePreviewSelect,
        })

        return articles.map(withEmptyArticleContent)
      },
    )
  },

  async findBySlug(slug: string): Promise<Article | null> {
    return cached(`articles:detail:${slug}`, DEFAULT_TTL.ARTICLE_DETAIL, () =>
      prisma.article.findUnique({
        where: { id: slug },
      }),
    )
  },

  async findRelated(
    slug: string,
    category: string,
    limit = 3,
  ): Promise<Article[]> {
    const normalizedLimit = normalizeLimit(limit, 3)

    return cached(
      `articles:list:${category}:related:${slug}:${normalizedLimit}`,
      DEFAULT_TTL.ARTICLES_LIST,
      async () => {
        const articles = await prisma.article.findMany({
          where: {
            category,
            id: { not: slug },
          },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          take: normalizedLimit,
          select: articlePreviewSelect,
        })

        return articles.map(withEmptyArticleContent)
      },
    )
  },

  async getLatest(limit = 3): Promise<Article[]> {
    const normalizedLimit = normalizeLimit(limit, 3)

    return cached(
      `articles:list:latest:${normalizedLimit}`,
      DEFAULT_TTL.ARTICLES_LIST,
      async () => {
        const articles = await prisma.article.findMany({
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          take: normalizedLimit,
          select: articlePreviewSelect,
        })

        return articles.map(withEmptyArticleContent)
      },
    )
  },
}
