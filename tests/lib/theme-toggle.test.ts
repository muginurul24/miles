import { describe, expect, it } from 'vitest'
import { getNextThemeMode } from '#/components/ThemeToggle'

describe('getNextThemeMode', () => {
  it('should cycle light to dark to system to light', () => {
    expect(getNextThemeMode('light')).toBe('dark')
    expect(getNextThemeMode('dark')).toBe('system')
    expect(getNextThemeMode('system')).toBe('light')
  })
})
