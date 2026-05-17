import { describe, expect, it } from 'vitest'
import { getRouteErrorMessage } from '#/components/shared'

describe('getRouteErrorMessage', () => {
  it('should return Error messages when route failure includes detail', () => {
    expect(getRouteErrorMessage(new Error('Loader gagal'))).toBe('Loader gagal')
  })

  it('should return string errors when route failure is thrown as text', () => {
    expect(getRouteErrorMessage('Token tidak valid')).toBe('Token tidak valid')
  })

  it('should return safe fallback when route failure has no useful message', () => {
    expect(getRouteErrorMessage({ code: 'UNKNOWN' })).toContain(
      'halaman ini sedang mengalami gangguan',
    )
  })
})
