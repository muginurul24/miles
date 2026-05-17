export const CHART_THEME_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

export function getChartColor(index: number): string {
  const normalizedIndex =
    Math.abs(Math.trunc(index)) % CHART_THEME_COLORS.length

  return CHART_THEME_COLORS[normalizedIndex] ?? CHART_THEME_COLORS[0]
}
