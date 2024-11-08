"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area
} from "recharts";

const data = [
  { name: "Lorem", value: 2000 },
  { name: "Lorem", value: 4000 },
  { name: "Lorem", value: 3000 },
  { name: "Lorem", value: 5000 },
  { name: "Lorem", value: 4000 },
  { name: "Lorem", value: 6000 },
  { name: "Lorem", value: 3000 },
  { name: "Lorem", value: 5000 },
  { name: "Lorem", value: 3000 },
  { name: "Lorem", value: 5000 },
  { name: "Lorem", value: 4000 },
  { name: "Lorem", value: 6000 },
];

export default function PriceHistory() {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <p>Loading chart...</p>;
  }

  return (
    <section className="bg-white rounded-3xl border-gray pt-6 pr-6 pb-3 pl-3 mb-5">
      <h2 className="text-xl pl-4 font-bold mb-5 flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.96021 2V14H14.9602"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.6268 6L10.2935 9.33333L7.62683 6.66667L5.62683 8.66667"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Price History
      </h2>

      <div className="">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#D3D3D3" />
            <XAxis dataKey="name" tick={{ fill: "#707070" }} />
            <YAxis
              tick={{ fill: "#707070" }}
              ticks={[2000, 3000, 4000, 5000, 6000, 8000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "5px 10px",
                border: "1px solid #ddd",
              }}
              formatter={(value) => [`$${value}`, "Value"]}
            />
            {/* Area to create gradient effect */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#007BFF"
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#007BFF"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
