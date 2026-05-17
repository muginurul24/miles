import { describe, expect, it } from 'vitest'
import { buildSubscribersCsv } from '#/lib/subscribers-csv'

import type { AdminSubscriberRow } from '#/server/repositories/admin-subscribers.repo'

describe('buildSubscribersCsv', () => {
  it('should export active and unsubscribed subscribers as CSV', () => {
    const subscribers: AdminSubscriberRow[] = [
      {
        id: 'subscriber-1',
        email: 'active@example.com',
        subscribedAt: new Date('2026-05-17T09:00:00.000Z'),
        unsubscribedAt: null,
      },
      {
        id: 'subscriber-2',
        email: 'unsubscribed@example.com',
        subscribedAt: new Date('2026-05-16T09:00:00.000Z'),
        unsubscribedAt: new Date('2026-05-17T10:00:00.000Z'),
      },
    ]

    const csv = buildSubscribersCsv(subscribers)

    expect(csv).toContain('email,status,subscribed_at,unsubscribed_at')
    expect(csv).toContain('active@example.com,active')
    expect(csv).toContain('unsubscribed@example.com,unsubscribed')
  })

  it('should escape commas and quotes in email fields', () => {
    const subscribers: AdminSubscriberRow[] = [
      {
        id: 'subscriber-1',
        email: 'name"with,comma@example.com',
        subscribedAt: new Date('2026-05-17T09:00:00.000Z'),
        unsubscribedAt: null,
      },
    ]

    expect(buildSubscribersCsv(subscribers)).toContain(
      '"name""with,comma@example.com"',
    )
  })
})
