import { prisma } from '#/db'

export interface AdminOverviewStats {
  totalCards: number
  totalArticles: number
  activeSubscribers: number
  totalInquiries: number
  newInquiries: number
  premiumArticles: number
  totalApplications: number
}

export interface AdminRecentInquiry {
  id: string
  name: string
  email: string
  status: string
  packageName: string | null
  createdAt: Date
}

export interface AdminApplicationTrendPoint {
  date: string
  applications: number
}

export interface AdminArticleCategoryPoint {
  category: string
  articles: number
}

export interface AdminMembershipDistributionPoint {
  tier: string
  users: number
}

export interface AdminOverview {
  stats: AdminOverviewStats
  recentInquiries: AdminRecentInquiry[]
  applicationTrend: AdminApplicationTrendPoint[]
  articleCategories: AdminArticleCategoryPoint[]
  membershipDistribution: AdminMembershipDistributionPoint[]
}

interface ApplicationRecord {
  createdAt: Date
}

const APPLICATION_TREND_DAYS = 14

export const adminOverviewRepo = {
  async getOverview(): Promise<AdminOverview> {
    const since = getStartOfUtcDay(daysAgo(APPLICATION_TREND_DAYS - 1))
    const [
      totalCards,
      totalArticles,
      activeSubscribers,
      totalInquiries,
      newInquiries,
      premiumArticles,
      totalApplications,
      applicationRecords,
      articleCategories,
      users,
      recentInquiries,
    ] = await Promise.all([
      prisma.creditCard.count(),
      prisma.article.count(),
      prisma.newsletterSubscriber.count({
        where: {
          unsubscribedAt: null,
        },
      }),
      prisma.consultingInquiry.count(),
      prisma.consultingInquiry.count({
        where: {
          status: 'new',
        },
      }),
      prisma.article.count({
        where: {
          premium: true,
        },
      }),
      prisma.cardApplication.count(),
      prisma.cardApplication.findMany({
        where: {
          createdAt: {
            gte: since,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      prisma.article.findMany({
        select: {
          category: true,
        },
      }),
      prisma.user.findMany({
        select: {
          membershipTier: true,
        },
      }),
      prisma.consultingInquiry.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          package: {
            select: {
              name: true,
            },
          },
        },
      }),
    ])

    return {
      stats: {
        totalCards,
        totalArticles,
        activeSubscribers,
        totalInquiries,
        newInquiries,
        premiumArticles,
        totalApplications,
      },
      recentInquiries: recentInquiries.map((inquiry) => ({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        status: inquiry.status,
        packageName: inquiry.package?.name ?? null,
        createdAt: inquiry.createdAt,
      })),
      applicationTrend: buildApplicationTrend(applicationRecords),
      articleCategories: buildArticleCategories(articleCategories),
      membershipDistribution: buildMembershipDistribution(users),
    }
  },
}

function buildApplicationTrend(
  records: ApplicationRecord[],
): AdminApplicationTrendPoint[] {
  const buckets = new Map<string, number>()

  for (let index = APPLICATION_TREND_DAYS - 1; index >= 0; index -= 1) {
    buckets.set(toDateKey(daysAgo(index)), 0)
  }

  for (const record of records) {
    const key = toDateKey(record.createdAt)
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  return [...buckets.entries()].map(([date, applications]) => ({
    date,
    applications,
  }))
}

function daysAgo(days: number): Date {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date
}

function getStartOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
}

function toDateKey(date: Date): string {
  return getStartOfUtcDay(date).toISOString().slice(0, 10)
}

function buildArticleCategories(
  articles: { category: string }[],
): AdminArticleCategoryPoint[] {
  return buildCountMap(articles.map((article) => article.category)).map(
    ([category, articlesCount]) => ({
      category,
      articles: articlesCount,
    }),
  )
}

function buildMembershipDistribution(
  users: { membershipTier: string }[],
): AdminMembershipDistributionPoint[] {
  return buildCountMap(users.map((user) => user.membershipTier)).map(
    ([tier, usersCount]) => ({
      tier,
      users: usersCount,
    }),
  )
}

function buildCountMap(values: string[]): [string, number][] {
  const counts = new Map<string, number>()

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()].sort((first, second) => {
    const countDelta = second[1] - first[1]
    return countDelta === 0 ? first[0].localeCompare(second[0]) : countDelta
  })
}
