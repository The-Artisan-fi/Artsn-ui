'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/shadcn/card-ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs-ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', value: 5290 },
  { name: 'Feb', value: 7410 },
  { name: 'Mar', value: 10120 },
  { name: 'Apr', value: 12800 },
  { name: 'May', value: 14124 },
  { name: 'Jun', value: 13390 },
  { name: 'Jul', value: 13924 },
];

const PortfolioGraph = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <Card className=" rounded-3xl w-full bg-bg text-secondary border-zinc-300 dark:border-zinc-700">
      <CardContent className="p-6">
        <div className="flex flex-col-reverse md:flex-row justify-between gap-4 md:gap-10 items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary ">
            Wallet Value
          </h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="range">Range</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-2 gap-10 my-8">
          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Current Value
              </p>
              <h1 className="text-3xl text-secondary">$13,924</h1>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
              +123$
            </p>
          </div>
          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                All time high
              </p>
              <h1 className="text-3xl text-secondary">$14,124</h1>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
              54 days ago
            </p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioGraph;