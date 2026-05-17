'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '#/components/ui/chart'
import { cn } from '#/lib/utils'

import type { ChartConfig } from '#/components/ui/chart'
import type { ReactElement } from 'react'

export type ChartDatum = Record<string, number | string>

export interface ChartSeries {
  key: string
  label: string
  color?: string
}

export interface CartesianChartProps {
  data: ChartDatum[]
  series: ChartSeries[]
  categoryKey?: string
  className?: string
}

export interface PieDistributionChartProps {
  data: ChartDatum[]
  nameKey?: string
  valueKey?: string
  className?: string
}

export interface RadialProgressChartProps {
  data: ChartDatum[]
  nameKey?: string
  valueKey?: string
  className?: string
}

const DEFAULT_CATEGORY_KEY = 'label'
const DEFAULT_VALUE_KEY = 'value'

export function AreaTrendChart({
  data,
  series,
  categoryKey = DEFAULT_CATEGORY_KEY,
  className,
}: CartesianChartProps): ReactElement {
  return (
    <ChartContainer
      config={getSeriesConfig(series)}
      className={cn('h-[18rem] w-full', className)}
    >
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {series.map((item) => (
          <Area
            key={item.key}
            dataKey={item.key}
            type="natural"
            fill={`var(--color-${item.key})`}
            fillOpacity={0.18}
            stroke={`var(--color-${item.key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

export function BarMetricChart({
  data,
  series,
  categoryKey = DEFAULT_CATEGORY_KEY,
  className,
}: CartesianChartProps): ReactElement {
  return (
    <ChartContainer
      config={getSeriesConfig(series)}
      className={cn('h-[18rem] w-full', className)}
    >
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((item) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            fill={`var(--color-${item.key})`}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

export function LineTrendChart({
  data,
  series,
  categoryKey = DEFAULT_CATEGORY_KEY,
  className,
}: CartesianChartProps): ReactElement {
  return (
    <ChartContainer
      config={getSeriesConfig(series)}
      className={cn('h-[18rem] w-full', className)}
    >
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {series.map((item) => (
          <Line
            key={item.key}
            dataKey={item.key}
            type="monotone"
            stroke={`var(--color-${item.key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

export function PieDistributionChart({
  data,
  nameKey = DEFAULT_CATEGORY_KEY,
  valueKey = DEFAULT_VALUE_KEY,
  className,
}: PieDistributionChartProps): ReactElement {
  const config = getSegmentConfig(data, nameKey)

  return (
    <ChartContainer config={config} className={cn('h-[18rem]', className)}>
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius={54}>
          {data.map((item, index) => (
            <Cell
              key={`${item[nameKey]}-${index}`}
              fill={`var(--color-${getSegmentKey(item, nameKey)})`}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export function RadarComparisonChart({
  data,
  series,
  categoryKey = DEFAULT_CATEGORY_KEY,
  className,
}: CartesianChartProps): ReactElement {
  return (
    <ChartContainer
      config={getSeriesConfig(series)}
      className={cn('h-[18rem] w-full', className)}
    >
      <RadarChart data={data} accessibilityLayer>
        <PolarGrid />
        <PolarAngleAxis dataKey={categoryKey} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((item) => (
          <Radar
            key={item.key}
            dataKey={item.key}
            fill={`var(--color-${item.key})`}
            fillOpacity={0.2}
            stroke={`var(--color-${item.key})`}
          />
        ))}
      </RadarChart>
    </ChartContainer>
  )
}

export function RadialProgressChart({
  data,
  nameKey = DEFAULT_CATEGORY_KEY,
  valueKey = DEFAULT_VALUE_KEY,
  className,
}: RadialProgressChartProps): ReactElement {
  const config = getSegmentConfig(data, nameKey)

  return (
    <ChartContainer config={config} className={cn('h-[18rem]', className)}>
      <RadialBarChart
        data={data}
        innerRadius="30%"
        outerRadius="90%"
        accessibilityLayer
      >
        <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
        <RadialBar dataKey={valueKey} background>
          <LabelList dataKey={nameKey} position="insideStart" />
          {data.map((item, index) => (
            <Cell
              key={`${item[nameKey]}-${index}`}
              fill={`var(--color-${getSegmentKey(item, nameKey)})`}
            />
          ))}
        </RadialBar>
      </RadialBarChart>
    </ChartContainer>
  )
}

function getSeriesConfig(series: ChartSeries[]): ChartConfig {
  return series.reduce<ChartConfig>((config, item, index) => {
    config[item.key] = {
      label: item.label,
      color: item.color ?? `var(--chart-${(index % 5) + 1})`,
    }

    return config
  }, {})
}

function getSegmentConfig(data: ChartDatum[], nameKey: string): ChartConfig {
  return data.reduce<ChartConfig>((config, item, index) => {
    const key = getSegmentKey(item, nameKey)
    config[key] = {
      label: String(item[nameKey]),
      color: `var(--chart-${(index % 5) + 1})`,
    }

    return config
  }, {})
}

function getSegmentKey(item: ChartDatum, nameKey: string): string {
  return String(item[nameKey])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}
