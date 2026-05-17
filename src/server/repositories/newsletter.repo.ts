import { Prisma } from '#/generated/prisma/client'
import { prisma } from '#/db'

export interface SubscribeNewsletterInput {
  email: string
}

export type NewsletterSubscriptionStatus =
  | 'subscribed'
  | 'already_subscribed'
  | 'resubscribed'

export interface NewsletterSubscriptionReceipt {
  id: string
  email: string
  status: NewsletterSubscriptionStatus
}

interface NewsletterSubscriberRecord {
  id: string
  email: string
  unsubscribedAt: Date | null
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function toReceipt(
  subscriber: NewsletterSubscriberRecord,
  status: NewsletterSubscriptionStatus,
): NewsletterSubscriptionReceipt {
  return {
    id: subscriber.id,
    email: subscriber.email,
    status,
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  )
}

export const newsletterRepo = {
  async subscribe(
    input: SubscribeNewsletterInput,
  ): Promise<NewsletterSubscriptionReceipt> {
    const email = normalizeEmail(input.email)
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        unsubscribedAt: true,
      },
    })

    if (existingSubscriber?.unsubscribedAt) {
      const subscriber = await prisma.newsletterSubscriber.update({
        where: {
          email,
        },
        data: {
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
        select: {
          id: true,
          email: true,
          unsubscribedAt: true,
        },
      })

      return toReceipt(subscriber, 'resubscribed')
    }

    if (existingSubscriber) {
      return toReceipt(existingSubscriber, 'already_subscribed')
    }

    try {
      const subscriber = await prisma.newsletterSubscriber.create({
        data: {
          email,
        },
        select: {
          id: true,
          email: true,
          unsubscribedAt: true,
        },
      })

      return toReceipt(subscriber, 'subscribed')
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error
      }

      const subscriber = await prisma.newsletterSubscriber.findUniqueOrThrow({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          unsubscribedAt: true,
        },
      })

      return toReceipt(subscriber, 'already_subscribed')
    }
  },
}
