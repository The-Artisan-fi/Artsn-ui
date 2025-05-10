'use client'
import { useState, useMemo, useCallback } from 'react'
import { TrendingUp } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Area,
  AreaChart,
  YAxis,
  ReferenceDot,
  ReferenceLine,
} from 'recharts'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Formatter } from 'recharts/types/component/DefaultLegendContent'

const chartData = [
  // Starting 2018 baseline (100%)
  { date: '2018-01', watches: 100, cars: 100, stocks: 100 },
  { date: '2018-06', watches: 115, cars: 110, stocks: 104 },
  { date: '2018-12', watches: 130, cars: 125, stocks: 108 },

  // 2019 (20% annual growth for watches)
  { date: '2019-06', watches: 150, cars: 140, stocks: 112 },
  { date: '2019-12', watches: 170, cars: 155, stocks: 116 },

  // 2020 (COVID impact)
  { date: '2020-06', watches: 180, cars: 145, stocks: 110 },
  { date: '2020-12', watches: 195, cars: 160, stocks: 120 },

  // 2021 (Strong recovery)
  { date: '2021-06', watches: 220, cars: 190, stocks: 125 },
  { date: '2021-12', watches: 245, cars: 220, stocks: 130 },

  // 2022 (Peak year - watches +18%, cars +25%)
  { date: '2022-06', watches: 270, cars: 250, stocks: 134 },
  { date: '2022-12', watches: 290, cars: 275, stocks: 138 },

  // 2023 (Market adjustment - HAGI shows -7.74% YTD for cars)
  { date: '2023-06', watches: 295, cars: 260, stocks: 142 },
  { date: '2023-12', watches: 307, cars: 254, stocks: 146 },
]
const chartConfig = {
  watches: {
    label: 'Watches',
    color: '#D4AF37', // Luxury gold
  },
  cars: {
    label: 'Cars',
    color: '#3B3B3D', // Rich dark gray
  },
  stocks: {
    label: 'S&P 500',
    color: '#936B45', // Warm bronze
  },
} satisfies ChartConfig

// Memoize formatter functions
const dateFormatter = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}

const tooltipLabelFormatter = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

interface DefaultProps {
  className?: string
}

const ChartC = (props: DefaultProps) => {
  // Remove timeRange state and use all data directly
  const filteredData = useMemo(() => chartData, []);

  // Memoize tooltip formatter
  const tooltipFormatter = useCallback((value: any, name: any) => {
    const baselineValue = 100
    const percentageChange =
      ((Number(value) - baselineValue) / baselineValue) * 100

    switch (name) {
      case 'Watches':
        return [`${percentageChange.toFixed(1)}%`, 'Watches Performance']
      case 'Cars':
        return [`${percentageChange.toFixed(1)}%`, 'Classic Cars']
      case 'stocks':
        return [`${percentageChange.toFixed(1)}%`, 'S&P 500']
      default:
        return [`${percentageChange.toFixed(1)}%`, name]
    }
  }, [])

  return (
    <Card className={`${props.className} overflow-hidden border-0 shadow-md bg-white/90 backdrop-blur-sm`}>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start w-full">
          <CardTitle className="justify-left items-left mb-4 flex w-full flex-col gap-2 text-left">
            <p className="text-xl font-bold text-secondary tracking-tight">Luxury Asset Performance Comparison</p>
            <p className="text-sm font-medium text-muted-foreground">2018-2024</p>
          </CardTitle>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="flex flex-col p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-muted-foreground">Current Market Value</p>
            <div className="flex items-baseline">
              <p className="text-xl font-bold">$35B</p>
              <span className="mx-2 text-xs text-muted-foreground">Total Market</span>
            </div>
            <div className="flex items-baseline">
              <p className="text-lg font-semibold text-emerald-600">+$3B</p>
              <span className="mx-2 text-xs text-muted-foreground">Previous Year</span>
            </div>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-muted-foreground">Market Performance</p>
            <div className="flex items-baseline">
              <p className="text-xl font-bold text-emerald-600">+20%</p>
              <span className="mx-2 text-xs text-muted-foreground">Annual Growth</span>
            </div>
            <div className="flex items-baseline">
              <p className="text-lg font-semibold text-emerald-600">+207%</p>
              <span className="mx-2 text-xs text-muted-foreground">Since 2018</span>
            </div>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-muted-foreground">Top Performing Segments</p>
            <p className="text-xl font-bold">Premium Timepieces</p>
            <p className="text-sm text-muted-foreground">(Patek Philippe & Rolex)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[180px] w-full md:h-[300px]"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWatches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="fillCars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B3B3D" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B3B3D" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="fillStocks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#936B45" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#936B45" stopOpacity={0.01} />
              </linearGradient>
              <filter id="shadow" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
              </filter>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="5 5" stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
              tickMargin={12}
              minTickGap={50}
              tickFormatter={dateFormatter}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: '#6B7280',
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: '#6B7280',
              }}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipFormatter}
                  indicator="dot"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  }}
                />
              }
            />

            <ReferenceLine
              x="2020-03"
              stroke="rgba(203, 213, 225, 0.5)"
              strokeDasharray="3 3"
              label={{
                value: 'COVID Impact',
                position: 'top',
                style: { fontSize: '12px', fill: '#6B7280', fontWeight: 500 },
              }}
            />

            <ReferenceDot
              x="2022-06"
              y={270}
              r={6}
              fill="#D4AF37"
              stroke="white"
              strokeWidth={2}
              filter="url(#shadow)"
              label={{
                value: 'Peak Performance',
                position: 'top',
                style: { fontSize: '12px', fill: '#6B7280', fontWeight: 500 },
              }}
            />

            <Area
              dataKey="watches"
              type="natural"
              fill="url(#fillWatches)"
              stroke="#D4AF37"
              strokeWidth={3}
              animationDuration={2000}
              animationEasing="ease-in-out"
              activeDot={{
                r: 8,
                stroke: '#D4AF37',
                strokeWidth: 2,
                fill: 'white',
                strokeDasharray: '',
                filter: 'url(#shadow)'
              }}
              name="Watches"
            />
            <Area
              dataKey="cars"
              type="natural"
              fill="url(#fillCars)"
              stroke="#3B3B3D"
              strokeWidth={3}
              animationDuration={2000}
              animationBegin={300}
              animationEasing="ease-in-out"
              activeDot={{
                r: 8,
                stroke: '#3B3B3D',
                strokeWidth: 2,
                fill: 'white',
                strokeDasharray: '',
                filter: 'url(#shadow)'
              }}
              name="Cars"
            />
            <Area
              dataKey="stocks"
              type="natural"
              fill="url(#fillStocks)"
              stroke="#936B45"
              strokeWidth={3}
              animationDuration={2000}
              animationBegin={600}
              animationEasing="ease-in-out"
              activeDot={{
                r: 8,
                stroke: '#936B45',
                strokeWidth: 2,
                fill: 'white',
                strokeDasharray: '',
                filter: 'url(#shadow)'
              }}
              name="S&P 500"
            />
            <ChartLegend
              verticalAlign="top"
              align="right"
              iconSize={14}
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px' }}
              content={
                <ChartLegendContent>
                  <div className="flex gap-6 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#D4AF37' }}></div>
                      <span className="text-sm font-medium">Watches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#3B3B3D' }}></div>
                      <span className="text-sm font-medium">Cars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#936B45' }}></div>
                      <span className="text-sm font-medium">S&P 500</span>
                    </div>
                  </div>
                </ChartLegendContent>
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6 border-t pt-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium text-muted-foreground">Best Performer</p>
            <p className="text-3xl font-bold text-[#D4AF37]">+207%</p>
            <p className="text-xs text-muted-foreground">Premium Watches</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-muted-foreground">Market Size</p>
            </div>
            <div className="block md:hidden">
              <p className="text-sm font-medium text-muted-foreground">Market</p>
              <p className="text-sm font-medium text-muted-foreground">Cap Size</p>
            </div>
            <p className="text-3xl font-bold">$35B</p>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-muted-foreground">Annual Growth</p>
            </div>
            <div className="block md:hidden">
              <p className="text-sm font-medium text-muted-foreground">Annual</p>
              <p className="text-sm font-medium text-muted-foreground">Growth</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">+20%</p>
            <p className="text-xs text-muted-foreground">Year over Year</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
          <p>Data sources: Knight Frank Luxury Investment Index, HAGI Index</p>
          <p>* Past performance does not guarantee future returns</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ChartC
