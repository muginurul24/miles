import { createFileRoute } from '@tanstack/react-router'
import { AboutPageContent } from '#/components/about/AboutPageContent'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Tentang JustMiles — Indonesia Points & Miles Advisor',
      description:
        'Tentang JustMiles: platform advisor points and miles Indonesia untuk memilih kartu, menghitung value, membaca travel media, dan merencanakan strategi redemption.',
      path: '/about',
    }),
    links: buildCanonicalLinks('/about'),
  }),
  component: AboutPageContent,
})
