import { prisma } from '#/db'

import type { Article, Prisma } from '#/generated/prisma/client'

export interface ArticleFilters {
  category?: string
  subCategory?: string
  limit?: number
  offset?: number
}

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

export const articlesRepo = {
  async findAll(filters: ArticleFilters = {}): Promise<Article[]> {
    return prisma.article.findMany({
      where: buildArticleWhere(filters),
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: normalizeLimit(filters.limit, 20),
      skip: filters.offset ?? 0,
    })
  },

  async findBySlug(slug: string): Promise<Article | null> {
    return prisma.article.findUnique({
      where: { id: slug },
    })
  },

  async findRelated(
    slug: string,
    category: string,
    limit = 3,
  ): Promise<Article[]> {
    return prisma.article.findMany({
      where: {
        category,
        id: { not: slug },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: normalizeLimit(limit, 3),
    })
  },

  async getLatest(limit = 3): Promise<Article[]> {
    return prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: normalizeLimit(limit, 3),
    })
  },
}
