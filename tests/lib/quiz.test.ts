import { describe, expect, it } from 'vitest'
import {
  getAnsweredQuestionCount,
  isQuizComplete,
  quizQuestions,
} from '#/lib/quiz'

describe('quizQuestions', () => {
  it('should contain 8 questions with expected option counts', () => {
    expect(quizQuestions).toHaveLength(8)
    expect(quizQuestions.map((question) => question.options.length)).toEqual([
      5, 5, 5, 5, 5, 4, 5, 6,
    ])
  })
})

describe('getAnsweredQuestionCount', () => {
  it('should count answered questions when answers are partial', () => {
    expect(
      getAnsweredQuestionCount({
        monthlySpend: '10m-20m',
        destination: 'north-asia',
      }),
    ).toBe(2)
  })
})

describe('isQuizComplete', () => {
  it('should return true when every question has an answer', () => {
    const completeAnswers = Object.fromEntries(
      quizQuestions.map((question) => [question.id, question.options[0].value]),
    )

    expect(isQuizComplete(completeAnswers)).toBe(true)
  })

  it('should return false when any question is unanswered', () => {
    expect(
      isQuizComplete({
        monthlySpend: '10m-20m',
      }),
    ).toBe(false)
  })
})
