import { createFileRoute } from '@tanstack/react-router'
import { buildSitemapXml, normalizeSiteOrigin } from '#/lib/seo'
import { seoRepo } from '#/server/repositories/seo.repo'

import type { SitemapEntry } from '#/lib/seo'

const staticSitemapEntries: SitemapEntry[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/credit-cards', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/calculator', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/compare', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/news', changeFrequency: 'daily', priority: 0.8 },
  { path: '/guides', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/deals', changeFrequency: 'daily', priority: 0.8 },
  { path: '/reviews/flight', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/reviews/hotel', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/reviews/lounge', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/membership', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/consulting', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/quiz', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/newsletter', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/disclaimer', changeFrequency: 'yearly', priority: 0.2 },
]

async function handler(): Promise<Response> {
  const origin = normalizeSiteOrigin(
    process.env.SERVER_URL ?? 'https://justmiles.id',
  )
  const dynamicEntries = await seoRepo.getSitemapEntries()
  const body = buildSitemapXml(
    [...staticSitemapEntries, ...dynamicEntries],
    origin,
  )

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: handler,
    },
  },
})
