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

interface ApplicationTrendGroup {
  date: Date | string
  applications: number
}

interface ArticleCategoryGroup {
  category: string
  _count: {
    _all: number
  }
}

interface MembershipTierGroup {
  membershipTier: string
  _count: {
    _all: number
  }
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
      applicationTrendGroups,
      articleCategoryGroups,
      membershipTierGroups,
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
      prisma.$queryRaw<ApplicationTrendGroup[]>`
        SELECT
          date_trunc('day', created_at)::date AS date,
          COUNT(*)::integer AS applications
        FROM card_applications
        WHERE created_at >= ${since}
        GROUP BY 1
        ORDER BY 1 ASC
      `,
      prisma.article.groupBy({
        by: ['category'],
        _count: {
          _all: true,
        },
      }),
      prisma.user.groupBy({
        by: ['membershipTier'],
        _count: {
          _all: true,
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
      applicationTrend: buildApplicationTrend(applicationTrendGroups),
      articleCategories: buildArticleCategories(articleCategoryGroups),
      membershipDistribution: buildMembershipDistribution(membershipTierGroups),
    }
  },
}

function buildApplicationTrend(
  groups: ApplicationTrendGroup[],
): AdminApplicationTrendPoint[] {
  const buckets = new Map<string, number>()

  for (let index = APPLICATION_TREND_DAYS - 1; index >= 0; index -= 1) {
    buckets.set(toDateKey(daysAgo(index)), 0)
  }

  for (const group of groups) {
    const key =
      group.date instanceof Date
        ? toDateKey(group.date)
        : group.date.slice(0, 10)
    buckets.set(key, group.applications)
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
  groups: ArticleCategoryGroup[],
): AdminArticleCategoryPoint[] {
  return groups
    .map((group) => ({
      category: group.category,
      articles: group._count._all,
    }))
    .sort((first, second) => {
      const countDelta = second.articles - first.articles
      return countDelta === 0
        ? first.category.localeCompare(second.category)
        : countDelta
    })
}

function buildMembershipDistribution(
  groups: MembershipTierGroup[],
): AdminMembershipDistributionPoint[] {
  return groups
    .map((group) => ({
      tier: group.membershipTier,
      users: group._count._all,
    }))
    .sort((first, second) => {
      const countDelta = second.users - first.users
      return countDelta === 0
        ? first.tier.localeCompare(second.tier)
        : countDelta
    })
}
