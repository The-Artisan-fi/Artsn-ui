'use client';
import styles from '@/styles/charts/ChartA.module.css';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/shadcn/chart-ui"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/shadcn/card-ui"
import Image from 'next/image';
const ProductChart = () => {
  const chartData = [
    { month: "September", mobile: 80 },
    { month: "October", mobile: 200 },
    { month: "November", mobile: 120 },
    { month: "December", mobile: 190 },
    { month: "January", mobile: 130 },
    { month: "February", mobile: 140 },
    { month: "March", mobile: 140 },
  ]
   
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "lightgrey",
    },
  } satisfies ChartConfig
  return (
        <ChartContainer config={chartConfig} className='mb-6 mt-8'>
          <BarChart accessibilityLayer data={chartData}>
            {/* <CartesianGrid vertical={false} /> */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
          </BarChart>
        </ChartContainer>

  )
};

export default ProductChart;
