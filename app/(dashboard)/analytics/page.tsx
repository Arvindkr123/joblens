"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

type AnalyticsData = {
  total: number
  statusCounts: Record<string, number>
  priorityCounts: Record<string, number>
  weekly: { week: string; count: number }[]
  responseRate: number
  offerRate: number
  topCompanies: { name: string; count: number }[]
  totalApplied: number
  totalResponded: number
}

const STATUS_COLORS: Record<string, string> = {
  WISHLIST:  "#94a3b8",
  APPLIED:   "#3b82f6",
  INTERVIEW: "#f59e0b",
  OFFER:     "#22c55e",
  REJECTED:  "#ef4444",
}

const STATUS_LABELS: Record<string, string> = {
  WISHLIST:  "Wishlist",
  APPLIED:   "Applied",
  INTERVIEW: "Interview",
  OFFER:     "Offer",
  REJECTED:  "Rejected",
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH:   "#ef4444",
  MEDIUM: "#f59e0b",
  LOW:    "#94a3b8",
}

function StatCard({
  label,
  value,
  sub,
  color = "text-gray-900",
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.total === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No data yet</h2>
        <p className="text-gray-500 text-sm">
          Add some applications from the board to see your analytics.
        </p>
      </div>
    )
  }

  const statusData = Object.entries(data.statusCounts).map(([key, value]) => ({
    name: STATUS_LABELS[key] ?? key,
    value,
    color: STATUS_COLORS[key] ?? "#94a3b8",
  }))

  const priorityData = Object.entries(data.priorityCounts).map(([key, value]) => ({
    name: key.charAt(0) + key.slice(1).toLowerCase(),
    value,
    color: PRIORITY_COLORS[key] ?? "#94a3b8",
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Insights from your job search
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total applications"
          value={data.total}
          color="text-gray-900"
        />
        <StatCard
          label="Response rate"
          value={`${data.responseRate}%`}
          sub={`${data.totalResponded} of ${data.totalApplied} got a response`}
          color="text-blue-600"
        />
        <StatCard
          label="Offer rate"
          value={`${data.offerRate}%`}
          sub="Applications that led to offers"
          color="text-green-600"
        />
        <StatCard
          label="Interviews"
          value={data.statusCounts["INTERVIEW"] ?? 0}
          sub={`${data.statusCounts["OFFER"] ?? 0} offer(s) received`}
          color="text-yellow-600"
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Status breakdown — pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Status breakdown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #f1f5f9",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority breakdown — bar */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Priority breakdown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #f1f5f9",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications over time — line */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Applications over time
          </h2>
          {data.weekly.length < 2 ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">
              Add more applications to see the trend
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top companies */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Top companies
          </h2>
          {data.topCompanies.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.topCompanies}
                layout="vertical"
                barSize={20}
                margin={{ left: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Application funnel
        </h2>
        <div className="flex items-end gap-2 h-32">
          {statusData.map((s) => {
            const pct = data.total > 0 ? (s.value / data.total) * 100 : 0
            return (
              <div key={s.name} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs text-gray-500 font-medium">{s.value}</span>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(pct, 4)}%`,
                    backgroundColor: s.color,
                    minHeight: s.value > 0 ? "8px" : "0px",
                  }}
                />
                <span className="text-xs text-gray-500 truncate w-full text-center">
                  {s.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}