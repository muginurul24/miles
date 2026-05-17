import { prisma } from '#/db'

export interface AdminOverviewStats {
  totalCards: number
  totalArticles: number
  activeSubscribers: number
  totalInquiries: number
  newInquiries: number
  premiumArticles: number
}

export interface AdminRecentInquiry {
  id: string
  name: string
  email: string
  status: string
  packageName: string | null
  createdAt: Date
}

export interface AdminOverview {
  stats: AdminOverviewStats
  recentInquiries: AdminRecentInquiry[]
}

export const adminRepo = {
  async getOverview(): Promise<AdminOverview> {
    const [
      totalCards,
      totalArticles,
      activeSubscribers,
      totalInquiries,
      newInquiries,
      premiumArticles,
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
      },
      recentInquiries: recentInquiries.map((inquiry) => ({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        status: inquiry.status,
        packageName: inquiry.package?.name ?? null,
        createdAt: inquiry.createdAt,
      })),
    }
  },
}
