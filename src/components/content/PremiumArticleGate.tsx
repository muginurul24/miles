'use client'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Crown, Loader2, Sparkles } from 'lucide-react'
import { ArticleBody } from '#/components/content/ArticleBody'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { useTRPC } from '#/integrations/trpc/react'
import { authClient } from '#/lib/auth-client'
import { getPremiumArticleGateCopy } from '#/lib/premium-gate-copy'
import { useHasMounted } from '#/lib/use-has-mounted'

import type { Article } from '#/generated/prisma/client'
import type { ReactElement, ReactNode } from 'react'

export interface PremiumArticleGateProps {
  article: Article
  children: ReactNode
}

export function PremiumArticleGate({
  article,
  children,
}: PremiumArticleGateProps): ReactElement {
  const trpc = useTRPC()
  const { data: session, isPending } = authClient.useSession()
  const hasMounted = useHasMounted()
  const isLocked = article.premium && !article.content
  const refreshedArticleQuery = useQuery(
    trpc.articles.getBySlug.queryOptions(
      { slug: article.id },
      {
        enabled: Boolean(hasMounted && isLocked && session),
        refetchOnWindowFocus: false,
      },
    ),
  )
  const refreshedArticle = refreshedArticleQuery.data

  if (refreshedArticle?.content) {
    return <ArticleBody article={refreshedArticle} />
  }

  if (!isLocked) {
    return <>{children}</>
  }

  const gateCopy = getPremiumArticleGateCopy({
    isContentRefreshing: refreshedArticleQuery.isFetching,
    isSessionPending: !hasMounted || isPending,
    user: hasMounted ? session?.user : undefined,
  })

  return (
    <div className="grid gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs">
        <ArticleBody
          article={{
            ...article,
            content:
              article.excerpt ??
              'Berikut cuplikan artikelnya. Scroll untuk membaca preview.',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card via-card/85 to-transparent"
          aria-hidden="true"
        />
      </div>

      <section className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-xs md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_18rem] md:items-center">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone="warning"
                size="md"
                className="inline-flex items-center gap-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
              >
                <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                Member Exclusive
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Deep Analysis
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                {gateCopy.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
                {gateCopy.description}
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
            <p className="text-sm leading-6 text-primary-foreground/80">
              {gateCopy.cardText}
            </p>
            <PremiumGatePrimaryAction
              action={gateCopy.primary}
              onRefresh={() => void refreshedArticleQuery.refetch()}
            />
            {gateCopy.secondary ? (
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to={gateCopy.secondary.to}>
                  {gateCopy.secondary.label}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

function PremiumGatePrimaryAction({
  action,
  onRefresh,
}: {
  action: ReturnType<typeof getPremiumArticleGateCopy>['primary']
  onRefresh: () => void
}): ReactElement {
  const className = 'bg-accent text-accent-foreground hover:bg-accent-hover'

  if (action.kind === 'link' && action.to) {
    return (
      <Button asChild size="lg" className={className}>
        <Link to={action.to}>
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    )
  }

  if (action.kind === 'refresh') {
    return (
      <Button type="button" size="lg" className={className} onClick={onRefresh}>
        {action.label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    )
  }

  return (
    <Button type="button" size="lg" className={className} disabled>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {action.label}
    </Button>
  )
}
