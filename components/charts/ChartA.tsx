'use client';
import styles from '@/styles/charts/ChartA.module.css';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/shadcn/chart-ui"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card } from "@/components/ui/shadcn/card-ui"
import Image from 'next/image';

interface DefaultProps {
  className?: string;
}

const ChartA = (
  props: DefaultProps
) => {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
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
    <Card className={`${props.className}`}>
      <div className={styles.header}>
        <Image
          src={'/icons/watch-icon.svg'}
          width={60}
          height={60}
          alt='watch icon'
        />
        <div className={styles.subheader}>
          <div className={styles.textBlock}>
            <p className="text-secondary">
              Price evolution
            </p>
            <p className="text-secondary">
              Watches
            </p>
          </div>
          <div className={styles.textBlock}>
            <p className="text-secondary">
              This month
            </p>
            <p className="text-secondary">
              +60%
            </p>
          </div>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          {/* <CartesianGrid vertical={false} /> */}
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            className="text-secondary"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {/* <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} /> */}
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
        </BarChart>
      </ChartContainer>
      <div className={styles.footer}>
        <p className="text-secondary text-lg">
          All time:
        </p>
        <p className="text-secondary text-2xl">
          +1453%
        </p>
      </div>
    </Card>
  );
};

export default ChartA;
