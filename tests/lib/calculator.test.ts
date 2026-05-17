import { describe, expect, it } from 'vitest'
import { calculateMiles, compareCards, getRating } from '#/lib/calculator'

describe('calculateMiles', () => {
  it('should calculate miles when all conversion inputs are valid', () => {
    expect(
      calculateMiles({
        amount: 1_500_000,
        spendPerPoint: 10_000,
        pointsEarned: 1,
        pointsRequired: 1,
        milesReceived: 1,
      }),
    ).toEqual({
      points: 150,
      miles: 150,
      idrPerMile: 10_000,
    })
  })

  it('should round up points and miles when inputs create fractions', () => {
    expect(
      calculateMiles({
        amount: 15_001,
        spendPerPoint: 10_000,
        pointsEarned: 1,
        pointsRequired: 2,
        milesReceived: 1,
      }),
    ).toEqual({
      points: 2,
      miles: 1,
      idrPerMile: 15_001,
    })
  })

  it('should return an empty result when any required input is non-positive', () => {
    expect(
      calculateMiles({
        amount: 0,
        spendPerPoint: 10_000,
        pointsEarned: 1,
        pointsRequired: 1,
        milesReceived: 1,
      }),
    ).toEqual({
      points: 0,
      miles: 0,
      idrPerMile: null,
    })
  })
})

describe('getRating', () => {
  it('should classify each rating boundary correctly', () => {
    expect(getRating(7_500)).toBe('Excellent')
    expect(getRating(7_501)).toBe('Very Good')
    expect(getRating(12_500)).toBe('Very Good')
    expect(getRating(12_501)).toBe('Good')
    expect(getRating(20_000)).toBe('Good')
    expect(getRating(20_001)).toBe('Average')
    expect(getRating(30_000)).toBe('Average')
    expect(getRating(30_001)).toBe('Poor')
  })
})

describe('compareCards', () => {
  it('should rank cards by lower idr per mile and place invalid results last', () => {
    expect(
      compareCards([
        {
          cardId: 'average',
          cardName: 'Average Card',
          amount: 1_000_000,
          spendPerPoint: 10_000,
          pointsEarned: 1,
          pointsRequired: 2,
          milesReceived: 1,
        },
        {
          cardId: 'best',
          cardName: 'Best Card',
          amount: 1_000_000,
          spendPerPoint: 5_000,
          pointsEarned: 1,
          pointsRequired: 1,
          milesReceived: 1,
        },
        {
          cardId: 'invalid',
          cardName: 'Invalid Card',
          amount: 0,
          spendPerPoint: 10_000,
          pointsEarned: 1,
          pointsRequired: 1,
          milesReceived: 1,
        },
      ]).map((result) => result.cardId),
    ).toEqual(['best', 'average', 'invalid'])
  })
})
