'use client';
import { useState } from 'react';
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, Area, AreaChart } from "recharts"
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card-ui"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/shadcn/chart-ui"
const chartData = [
  { date: "2024-08-30", watches: 222, cars: 150, stocks: 100 },
  { date: "2024-08-31", watches: 220, cars: 155, stocks: 110 },
  { date: "2024-09-01", watches: 230, cars: 160, stocks: 120 },
  { date: "2024-09-02", watches: 240, cars: 170, stocks: 130 },
  { date: "2024-09-03", watches: 250, cars: 180, stocks: 140 },
  { date: "2024-09-04", watches: 220, cars: 90, stocks: 50 },
  { date: "2024-09-05", watches: 270, cars: 200, stocks: 160 },
  { date: "2024-09-06", watches: 280, cars: 210, stocks: 170 },
  { date: "2024-09-07", watches: 290, cars: 220, stocks: 180 },
  { date: "2024-09-08", watches: 300, cars: 230, stocks: 190 },
  { date: "2024-09-09", watches: 310, cars: 240, stocks: 200 },
  { date: "2024-09-10", watches: 320, cars: 250, stocks: 210 },
  { date: "2024-09-11", watches: 330, cars: 260, stocks: 220 },
  { date: "2024-09-12", watches: 40, cars: 70, stocks: 30 },
  { date: "2024-09-13", watches: 350, cars: 280, stocks: 240 },
  { date: "2024-09-14", watches: 360, cars: 290, stocks: 250 },
  { date: "2024-09-15", watches: 370, cars: 300, stocks: 260 },
  { date: "2024-09-16", watches: 380, cars: 310, stocks: 270 },
  { date: "2024-09-17", watches: 390, cars: 320, stocks: 280 },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  watches: {
    label: "Watches",
    color: "hsl(var(--chart-1))",
  },
  cars: {
    label: "Cars",
    color: "hsl(var(--chart-3))",
  },
  stocks: {
    label: "S&P 500",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface DefaultProps {
  className?: string;
}

const ChartC = (
  props: DefaultProps
) => {
  const [timeRange, setTimeRange] = useState("90d")
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })
  return (
    <Card
      className={`${props.className}`}
    >
      <CardHeader>
        <CardTitle className='flex flex-col justify-left items-left w-full text-left text-secondary mb-4 gap-4'>
          <p>
            Last 6 years Market Cap luxury assets
          </p>
          <div className='flex flex-row items-center w-full justify-between'>
            <div className='flex flex-col'>
             <p className='text-xs'>Current value</p>
             <p className='text-2xl'>
                $40B
                <span className='text-xs mx-2'>
                    +$3B Last Year
                </span>
             </p>
            </div>
            <div className='flex flex-col'>
             <p className='text-xs'>1Y evolution</p>
             <p className='text-2xl'>
                +60%
                <span className='text-xs mx-2'>
                  +456% since 2018
                </span>
             </p>
            </div>
            <div className='flex flex-col'>
             <p className='text-xs'>Top performing assets</p>
             <p className='text-2xl'>
                Watches
                <span className='text-xs mx-2'>
                    Rolex & Patek
                </span>
             </p>
            </div>
          </div>
        </CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[105px] md:h-[220px] w-full"
      >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="watches"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="cars"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--chart-2)"
              stackId="a"
            />
            <Area
              dataKey="stocks"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--chart-3)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-lg">
        <div className="flex gap-2 font-medium leading-none text-secondary">
          Watches
        </div>
        <div className="flex gap-2 leading-none text-muted-foreground text-5xl text-secondary">
          +60%
        </div>
      </CardFooter> */}
    </Card>
  )
}


export default ChartC;
