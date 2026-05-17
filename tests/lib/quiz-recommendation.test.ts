import { describe, expect, it } from 'vitest'
import { recommendCardsFromQuiz } from '#/lib/quiz-recommendation'

import type { QuizRecommendationCard } from '#/lib/quiz-recommendation'
import type { QuizAnswers } from '#/lib/quiz'

const premiumKrisFlyerCard: QuizRecommendationCard = {
  id: 'premium-krisflyer',
  name: 'Premium KrisFlyer Card',
  shortName: 'Premium KF',
  bank: 'BCA',
  annualFee: 4_000_000,
  loungeAccess: true,
  travelInsurance: true,
  earningRates: [
    {
      transactionType: 'local',
      spendPerPoint: 8_000,
      pointsEarned: 1,
    },
    {
      transactionType: 'overseas',
      spendPerPoint: 5_000,
      pointsEarned: 1,
    },
  ],
  transferPartners: [
    {
      program: 'KrisFlyer',
      pointsRequired: 1,
      milesReceived: 1,
    },
    {
      program: 'Asia Miles',
      pointsRequired: 2,
      milesReceived: 1,
    },
  ],
}

const lowFeeGarudaCard: QuizRecommendationCard = {
  id: 'low-fee-garuda',
  name: 'Low Fee Garuda Card',
  shortName: 'Low Garuda',
  bank: 'BRI',
  annualFee: 300_000,
  loungeAccess: false,
  travelInsurance: false,
  earningRates: [
    {
      transactionType: 'local',
      spendPerPoint: 12_000,
      pointsEarned: 1,
    },
    {
      transactionType: 'overseas',
      spendPerPoint: 12_000,
      pointsEarned: 1,
    },
  ],
  transferPartners: [
    {
      program: 'GarudaMiles',
      pointsRequired: 1,
      milesReceived: 1,
    },
  ],
}

const flexibleAsiaMilesCard: QuizRecommendationCard = {
  id: 'flexible-asia-miles',
  name: 'Flexible Asia Miles Card',
  shortName: 'Flex Asia',
  bank: 'Citi',
  annualFee: 1_500_000,
  loungeAccess: false,
  travelInsurance: true,
  earningRates: [
    {
      transactionType: 'online',
      spendPerPoint: 6_000,
      pointsEarned: 1,
    },
    {
      transactionType: 'local',
      spendPerPoint: 10_000,
      pointsEarned: 1,
    },
  ],
  transferPartners: [
    {
      program: 'Asia Miles',
      pointsRequired: 1,
      milesReceived: 1,
    },
    {
      program: 'British Airways',
      pointsRequired: 1,
      milesReceived: 1,
    },
  ],
}

const cards = [lowFeeGarudaCard, premiumKrisFlyerCard, flexibleAsiaMilesCard]

describe('recommendCardsFromQuiz', () => {
  it('should rank preferred airline and travel benefits highest for premium travel answers', () => {
    const answers: QuizAnswers = {
      monthlySpend: '20m-40m',
      largestCategory: 'travel',
      destination: 'north-asia',
      airlinePreference: 'singapore-airlines',
      overseasFrequency: 'frequent',
      loungeImportance: 'important',
      annualFeeTolerance: '3m-8m',
      redemptionTarget: 'long-haul-business',
    }

    const recommendations = recommendCardsFromQuiz(answers, cards)

    expect(recommendations).toHaveLength(3)
    expect(recommendations[0]).toMatchObject({
      cardId: 'premium-krisflyer',
      bestProgram: 'KrisFlyer',
      rating: 'Excellent',
    })
    expect(recommendations[0].score).toBeGreaterThan(recommendations[1].score)
    expect(recommendations[0].matchReasons).toContain(
      'Earning rate masuk zona value tinggi.',
    )
  })

  it('should favor low annual fee cards when user asks for simple value', () => {
    const answers: QuizAnswers = {
      monthlySpend: '5m-10m',
      largestCategory: 'daily',
      destination: 'domestic',
      airlinePreference: 'flexible',
      overseasFrequency: 'never',
      loungeImportance: 'not-important',
      annualFeeTolerance: 'free-low',
      redemptionTarget: 'simple-cashback',
    }

    const recommendations = recommendCardsFromQuiz(answers, cards)

    expect(recommendations[0].cardId).toBe('low-fee-garuda')
    expect(recommendations[0].annualFee).toBeLessThanOrEqual(500_000)
  })

  it('should respect the requested result limit', () => {
    const recommendations = recommendCardsFromQuiz({}, cards, 2)

    expect(recommendations).toHaveLength(2)
  })
})
