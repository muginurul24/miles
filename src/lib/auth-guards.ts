import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'
import { SECURITY_HEADERS } from '#/lib/security-headers'

interface GuardSession {
  user: {
    role?: string | null
  }
}

type RedirectTarget = '/' | '/auth/login' | '/dashboard' | '/membership'

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
  if (!session) {
    return '/auth/login'
  }

  if (session.user.role !== 'admin') {
    return '/'
  }

  return null
}

export function getGuestOnlyRedirectTarget(
  session: GuardSession | null,
): RedirectTarget | null {
  if (!session) {
    return null
  }

  return session.user.role === 'admin' ? '/dashboard' : '/membership'
}

export async function requireAuth(): Promise<void> {
  const session = await getCurrentSession()
  const target = getAuthRedirectTarget(session)

  if (target) {
    throw redirect({ headers: SECURITY_HEADERS, to: target })
  }
}

export async function requireAdmin(): Promise<void> {
  const session = await getCurrentSession()
  const target = getAdminRedirectTarget(session)

  if (target) {
    throw redirect({ headers: SECURITY_HEADERS, to: target })
  }
}

export async function requireGuest(): Promise<void> {
  const session = await getCurrentSession()
  const target = getGuestOnlyRedirectTarget(session)

  if (target) {
    throw redirect({ headers: SECURITY_HEADERS, to: target })
  }
}
