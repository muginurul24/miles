// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChartContainer, ChartTooltipContent } from '#/components/ui/chart'

import type { Payload } from 'recharts/types/component/DefaultTooltipContent'

describe('ChartTooltipContent', () => {
  it('should render category labels even when they are not chart config keys', () => {
    const payload = [
      {
        dataKey: 'card-a',
        graphicalItemId: 'card-a',
        name: 'card-a',
        value: 82,
        color: 'var(--chart-1)',
        payload: {
          label: 'Miles value',
          'card-a': 82,
        },
      },
    ] satisfies Payload[]

    render(
      <ChartContainer
        config={{
          'card-a': {
            label: 'Card A',
            color: 'var(--chart-1)',
          },
        }}
      >
        <ChartTooltipContent active label="Miles value" payload={payload} />
      </ChartContainer>,
    )

    expect(screen.getByText('Miles value')).not.toBeNull()
    expect(screen.getByText('Card A')).not.toBeNull()
    expect(screen.getByText('82')).not.toBeNull()
  })
})
