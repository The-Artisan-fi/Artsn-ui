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
  const [timeRange, setTimeRange] = useState('5Y')

  // Memoize filtered data
  const filteredData = useMemo(() => {
    return chartData.filter((item) => {
      const date = new Date(item.date)
      const now = new Date()
      let yearsToSubtract = 5

      switch (timeRange) {
        case '1Y':
          yearsToSubtract = 1
          break
        case '3Y':
          yearsToSubtract = 3
          break
        case 'ALL':
          return true
        default:
          yearsToSubtract = 5
      }

      const cutoffDate = new Date()
      cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsToSubtract)
      return date >= cutoffDate
    })
  }, [timeRange])

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

  // Memoize ChartTooltipContent
  const tooltipContent = useMemo(
    () => (
      <ChartTooltipContent
        labelFormatter={tooltipLabelFormatter}
        formatter={tooltipFormatter}
        indicator="dot"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          padding: '8px 12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
    ),
    [tooltipFormatter]
  )

  // Memoize ChartLegendContent
  const legendContent = useMemo(
    () => (
      <ChartLegendContent>
        <div style={{ color: '#D4AF37' }}>Watches</div>
        <div style={{ color: '#3B3B3D' }}>Cars</div>
        <div style={{ color: '#936B45' }}>S&P 500</div>
      </ChartLegendContent>
    ),
    []
  )
  return (
    <Card className={`${props.className}`}>
      <CardHeader>
        <CardTitle className="justify-left items-left mb-4 flex w-full flex-col gap-4 text-left text-secondary">
          <p>{`Luxury Asset Performance Comparison (2018-2024)`}</p>
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xs">Current Market Value</p>
              <p className="text-xl">
                $35B
                <span className="mx-2 text-xs">Total Market</span>
              </p>
              <p className="text-xl">
                +$3B
                <span className="mx-2 text-xs">Previous Year</span>
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs">Market Performance </p>
              <p className="text-xl">
                +20%
                <span className="mx-2 text-xs">Annual Growth</span>
              </p>
              <p className="text-xl">
                +207%
                <span className="mx-2 text-xs">Since 2018</span>
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs">Top performing segments</p>
              <p className="text-xl">Premium Timepieces</p>
              <p className="text-sm">(Patek Philippe & Rolex)</p>
            </div>
          </div>
        </CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[105px] w-full md:h-[220px]"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWatches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillCars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B3B3D" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B3B3D" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillStocks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#936B45" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#936B45" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={true}
              tickMargin={12}
              minTickGap={50}
              tickFormatter={dateFormatter}
              style={{
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                color: '#6B7280',
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              // axisLineColor="#E5E7EB"
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              style={{
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                color: '#6B7280',
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                  }}
                  formatter={(value, name) => {
                    // Calculate percentage from baseline (100)
                    const baselineValue = 100
                    const percentageChange =
                      ((Number(value) - baselineValue) / baselineValue) * 100

                    // Format based on asset type
                    switch (name) {
                      case 'Watches':
                        return [
                          `${percentageChange.toFixed(1)}%`,
                          'Watches Performance',
                        ]
                      case 'Cars':
                        return [
                          `${percentageChange.toFixed(1)}%`,
                          'Classic Cars',
                        ]
                      case 'stocks':
                        return [`${percentageChange.toFixed(1)}%`, 'S&P 500']
                      default:
                        return [`${percentageChange.toFixed(1)}%`, name]
                    }
                  }}
                  indicator="dot"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              }
            />

            <ReferenceLine
              x="2020-03"
              stroke="#CBD5E1"
              strokeDasharray="3 3"
              label={{
                value: 'COVID Impact',
                position: 'top',
                style: { fontSize: '12px', fill: '#6B7280' },
              }}
            />

            <ReferenceDot
              x="2022-06"
              y={347}
              r={4}
              fill="#D4AF37"
              stroke="none"
              label={{
                value: 'Peak Performance',
                position: 'top',
                style: { fontSize: '12px', fill: '#6B7280' },
              }}
            />

            {/* <Area
              dataKey="watches"
              type="monotone" // Changed from natural for smoother lines
              fill="url(#fillWatches)"
              stroke="#D4AF37"
              strokeWidth={2}
              activeDot={{
                r: 6,
                stroke: "#D4AF37",
                strokeWidth: 2,
                fill: "white"
              }}
            /> */}
            <Area
              dataKey="watches"
              type="monotone"
              fill="url(#fillWatches)"
              stroke="#D4AF37"
              strokeWidth={2}
              isAnimationActive={false}
              activeDot={{
                r: 6,
                stroke: '#D4AF37',
                strokeWidth: 2,
                fill: 'white',
              }}
              name="Watches"
            />
            <Area
              dataKey="cars"
              type="monotone"
              fill="url(#fillCars)"
              stroke="#3B3B3D"
              strokeWidth={2}
              isAnimationActive={false}
              activeDot={{
                r: 6,
                stroke: '#3B3B3D',
                strokeWidth: 2,
                fill: 'white',
              }}
              name="Cars"
            />
            <Area
              dataKey="stocks"
              type="monotone"
              fill="url(#fillStocks)"
              stroke="#936B45"
              strokeWidth={2}
              isAnimationActive={false}
              activeDot={{
                r: 6,
                stroke: '#936B45',
                strokeWidth: 2,
                fill: 'white',
              }}
              name="S&P 500"
            />
            <ChartLegend
              content={
                <ChartLegendContent>
                  <div style={{ color: '#D4AF37' }}>Watches</div>
                  <div style={{ color: '#3B3B3D' }}>Cars</div>
                  <div style={{ color: '#936B45' }}>S&P 500</div>
                </ChartLegendContent>
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium">Best Performer</p>
            <p className="text-2xl font-bold text-[#D4AF37]">+207%</p>
            <p className="text-xs text-gray-500">Premium Watches</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Market Size</p>
            <p className="text-2xl font-bold">$35B</p>
            <p className="text-xs text-gray-500">Total Value</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Annual Growth</p>
            <p className="text-2xl font-bold">+20%</p>
            <p className="text-xs text-gray-500">Year over Year</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <p>Data sources: Knight Frank Luxury Investment Index, HAGI Index</p>
          <p>* Past performance does not guarantee future returns</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ChartC
