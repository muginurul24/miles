import { createFileRoute } from '@tanstack/react-router'
import { AdminArticlesManager } from '#/components/dashboard/AdminArticlesManager'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { buildCanonicalLinks, buildSeoMeta } from '#/lib/seo'

export const Route = createFileRoute('/dashboard/articles')({
  loader: async ({ context }) => {
    const articles = await context.queryClient.ensureQueryData(
      context.trpc.admin.articles.queryOptions(),
    )

    return { articles }
  },
  head: () => ({
    meta: buildSeoMeta({
      title: 'Manage Articles | JustMiles',
      description: 'Admin article manager untuk konten JustMiles.',
      path: '/dashboard/articles',
      noIndex: true,
    }),
    links: buildCanonicalLinks('/dashboard/articles'),
  }),
  component: DashboardArticlesPage,
})

function DashboardArticlesPage() {
  const { articles } = Route.useLoaderData()

  return (
    <DashboardShell
      title="Articles"
      description="Kelola news, guides, deals, reviews, premium gate, dan draft editorial."
    >
      <AdminArticlesManager initialArticles={articles} />
    </DashboardShell>
  )
}
