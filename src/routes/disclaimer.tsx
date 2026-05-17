import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/LegalPage'
import { disclaimerContent } from '#/components/legal/disclaimer-content'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/disclaimer')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Disclaimer — JustMiles',
      description:
        'Disclaimer JustMiles tentang batasan informasi kartu kredit, points and miles, calculator, konten travel, membership, referral, dan consulting.',
      path: '/disclaimer',
    }),
    links: buildCanonicalLinks('/disclaimer'),
  }),
  component: DisclaimerPage,
})

function DisclaimerPage() {
  return <LegalPage content={disclaimerContent} />
}
