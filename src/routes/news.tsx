import { createFileRoute } from '@tanstack/react-router'
import { ArticleGrid } from '#/components/cards/ArticleGrid'
import { NewsletterCTA, PageHeader } from '#/components/shared'

export const Route = createFileRoute('/news')({
  loader: async ({ context }) => {
    const articles = await context.queryClient.ensureQueryData(
      context.trpc.articles.list.queryOptions({
        category: 'News',
        limit: 24,
      }),
    )

    return { articles }
  },
  head: () => ({
    meta: [
      {
        title: 'News Points & Miles — JustMiles',
      },
      {
        name: 'description',
        content:
          'Update terbaru program points, miles, kartu kredit, airline loyalty, dan promo transfer di Indonesia.',
      },
    ],
  }),
  component: NewsPage,
})

function NewsPage() {
  const { articles } = Route.useLoaderData()

  return (
    <main className="pb-12">
      <PageHeader
        eyebrow="News"
        title="Update terbaru points dan miles"
        description="Perubahan program, promo transfer, berita kartu kredit, dan airline loyalty yang bisa langsung memengaruhi keputusan earning maupun redemption kamu."
      />

      <section className="page-wrap grid gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="island-kicker">Latest updates</p>
            <h2 className="font-display text-2xl font-bold text-primary">
              Berita yang perlu kamu tahu
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {articles.length} artikel tersedia
          </p>
        </div>

        <ArticleGrid
          articles={articles}
          emptyTitle="Belum ada news"
          emptyMessage="Belum ada news terbaru."
        />
      </section>

      <NewsletterCTA />
    </main>
  )
}
