import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Jan', value: 5290 },
  { name: 'Feb', value: 7410 },
  { name: 'Mar', value: 10120 },
  { name: 'Apr', value: 12800 },
  { name: 'May', value: 14124 },
  { name: 'Jun', value: 13390 },
  { name: 'Jul', value: 13924 },
]

const PortfolioGraph = () => {
  const [activeTab, setActiveTab] = useState('today')

  return (
    <div className="relative">
      <Card className="w-full rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Vault Value</h2>
              <Tabs defaultValue="today" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="range">Range</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Current Value</p>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold">$13,924</span>
                  <span className="text-sm text-green-500">+123$</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">All time high</p>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold">$14,124</span>
                  <span className="text-sm text-gray-500">54 days ago</span>
                </div>
              </div>
            </div>

            <div className="h-full md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/30 backdrop-blur-sm">
        <div className="rounded-lg bg-white/90 px-6 py-3 shadow-lg">
          <p className="text-xl font-semibold text-gray-800">
            Feature Coming Soon
          </p>
        </div>
      </div>
    </div>
  )
}

export default PortfolioGraph
