import { Link } from '@tanstack/react-router'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { Badge, RatingBadge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'

import type { ReactElement } from 'react'
import type { QuizRecommendation } from '#/lib/quiz-recommendation'

export interface AdvisorQuizResultsProps {
  recommendations: QuizRecommendation[]
  onReset: () => void
}

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('id-ID')

function formatAnnualFee(value: number): string {
  return value === 0 ? 'Gratis' : idrFormatter.format(value)
}

function formatIdrPerMile(value: number | null): string {
  return value === null ? 'N/A' : `${idrFormatter.format(value)}/mile`
}

export function AdvisorQuizResults({
  recommendations,
  onReset,
}: AdvisorQuizResultsProps): ReactElement {
  const bestRecommendation = recommendations.at(0)

  return (
    <section
      className="page-wrap grid gap-6"
      aria-labelledby="advisor-quiz-results-title"
    >
      <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="island-kicker">Quiz results</p>
            <h2
              id="advisor-quiz-results-title"
              className="font-display text-3xl font-bold text-primary"
            >
              Top 3 rekomendasi kartu
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Ranking ini menggabungkan earning rate, partner transfer, annual
              fee, travel benefit, dan target redemption dari jawaban quiz.
            </p>
          </div>

          {bestRecommendation ? (
            <div className="rounded-2xl border border-border bg-secondary/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                Best match
              </p>
              <p className="mt-2 font-display text-xl font-bold text-primary">
                {bestRecommendation.shortName}
              </p>
              <p className="text-sm text-muted-foreground">
                Score {bestRecommendation.score}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.cardId}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            Butuh strategi lebih detail?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Gunakan hasil ini sebagai brief awal untuk konsultasi kartu atau
            redemption plan.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Ulangi quiz
          </Button>
          <Button asChild>
            <Link to="/consulting">
              Butuh strategi lebih detail?
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

interface RecommendationCardProps {
  recommendation: QuizRecommendation
  rank: number
}

function RecommendationCard({
  recommendation,
  rank,
}: RecommendationCardProps): ReactElement {
  return (
    <Card className="h-full border-border bg-card shadow-xs">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <Badge tone={rank === 1 ? 'success' : 'accent'} size="md">
            #{rank}
          </Badge>
          {recommendation.rating ? (
            <RatingBadge rating={recommendation.rating} />
          ) : null}
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold text-primary">
            {recommendation.shortName}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {recommendation.bank} · {formatAnnualFee(recommendation.annualFee)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5">
        <div className="grid grid-cols-2 gap-3">
          <ResultStat
            label="Miles/tahun"
            value={numberFormatter.format(recommendation.estimatedMilesPerYear)}
          />
          <ResultStat
            label="IDR/mile"
            value={formatIdrPerMile(recommendation.bestIdrPerMile)}
          />
          <ResultStat label="Score" value={String(recommendation.score)} />
          <ResultStat
            label="Program"
            value={recommendation.bestProgram ?? 'Flexible'}
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Match reasons
          </p>
          <ul className="grid gap-2">
            {recommendation.matchReasons.map((reason) => (
              <li key={reason} className="flex gap-2 text-sm leading-6">
                <Sparkles
                  className="mt-1 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link
            to="/credit-cards/$slug"
            params={{ slug: recommendation.cardId }}
          >
            Lihat detail kartu
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ResultStatProps {
  label: string
  value: string
}

function ResultStat({ label, value }: ResultStatProps): ReactElement {
  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-primary">
        {value}
      </p>
    </div>
  )
}
