export const RATING_LABELS = [
  'Excellent',
  'Very Good',
  'Good',
  'Average',
  'Poor',
] as const

export type RatingLabel = (typeof RATING_LABELS)[number]

export interface CalculationInput {
  amount: number
  spendPerPoint: number
  pointsEarned: number
  pointsRequired: number
  milesReceived: number
}

export interface CalculationResult {
  points: number
  miles: number
  idrPerMile: number | null
}

export interface CompareCardInput extends CalculationInput {
  cardId: string
  cardName: string
}

export interface CompareCardResult extends CalculationResult {
  cardId: string
  cardName: string
  rating: RatingLabel | null
}

function hasPositiveInputs(input: CalculationInput): boolean {
  return (
    input.amount > 0 &&
    input.spendPerPoint > 0 &&
    input.pointsEarned > 0 &&
    input.pointsRequired > 0 &&
    input.milesReceived > 0
  )
}

export function calculateMiles(input: CalculationInput): CalculationResult {
  if (!hasPositiveInputs(input)) {
    return {
      points: 0,
      miles: 0,
      idrPerMile: null,
    }
  }

  const points =
    Math.ceil(input.amount / input.spendPerPoint) * input.pointsEarned
  const miles = Math.ceil((points * input.milesReceived) / input.pointsRequired)

  return {
    points,
    miles,
    idrPerMile: Math.ceil(input.amount / miles),
  }
}

export function getRating(idrPerMile: number): RatingLabel {
  if (idrPerMile <= 7_500) {
    return 'Excellent'
  }

  if (idrPerMile <= 12_500) {
    return 'Very Good'
  }

  if (idrPerMile <= 20_000) {
    return 'Good'
  }

  if (idrPerMile <= 30_000) {
    return 'Average'
  }

  return 'Poor'
}

export function compareCards(inputs: CompareCardInput[]): CompareCardResult[] {
  return inputs
    .map((input) => {
      const calculation = calculateMiles(input)

      return {
        cardId: input.cardId,
        cardName: input.cardName,
        ...calculation,
        rating:
          calculation.idrPerMile === null
            ? null
            : getRating(calculation.idrPerMile),
      }
    })
    .sort((first, second) => {
      if (first.idrPerMile === second.idrPerMile) {
        return first.cardName.localeCompare(second.cardName)
      }

      if (first.idrPerMile === null) {
        return 1
      }

      if (second.idrPerMile === null) {
        return -1
      }

      return first.idrPerMile - second.idrPerMile
    })
}
