import type { AdminSubscriberRow } from '#/server/repositories/admin-subscribers.repo'

const csvDateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function buildSubscribersCsv(subscribers: AdminSubscriberRow[]): string {
  const rows = [
    ['email', 'status', 'subscribed_at', 'unsubscribed_at'],
    ...subscribers.map((subscriber) => [
      subscriber.email,
      subscriber.unsubscribedAt ? 'unsubscribed' : 'active',
      formatCsvDate(subscriber.subscribedAt),
      subscriber.unsubscribedAt ? formatCsvDate(subscriber.unsubscribedAt) : '',
    ]),
  ]

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

function formatCsvDate(date: Date): string {
  return csvDateFormatter.format(new Date(date))
}

function escapeCsvCell(value: string): string {
  if (!/[",\n]/.test(value)) {
    return value
  }

  return `"${value.replaceAll('"', '""')}"`
}
