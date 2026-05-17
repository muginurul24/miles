import { describe, expect, it } from 'vitest'
import { CHART_THEME_COLORS, getChartColor } from '#/components/charts'

describe('getChartColor', () => {
  it('should return the first chart token when index is zero', () => {
    expect(getChartColor(0)).toBe('var(--chart-1)')
  })

  it('should wrap chart tokens when index exceeds palette length', () => {
    expect(getChartColor(CHART_THEME_COLORS.length)).toBe('var(--chart-1)')
    expect(getChartColor(CHART_THEME_COLORS.length + 1)).toBe('var(--chart-2)')
  })

  it('should normalize negative and fractional indexes when provided', () => {
    expect(getChartColor(-1.9)).toBe('var(--chart-2)')
  })
})
