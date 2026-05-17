import { createFileRoute } from '@tanstack/react-router'
import { AboutPageContent } from '#/components/about/AboutPageContent'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      {
        title: 'Tentang JustMiles — Indonesia Points & Miles Advisor',
      },
      {
        name: 'description',
        content:
          'Tentang JustMiles: platform advisor points and miles Indonesia untuk memilih kartu, menghitung value, membaca travel media, dan merencanakan strategi redemption.',
      },
    ],
  }),
  component: AboutPageContent,
})
