import { prisma } from '#/db'

import type { Prisma } from '#/generated/prisma/client'

const adminSubscriberSelect = {
  id: true,
  email: true,
  subscribedAt: true,
  unsubscribedAt: true,
} satisfies Prisma.NewsletterSubscriberSelect

export type AdminSubscriberRow = Prisma.NewsletterSubscriberGetPayload<{
  select: typeof adminSubscriberSelect
}>

export const adminSubscribersRepo = {
  async list(): Promise<AdminSubscriberRow[]> {
    return prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: adminSubscriberSelect,
    })
  },
}
