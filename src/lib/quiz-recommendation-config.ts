import type { QuizAnswers } from '#/lib/quiz'

const monthlySpendByAnswer = {
  'under-5m': 4_000_000,
  '5m-10m': 7_500_000,
  '10m-20m': 15_000_000,
  '20m-40m': 30_000_000,
  'over-40m': 50_000_000,
} satisfies Record<string, number>

export const annualFeeLimitByAnswer = {
  'free-low': 500_000,
  'under-1m': 1_000_000,
  '1m-3m': 3_000_000,
  '3m-8m': 8_000_000,
  'value-based': Number.POSITIVE_INFINITY,
} satisfies Record<string, number>

const categoryTransactionType = {
  daily: 'local',
  dining: 'dining',
  online: 'online',
  travel: 'travel',
  business: 'local',
} satisfies Record<string, string>

const airlineProgram = {
  garuda: 'GarudaMiles',
  'singapore-airlines': 'KrisFlyer',
  cathay: 'Asia Miles',
  'middle-east': 'Emirates Skywards',
} satisfies Record<string, string>

const destinationPrograms = {
  domestic: ['GarudaMiles'],
  'southeast-asia': ['KrisFlyer', 'Asia Miles'],
  'north-asia': ['KrisFlyer', 'Asia Miles'],
  europe: ['KrisFlyer', 'Emirates Skywards', 'British Airways'],
  'usa-australia': ['KrisFlyer', 'Asia Miles', 'Emirates Skywards'],
} satisfies Record<string, string[]>

export function getAnnualSpend(answers: QuizAnswers): number {
  const monthlySpend = answers.monthlySpend
    ? monthlySpendByAnswer[answers.monthlySpend]
    : monthlySpendByAnswer['10m-20m']

  return monthlySpend * 12
}

export function getPrimaryTransactionType(answers: QuizAnswers): string {
  if (
    answers.overseasFrequency === 'monthly' ||
    answers.overseasFrequency === 'frequent'
  ) {
    return 'overseas'
  }

  return answers.largestCategory
    ? categoryTransactionType[answers.largestCategory]
    : 'local'
}

export function getPreferredPrograms(answers: QuizAnswers): string[] {
  const programs = new Set<string>()

  if (
    answers.airlinePreference &&
    answers.airlinePreference !== 'flexible' &&
    airlineProgram[answers.airlinePreference]
  ) {
    programs.add(airlineProgram[answers.airlinePreference])
  }

  if (answers.destination) {
    for (const program of destinationPrograms[answers.destination] ?? []) {
      programs.add(program)
    }
  }

  return [...programs]
}
