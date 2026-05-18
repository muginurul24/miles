// @vitest-environment jsdom

import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeroSection } from '#/components/home/HeroSection'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

type LinkMockProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  children: ReactNode
}

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: LinkMockProps) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('HeroSection', () => {
  it('should prioritize the hero image while keeping it decorative', () => {
    const { container } = render(<HeroSection />)

    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe('/images/hero-airport.jpg')
    expect(image?.getAttribute('fetchpriority')).toBe('high')
    expect(image?.getAttribute('aria-hidden')).toBe('true')
  })
})
