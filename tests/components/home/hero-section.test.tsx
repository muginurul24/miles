// @vitest-environment jsdom

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroSection } from '#/components/home/HeroSection'

describe('HeroSection', () => {
  it('should prioritize the hero image while keeping it decorative', () => {
    const { container } = render(<HeroSection />)

    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe('/images/hero-airport.jpg')
    expect(image?.getAttribute('fetchpriority')).toBe('high')
    expect(image?.getAttribute('aria-hidden')).toBe('true')
  })
})
