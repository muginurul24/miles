import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

interface GuardSession {
  user: {
    role?: string | null
  }
}

type RedirectTarget = '/' | '/auth/login'

export const getCurrentSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()

    return auth.api.getSession({
      headers: request.headers,
    })
  },
)

export function getAuthRedirectTarget(
  session: GuardSession | null,
): RedirectTarget | null {
  if (!session) {
    return '/auth/login'
  }

  return null
}

export function getAdminRedirectTarget(
  session: GuardSession | null,
): RedirectTarget | null {
  const authTarget = getAuthRedirectTarget(session)

  if (authTarget) {
    return authTarget
  }

  if (session.user.role !== 'admin') {
    return '/'
  }

  return null
}

export async function requireAuth(): Promise<void> {
  const session = await getCurrentSession()
  const target = getAuthRedirectTarget(session)

  if (target) {
    throw redirect({ to: target })
  }
}

export async function requireAdmin(): Promise<void> {
  const session = await getCurrentSession()
  const target = getAdminRedirectTarget(session)

  if (target) {
    throw redirect({ to: target })
  }
}
