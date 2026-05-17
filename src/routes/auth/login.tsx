import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '#/components/login-form.tsx'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/auth/login')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Masuk | JustMiles',
      description:
        'Masuk ke akun JustMiles untuk mengelola membership, konsultasi, dan preferensi points and miles.',
      path: '/auth/login',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/auth/login'),
  }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-12rem)] items-center justify-center py-10 sm:py-14">
      <LoginForm className="w-full max-w-md" />
    </main>
  )
}
