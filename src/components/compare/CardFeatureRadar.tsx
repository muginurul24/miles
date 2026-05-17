import { RadarComparisonChart } from '#/components/charts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import type { ChartDatum, ChartSeries } from '#/components/charts'
import type { CalculatorCard } from '#/server/repositories/calculator.repo'
import type { ReactElement } from 'react'

export interface CardFeatureRadarResult {
  card: CalculatorCard
  idrPerMile: number | null
}

interface CardFeatureRadarProps {
  results: CardFeatureRadarResult[]
}

export function CardFeatureRadar({
  results,
}: CardFeatureRadarProps): ReactElement {
  const series = buildSeries(results)
  const data = buildRadarData(results)

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary">
          Feature comparison radar
        </CardTitle>
        <CardDescription>
          Membandingkan value miles, biaya tahunan, lounge, travel insurance,
          dan airport transfer dalam skor 0–100.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadarComparisonChart data={data} series={series} />
      </CardContent>
    </Card>
  )
}

function buildSeries(results: CardFeatureRadarResult[]): ChartSeries[] {
  return results.map((result, index) => ({
    key: result.card.id,
    label: result.card.shortName,
    color: `var(--chart-${(index % 5) + 1})`,
  }))
}

function buildRadarData(results: CardFeatureRadarResult[]): ChartDatum[] {
  return [
    buildFeatureRow('Miles value', results, getMilesValueScore),
    buildFeatureRow('Annual fee', results, (result) =>
      getAnnualFeeScore(result.card.annualFee),
    ),
    buildFeatureRow('Lounge', results, (result) =>
      getBooleanFeatureScore(result.card.loungeAccess),
    ),
    buildFeatureRow('Insurance', results, (result) =>
      getBooleanFeatureScore(result.card.travelInsurance),
    ),
    buildFeatureRow('Airport transfer', results, (result) =>
      getBooleanFeatureScore(result.card.airportTransfer),
    ),
  ]
}

function buildFeatureRow(
  label: string,
  results: CardFeatureRadarResult[],
  getScore: (result: CardFeatureRadarResult) => number,
): ChartDatum {
  const row: ChartDatum = { label }

  for (const result of results) {
    row[result.card.id] = getScore(result)
  }

  return row
}

function getMilesValueScore(result: CardFeatureRadarResult): number {
  const idrPerMile = result.idrPerMile

  if (idrPerMile === null) {
    return 0
  }

  if (idrPerMile <= 7_500) {
    return 100
  }

  if (idrPerMile <= 12_500) {
    return 82
  }

  if (idrPerMile <= 20_000) {
    return 64
  }

  if (idrPerMile <= 30_000) {
    return 46
  }

  return 25
}

function getAnnualFeeScore(annualFee: number): number {
  if (annualFee <= 0) {
    return 100
  }

  if (annualFee <= 500_000) {
    return 90
  }

  if (annualFee <= 1_500_000) {
    return 75
  }

  if (annualFee <= 3_000_000) {
    return 55
  }

  if (annualFee <= 6_000_000) {
    return 35
  }

  return 20
}

function getBooleanFeatureScore(value: boolean): number {
  return value ? 100 : 20
}
