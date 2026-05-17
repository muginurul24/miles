import { createFileRoute } from '@tanstack/react-router'
import { ArticleBody } from '#/components/content/ArticleBody'
import { ArticleDetailHero } from '#/components/content/ArticleDetailHero'
import { PremiumArticleGate } from '#/components/content/PremiumArticleGate'
import { RelatedArticlesSection } from '#/components/content/RelatedArticlesSection'
import { NewsletterCTA } from '#/components/shared'

export const Route = createFileRoute('/articles/$slug')({
  loader: async ({ context, params }) => {
    const article = await context.queryClient.ensureQueryData(
      context.trpc.articles.getBySlug.queryOptions({ slug: params.slug }),
    )
    const relatedArticles = await context.queryClient.ensureQueryData(
      context.trpc.articles.related.queryOptions({
        slug: article.id,
        category: article.category,
        limit: 3,
      }),
    )

    return { article, relatedArticles }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData.article.title} — JustMiles`,
      },
      {
        name: 'description',
        content:
          loaderData.article.excerpt ??
          'Artikel JustMiles tentang points, miles, kartu kredit, dan travel strategy.',
      },
    ],
  }),
  component: ArticleDetailPage,
})

function ArticleDetailPage() {
  const { article, relatedArticles } = Route.useLoaderData()

  return (
    <main className="page-wrap grid gap-10 py-8 lg:py-12">
      <ArticleDetailHero article={article} />

      <div className="mx-auto w-full max-w-3xl">
        <PremiumArticleGate article={article}>
          <ArticleBody article={article} />
        </PremiumArticleGate>
      </div>

      <RelatedArticlesSection articles={relatedArticles} />

      <NewsletterCTA className="-mx-4 rounded-none border md:mx-0 md:rounded-3xl" />
    </main>
  )
}
