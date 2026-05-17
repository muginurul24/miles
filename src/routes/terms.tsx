import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/LegalPage'
import { termsContent } from '#/components/legal/terms-content'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Terms & Conditions — JustMiles',
      description:
        'Syarat dan Ketentuan JustMiles untuk konten, calculator, compare tool, membership, newsletter, akun, dan consulting.',
      path: '/terms',
    }),
    links: buildCanonicalLinks('/terms'),
  }),
  component: TermsPage,
})

function TermsPage() {
  return <LegalPage content={termsContent} />
}
