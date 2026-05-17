import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

export const getCurrentSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()

    return auth.api.getSession({
      headers: request.headers,
    })
  },
)

export async function requireAuth(): Promise<void> {
  const session = await getCurrentSession()

  if (!session) {
    throw redirect({ to: '/auth/login' })
  }
}

export async function requireAdmin(): Promise<void> {
  const session = await getCurrentSession()

  if (!session) {
    throw redirect({ to: '/auth/login' })
  }

  if (session.user.role !== 'admin') {
    throw redirect({ to: '/' })
  }
}
