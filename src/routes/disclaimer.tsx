import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/LegalPage'
import { disclaimerContent } from '#/components/legal/disclaimer-content'

export const Route = createFileRoute('/disclaimer')({
  head: () => ({
    meta: [
      {
        title: 'Disclaimer — JustMiles',
      },
      {
        name: 'description',
        content:
          'Disclaimer JustMiles tentang batasan informasi kartu kredit, points and miles, calculator, konten travel, membership, referral, dan consulting.',
      },
    ],
  }),
  component: DisclaimerPage,
})

function DisclaimerPage() {
  return <LegalPage content={disclaimerContent} />
}
