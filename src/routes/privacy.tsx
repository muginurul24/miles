import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/LegalPage'
import { privacyPolicyContent } from '#/components/legal/legal-content'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      {
        title: 'Privacy Policy — JustMiles',
      },
      {
        name: 'description',
        content:
          'Kebijakan Privasi JustMiles tentang data akun, newsletter, consulting, membership, pemrosesan, retensi, keamanan, dan hak pengguna.',
      },
    ],
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return <LegalPage content={privacyPolicyContent} />
}
