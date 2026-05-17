import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '#/components/signup-form.tsx'

export const Route = createFileRoute('/auth/register')({
  head: () => ({
    meta: [
      {
        title: 'Daftar | JustMiles',
      },
      {
        name: 'description',
        content:
          'Daftar akun JustMiles untuk menyimpan preferensi kartu, membership, dan konsultasi points and miles.',
      },
    ],
  }),
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <main className="page-wrap flex min-h-[calc(100vh-12rem)] items-center justify-center py-10 sm:py-14">
      <SignupForm className="w-full max-w-md" />
    </main>
  )
}
