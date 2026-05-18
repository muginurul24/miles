import { describe, expect, it } from 'vitest'
import {
  getAdminRedirectTarget,
  getAuthRedirectTarget,
  getGuestOnlyRedirectTarget,
} from '#/lib/auth-guards'

function createGuardSession(role: 'admin' | 'user') {
  return {
    user: {
      role,
    },
  }
}

describe('getAuthRedirectTarget', () => {
  it('should redirect to login when session is missing', () => {
    expect(getAuthRedirectTarget(null)).toBe('/auth/login')
  })

  it('should allow access when session exists', () => {
    expect(getAuthRedirectTarget(createGuardSession('user'))).toBeNull()
  })
})

describe('getAdminRedirectTarget', () => {
  it('should redirect to login when admin session is missing', () => {
    expect(getAdminRedirectTarget(null)).toBe('/auth/login')
  })

  it('should redirect to public site when user is not admin', () => {
    expect(getAdminRedirectTarget(createGuardSession('user'))).toBe('/')
  })

  it('should allow access when user is admin', () => {
    expect(getAdminRedirectTarget(createGuardSession('admin'))).toBeNull()
  })
})

describe('getGuestOnlyRedirectTarget', () => {
  it('should allow access when session is missing', () => {
    expect(getGuestOnlyRedirectTarget(null)).toBeNull()
  })

  it('should redirect to membership when user is already signed in', () => {
    expect(getGuestOnlyRedirectTarget(createGuardSession('user'))).toBe(
      '/membership',
    )
  })

  it('should redirect to dashboard when admin is already signed in', () => {
    expect(getGuestOnlyRedirectTarget(createGuardSession('admin'))).toBe(
      '/dashboard',
    )
  })
})
