import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/LegalPage'
import { privacyPolicyContent } from '#/components/legal/privacy-content'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Privacy Policy — JustMiles',
      description:
        'Kebijakan Privasi JustMiles tentang data akun, newsletter, consulting, membership, pemrosesan, retensi, keamanan, dan hak pengguna.',
      path: '/privacy',
    }),
    links: buildCanonicalLinks('/privacy'),
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return <LegalPage content={privacyPolicyContent} />
}
