import { describe, expect, it } from 'vitest'
import {
  getPremiumArticleGateCopy,
  getPremiumContentCtaCopy,
} from '#/lib/premium-gate-copy'

describe('getPremiumArticleGateCopy', () => {
  it('should show guest registration copy when user is missing', () => {
    const copy = getPremiumArticleGateCopy({
      isContentRefreshing: false,
      isSessionPending: false,
      user: null,
    })

    expect(copy.primary.to).toBe('/auth/register')
    expect(copy.secondary?.to).toBe('/auth/login')
    expect(copy.secondary?.label).toBe('Sudah daftar? Masuk di sini')
  })

  it('should hide login copy when user is already signed in', () => {
    const copy = getPremiumArticleGateCopy({
      isContentRefreshing: false,
      isSessionPending: false,
      user: { membershipTier: 'free', role: 'user' },
    })

    expect(copy.primary.to).toBe('/membership')
    expect(copy.secondary).toBeUndefined()
    expect(copy.cardText).not.toMatch(/daftar|masuk/i)
  })

  it('should show sync copy when premium user content is refreshing', () => {
    const copy = getPremiumArticleGateCopy({
      isContentRefreshing: true,
      isSessionPending: false,
      user: {
        membershipExpiresAt: '2026-06-18T00:00:00.000Z',
        membershipTier: 'plus',
      },
    })

    expect(copy.mode).toBe('member-sync')
    expect(copy.primary.kind).toBe('disabled')
    expect(copy.secondary).toBeUndefined()
  })
})

describe('getPremiumContentCtaCopy', () => {
  it('should show registration CTA when user is missing', () => {
    const copy = getPremiumContentCtaCopy({
      isSessionPending: false,
      user: null,
    })

    expect(copy.buttonTo).toBe('/auth/register')
    expect(copy.cardText).toMatch(/Daftar gratis/)
  })

  it('should show membership CTA when user is already signed in', () => {
    const copy = getPremiumContentCtaCopy({
      isSessionPending: false,
      user: { membershipTier: 'free', role: 'user' },
    })

    expect(copy.buttonTo).toBe('/membership')
    expect(copy.cardText).not.toMatch(/Daftar gratis|Masuk/i)
  })
})
