// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from '#/components/shared'

describe('EmptyState', () => {
  it('should render accessible status copy when no data is available', () => {
    render(
      <EmptyState
        title="Tidak ada kartu"
        description="Tidak ada kartu yang cocok dengan filter."
      />,
    )

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.getByText('Tidak ada kartu')).toBeTruthy()
    expect(
      screen.getByText('Tidak ada kartu yang cocok dengan filter.'),
    ).toBeTruthy()
  })

  it('should render optional action when recovery is available', () => {
    render(
      <EmptyState
        title="Belum ada artikel"
        description="Coba reset filter atau kembali nanti."
        action={<button type="button">Reset filter</button>}
      />,
    )

    expect(screen.getByRole('button', { name: 'Reset filter' })).toBeTruthy()
  })
})
