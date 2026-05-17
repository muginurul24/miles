import { calculateMiles, getRating } from '#/lib/calculator'
import {
  annualFeeLimitByAnswer,
  getAnnualSpend,
  getPreferredPrograms,
  getPrimaryTransactionType,
} from '#/lib/quiz-recommendation-config'

import type { RatingLabel } from '#/lib/calculator'
import type { QuizAnswers } from '#/lib/quiz'

interface QuizEarningRate {
  transactionType: string
  spendPerPoint: number
  pointsEarned: number
}

interface QuizTransferPartner {
  program: string
  pointsRequired: number
  milesReceived: number
}

export interface QuizRecommendationCard {
  id: string
  name: string
  shortName: string
  bank: string
  annualFee: number
  loungeAccess?: boolean
  travelInsurance?: boolean
  airportTransfer?: boolean
  earningRates: QuizEarningRate[]
  transferPartners: QuizTransferPartner[]
}

export interface QuizRecommendation {
  cardId: string
  cardName: string
  shortName: string
  bank: string
  annualFee: number
  score: number
  estimatedMilesPerYear: number
  bestProgram: string | null
  bestIdrPerMile: number | null
  rating: RatingLabel | null
  matchReasons: string[]
}

interface ScoredCard {
  recommendation: QuizRecommendation
  sortIdrPerMile: number
}

function findBestEarningRate(
  card: QuizRecommendationCard,
  transactionType: string,
): QuizEarningRate | null {
  const matchingRate = card.earningRates
    .filter((rate) => rate.transactionType === transactionType)
    .sort((first, second) => first.spendPerPoint - second.spendPerPoint)
    .at(0)

  if (matchingRate) {
    return matchingRate
  }

  return (
    [...card.earningRates].sort(
      (first, second) => first.spendPerPoint - second.spendPerPoint,
    )[0] ?? null
  )
}

function findBestTransferPartner(
  card: QuizRecommendationCard,
  preferredPrograms: string[],
): QuizTransferPartner | null {
  const preferredPartner = card.transferPartners.find((partner) =>
    preferredPrograms.includes(partner.program),
  )

  if (preferredPartner) {
    return preferredPartner
  }

  return (
    [...card.transferPartners].sort(
      (first, second) => first.pointsRequired - second.pointsRequired,
    )[0] ?? null
  )
}

function getEarningScore(idrPerMile: number | null): number {
  if (idrPerMile === null) {
    return 0
  }

  const rating = getRating(idrPerMile)

  if (rating === 'Excellent') return 35
  if (rating === 'Very Good') return 28
  if (rating === 'Good') return 20
  if (rating === 'Average') return 10

  return 4
}

function getAnnualFeeScore(card: QuizRecommendationCard, answers: QuizAnswers) {
  const feeLimit = answers.annualFeeTolerance
    ? annualFeeLimitByAnswer[answers.annualFeeTolerance]
    : annualFeeLimitByAnswer['1m-3m']

  if (feeLimit === Number.POSITIVE_INFINITY) {
    return card.loungeAccess || card.travelInsurance ? 14 : 8
  }

  if (card.annualFee <= feeLimit) {
    return 15
  }

  const feeOverageRatio = (card.annualFee - feeLimit) / feeLimit

  return Math.max(-20, Math.round(-8 - feeOverageRatio * 10))
}

function getLoungeScore(card: QuizRecommendationCard, answers: QuizAnswers) {
  if (
    answers.loungeImportance === 'important' ||
    answers.loungeImportance === 'must-have'
  ) {
    return card.loungeAccess ? 12 : -8
  }

  if (
    answers.loungeImportance === 'not-important' &&
    card.annualFee > 3_000_000
  ) {
    return -4
  }

  return card.loungeAccess ? 3 : 0
}

function getRedemptionScore(
  card: QuizRecommendationCard,
  answers: QuizAnswers,
  idrPerMile: number | null,
): number {
  const partnerCount = card.transferPartners.length

  if (answers.redemptionTarget === 'simple-cashback') {
    return card.annualFee <= 500_000 ? 8 : -6
  }

  if (answers.redemptionTarget === 'family-trip') {
    return partnerCount >= 3 ? 10 : 3
  }

  if (
    answers.redemptionTarget === 'long-haul-business' ||
    answers.redemptionTarget === 'regional-business'
  ) {
    return (idrPerMile !== null && idrPerMile <= 12_500 ? 8 : 0) + partnerCount
  }

  if (answers.redemptionTarget === 'hotel-lifestyle') {
    return card.travelInsurance || card.airportTransfer ? 8 : 2
  }

  return idrPerMile !== null && idrPerMile <= 20_000 ? 6 : 2
}

function getCardProgramScore(
  card: QuizRecommendationCard,
  preferredPrograms: string[],
): number {
  if (preferredPrograms.length === 0) {
    return Math.min(12, card.transferPartners.length * 3)
  }

  const matchedPrograms = card.transferPartners.filter((partner) =>
    preferredPrograms.includes(partner.program),
  )

  return matchedPrograms.length > 0 ? 18 + matchedPrograms.length * 2 : -8
}

function pushReason(
  reasons: string[],
  condition: boolean,
  reason: string,
): void {
  if (condition) {
    reasons.push(reason)
  }
}

function scoreCard(
  card: QuizRecommendationCard,
  answers: QuizAnswers,
): ScoredCard {
  const annualSpend = getAnnualSpend(answers)
  const transactionType = getPrimaryTransactionType(answers)
  const preferredPrograms = getPreferredPrograms(answers)
  const earningRate = findBestEarningRate(card, transactionType)
  const transferPartner = findBestTransferPartner(card, preferredPrograms)
  const calculation =
    earningRate && transferPartner
      ? calculateMiles({
          amount: annualSpend,
          spendPerPoint: earningRate.spendPerPoint,
          pointsEarned: earningRate.pointsEarned,
          pointsRequired: transferPartner.pointsRequired,
          milesReceived: transferPartner.milesReceived,
        })
      : { miles: 0, idrPerMile: null }
  const idrPerMile = calculation.idrPerMile
  const reasons: string[] = []
  const programScore = getCardProgramScore(card, preferredPrograms)
  const feeScore = getAnnualFeeScore(card, answers)
  const loungeScore = getLoungeScore(card, answers)
  const redemptionScore = getRedemptionScore(card, answers, idrPerMile)
  const earningScore = getEarningScore(idrPerMile)
  const milesVolumeScore = Math.min(10, Math.floor(calculation.miles / 10_000))

  pushReason(
    reasons,
    transferPartner !== null,
    `${transferPartner?.program ?? 'Transfer partner'} cocok untuk target miles.`,
  )
  pushReason(
    reasons,
    idrPerMile !== null && idrPerMile <= 12_500,
    'Earning rate masuk zona value tinggi.',
  )
  pushReason(reasons, feeScore > 0, 'Annual fee masih sesuai batas kenyamanan.')
  pushReason(
    reasons,
    loungeScore > 0,
    'Benefit lounge relevan dengan preferensi travel.',
  )

  const score =
    earningScore +
    milesVolumeScore +
    programScore +
    feeScore +
    loungeScore +
    redemptionScore

  return {
    recommendation: {
      cardId: card.id,
      cardName: card.name,
      shortName: card.shortName,
      bank: card.bank,
      annualFee: card.annualFee,
      score,
      estimatedMilesPerYear: calculation.miles,
      bestProgram: transferPartner?.program ?? null,
      bestIdrPerMile: idrPerMile,
      rating: idrPerMile === null ? null : getRating(idrPerMile),
      matchReasons: reasons.slice(0, 3),
    },
    sortIdrPerMile: idrPerMile ?? Number.POSITIVE_INFINITY,
  }
}

export function recommendCardsFromQuiz(
  answers: QuizAnswers,
  cards: QuizRecommendationCard[],
  limit = 3,
): QuizRecommendation[] {
  return cards
    .map((card) => scoreCard(card, answers))
    .sort((first, second) => {
      if (first.recommendation.score !== second.recommendation.score) {
        return second.recommendation.score - first.recommendation.score
      }

      if (first.sortIdrPerMile !== second.sortIdrPerMile) {
        return first.sortIdrPerMile - second.sortIdrPerMile
      }

      if (first.recommendation.annualFee !== second.recommendation.annualFee) {
        return first.recommendation.annualFee - second.recommendation.annualFee
      }

      return first.recommendation.cardName.localeCompare(
        second.recommendation.cardName,
      )
    })
    .slice(0, limit)
    .map((card) => card.recommendation)
}
