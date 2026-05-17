import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/LegalPage'
import { termsContent } from '#/components/legal/legal-content'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      {
        title: 'Terms & Conditions — JustMiles',
      },
      {
        name: 'description',
        content:
          'Syarat dan Ketentuan JustMiles untuk konten, calculator, compare tool, membership, newsletter, akun, dan consulting.',
      },
    ],
  }),
  component: TermsPage,
})

function TermsPage() {
  return <LegalPage content={termsContent} />
}
