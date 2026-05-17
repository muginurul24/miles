import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '#/components/login-form.tsx'

export const Route = createFileRoute('/auth/login')({
  head: () => ({
    meta: [
      {
        title: 'Masuk | JustMiles',
      },
      {
        name: 'description',
        content:
          'Masuk ke akun JustMiles untuk mengelola membership, konsultasi, dan preferensi points and miles.',
      },
    ],
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
