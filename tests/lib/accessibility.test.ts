import { describe, expect, it } from 'vitest'
import { getFieldErrorId } from '#/lib/accessibility'

describe('getFieldErrorId', () => {
  it('should derive stable error description IDs from field IDs', () => {
    expect(getFieldErrorId('consulting-email')).toBe('consulting-email-error')
  })
})
