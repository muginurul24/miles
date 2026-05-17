import { describe, expect, it } from 'vitest'
import {
  absoluteUrl,
  buildCanonicalLinks,
  buildRobotsTxt,
  buildSeoMeta,
  buildSitemapXml,
  normalizeSiteOrigin,
} from '#/lib/seo'

describe('absoluteUrl', () => {
  it('should join relative paths with normalized site origin', () => {
    expect(absoluteUrl('/calculator', 'https://example.com/')).toBe(
      'https://example.com/calculator',
    )
  })

  it('should keep absolute URLs unchanged when image URL is external', () => {
    expect(absoluteUrl('https://cdn.example.com/og.png')).toBe(
      'https://cdn.example.com/og.png',
    )
  })
})

describe('normalizeSiteOrigin', () => {
  it('should remove trailing slashes when origin is configured', () => {
    expect(normalizeSiteOrigin('https://justmiles.id///')).toBe(
      'https://justmiles.id',
    )
  })
})

describe('buildSeoMeta', () => {
  it('should include canonical Open Graph and Twitter image metadata', () => {
    const meta = buildSeoMeta({
      title: 'Kalkulator Miles — JustMiles',
      description: 'Hitung IDR per mile.',
      path: '/calculator',
    })

    expect(meta).toContainEqual({
      property: 'og:url',
      content: 'https://justmiles.id/calculator',
    })
    expect(meta).toContainEqual({
      name: 'twitter:image',
      content: 'https://justmiles.id/og-default.svg',
    })
  })

  it('should add noindex robots metadata when route is private', () => {
    const meta = buildSeoMeta({
      title: 'Dashboard | JustMiles',
      description: 'Private dashboard.',
      path: '/dashboard',
      noIndex: true,
    })

    expect(meta).toContainEqual({
      name: 'robots',
      content: 'noindex,nofollow',
    })
  })
})

describe('buildCanonicalLinks', () => {
  it('should return canonical link for public routes', () => {
    expect(buildCanonicalLinks('/news')).toEqual([
      { rel: 'canonical', href: 'https://justmiles.id/news' },
    ])
  })
})

describe('buildSitemapXml', () => {
  it('should render escaped sitemap locations with optional metadata', () => {
    const xml = buildSitemapXml(
      [
        {
          path: '/news?tag=points&miles=true',
          lastModified: new Date('2026-05-17T00:00:00.000Z'),
          changeFrequency: 'daily',
          priority: 0.8,
        },
      ],
      'https://example.com',
    )

    expect(xml).toContain(
      '<loc>https://example.com/news?tag=points&amp;miles=true</loc>',
    )
    expect(xml).toContain('<lastmod>2026-05-17T00:00:00.000Z</lastmod>')
    expect(xml).toContain('<priority>0.8</priority>')
  })
})

describe('buildRobotsTxt', () => {
  it('should allow public crawling while blocking private surfaces', () => {
    expect(buildRobotsTxt('https://example.com')).toContain(
      'Disallow: /dashboard',
    )
    expect(buildRobotsTxt('https://example.com')).toContain(
      'Sitemap: https://example.com/sitemap.xml',
    )
  })
})
