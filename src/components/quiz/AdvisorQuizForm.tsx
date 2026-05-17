import { RotateCcw, Send } from 'lucide-react'
import { useState } from 'react'
import { showToast } from '#/components/Toast'
import { AdvisorQuizResults } from '#/components/quiz/AdvisorQuizResults'
import { Badge } from '#/components/shared'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import {
  getAnsweredQuestionCount,
  isQuizComplete,
  quizQuestions,
} from '#/lib/quiz'
import { recommendCardsFromQuiz } from '#/lib/quiz-recommendation'
import { cn } from '#/lib/utils'

import type { FormEvent, ReactElement } from 'react'
import type { QuizAnswers, QuizQuestionId } from '#/lib/quiz'
import type {
  QuizRecommendation,
  QuizRecommendationCard,
} from '#/lib/quiz-recommendation'

const totalQuestions = quizQuestions.length

export interface AdvisorQuizFormProps {
  cards: QuizRecommendationCard[]
}

export function AdvisorQuizForm({ cards }: AdvisorQuizFormProps): ReactElement {
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [recommendations, setRecommendations] = useState<
    QuizRecommendation[] | null
  >(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const answeredCount = getAnsweredQuestionCount(answers)
  const completionPercentage = Math.round(
    (answeredCount / totalQuestions) * 100,
  )

  function updateAnswer(questionId: QuizQuestionId, optionValue: string): void {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionValue,
    }))
    setSubmitError(null)
  }

  function handleReset(): void {
    setAnswers({})
    setRecommendations(null)
    setSubmitError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!isQuizComplete(answers)) {
      setSubmitError(
        `Jawab ${totalQuestions - answeredCount} pertanyaan lagi sebelum melihat rekomendasi.`,
      )
      return
    }

    setSubmitError(null)
    setRecommendations(recommendCardsFromQuiz(answers, cards))
    showToast('Rekomendasi quiz siap.')
  }

  if (recommendations) {
    return (
      <AdvisorQuizResults
        recommendations={recommendations}
        onReset={handleReset}
      />
    )
  }

  return (
    <section
      className="page-wrap grid gap-6"
      aria-labelledby="advisor-quiz-title"
    >
      <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-xs md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="island-kicker">Progress</p>
            <h2
              id="advisor-quiz-title"
              className="font-display text-2xl font-bold text-primary"
            >
              {answeredCount}/{totalQuestions} pertanyaan terjawab
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Form ini mengumpulkan sinyal utama untuk scoring rekomendasi kartu
              di tahap berikutnya.
            </p>
          </div>

          <Badge tone={answeredCount === totalQuestions ? 'success' : 'accent'}>
            {completionPercentage}% lengkap
          </Badge>
        </div>

        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-secondary"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {quizQuestions.map((question, index) => (
          <Card key={question.id} className="border-border bg-card shadow-xs">
            <CardHeader className="gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    Question {index + 1}
                  </p>
                  <CardTitle
                    id={`${question.id}-title`}
                    className="mt-2 font-display text-2xl text-primary"
                  >
                    {question.title}
                  </CardTitle>
                </div>
                <Badge tone="neutral" size="md">
                  {question.options.length} opsi
                </Badge>
              </div>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                {question.description}
              </p>
            </CardHeader>

            <CardContent>
              <RadioGroup
                value={answers[question.id] ?? ''}
                aria-labelledby={`${question.id}-title`}
                className="grid gap-3 md:grid-cols-2"
                onValueChange={(optionValue) =>
                  updateAnswer(question.id, optionValue)
                }
              >
                {question.options.map((option) => {
                  const optionId = `${question.id}-${option.value}`
                  const isSelected = answers[question.id] === option.value

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        'flex gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-accent/60 hover:bg-accent-light/40 dark:hover:bg-accent/10',
                        isSelected &&
                          'border-accent bg-accent-light/70 dark:bg-accent/15',
                      )}
                    >
                      <RadioGroupItem
                        id={optionId}
                        value={option.value}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={optionId}
                        className="grid cursor-pointer gap-1 text-sm leading-6"
                      >
                        <span className="font-semibold text-primary">
                          {option.label}
                        </span>
                        <span className="text-muted-foreground">
                          {option.description}
                        </span>
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <div className="sticky bottom-4 z-10 rounded-3xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                {answeredCount}/{totalQuestions} jawaban siap diproses
              </p>
              {submitError ? (
                <p className="mt-1 text-sm text-destructive">{submitError}</p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Rekomendasi top 3 akan dihitung dari jawaban dan data kartu
                  terbaru.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4" aria-hidden="true" />
                Lihat rekomendasi
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
