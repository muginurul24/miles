export const SITE_NAME = 'JustMiles'
export const SITE_ORIGIN = 'https://justmiles.id'
export const DEFAULT_OG_IMAGE_PATH = '/og-default.svg'

export const DEFAULT_SEO = {
  title: 'JustMiles | Indonesia Points & Miles Advisor',
  description:
    "Indonesia's points and miles advisor for credit cards, travel deals, redemption guides, and premium trip planning.",
  path: '/',
} as const

export interface SeoMetaConfig {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export interface SeoMetaTag {
  title?: string
  name?: string
  property?: string
  content?: string
}

export interface SeoLinkTag {
  rel: string
  href: string
}

export interface SitemapEntry {
  path: string
  lastModified?: Date | string
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

export function normalizeSiteOrigin(origin = SITE_ORIGIN): string {
  return origin.replace(/\/+$/, '')
}

export function absoluteUrl(path: string, origin = SITE_ORIGIN): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizeSiteOrigin(origin)}${normalizedPath}`
}

export function buildSeoMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE_PATH,
  type = 'website',
  noIndex = false,
}: SeoMetaConfig): SeoMetaTag[] {
  const canonicalUrl = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)
  const meta: SeoMetaTag[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'id_ID' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex,nofollow' })
  }

  return meta
}

export function buildCanonicalLinks(path: string): SeoLinkTag[] {
  return [{ rel: 'canonical', href: absoluteUrl(path) }]
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function formatSitemapDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value

  return date.toISOString()
}

function formatSitemapPriority(priority: number | undefined): string | null {
  if (priority === undefined) {
    return null
  }

  return Math.min(Math.max(priority, 0), 1).toFixed(1)
}

export function buildSitemapXml(
  entries: SitemapEntry[],
  origin = SITE_ORIGIN,
): string {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `<lastmod>${formatSitemapDate(entry.lastModified)}</lastmod>`
        : ''
      const changeFrequency = entry.changeFrequency
        ? `<changefreq>${entry.changeFrequency}</changefreq>`
        : ''
      const priority = formatSitemapPriority(entry.priority)
      const priorityTag = priority ? `<priority>${priority}</priority>` : ''

      return [
        '<url>',
        `<loc>${escapeXml(absoluteUrl(entry.path, origin))}</loc>`,
        lastModified,
        changeFrequency,
        priorityTag,
        '</url>',
      ].join('')
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}

export function buildRobotsTxt(origin = SITE_ORIGIN): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /auth',
    `Sitemap: ${absoluteUrl('/sitemap.xml', origin)}`,
    '',
  ].join('\n')
}
