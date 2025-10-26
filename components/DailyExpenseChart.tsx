"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyExpenseChartProps {
  dailyTotals: Record<number, number>;
  month: number;
  year: number;
}

export default function DailyExpenseChart({
  dailyTotals,
  month,
  year,
}: DailyExpenseChartProps) {
  // Get number of days in month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create data for all days
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      day: day.toString(),
      amount: dailyTotals[day] || 0,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Expenses</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#888"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: any) => [
              `₹${value.toLocaleString("en-IN")}`,
              "Amount",
            ]}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Bar
            dataKey="amount"
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
