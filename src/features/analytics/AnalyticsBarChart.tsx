// src/features/analytics/AnalyticsBarChart.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export type DailyData = {
  day: string;
  views: number;
  bookings: number;
};

interface AnalyticsBarChartProps {
  data: DailyData[];
  mode: "day" | "week" | "month";
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfMonth = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const hourlyGroups = ["00-03", "04-07", "08-11", "12-15", "16-19", "20-23"];

const groupHourlyData = (data: DailyData[]): DailyData[] =>
  hourlyGroups.map((range) => {
    const [start, end] = range.split("-").map(Number);
    const groupData = data.filter((d) => {
      const hour = Number(d.day);
      return hour >= start && hour <= end;
    });
    const views = groupData.reduce((sum, d) => sum + d.views, 0);
    const bookings = groupData.reduce((sum, d) => sum + d.bookings, 0);
    return { day: range, views, bookings };
  });

const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({ data, mode }) => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsSmall(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const mergedData: DailyData[] = useMemo(() => {
    if (mode === "day") return groupHourlyData(data);
    const labels = mode === "week" ? daysOfWeek : daysOfMonth;
    return labels.map((label) => {
      const match = data.find(
        (d) => d.day.padStart(2, "0") === label || d.day === label
      );
      return {
        day: label,
        views: match?.views ?? 0,
        bookings: match?.bookings ?? 0,
      };
    });
  }, [data, mode]);

  const perBar = isSmall ? 36 : 70; // width per bar incl. gap
  const minChartWidth = Math.max(480, mergedData.length * perBar + 60);

  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: { value?: number }[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-md text-sm text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
            {label}
          </p>
          <div className="flex justify-between gap-4 ">
            <span className="text-gray-500 dark:text-gray-400">Page Views</span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {payload[0]?.value ?? 0}
            </span>
          </div>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-gray-500 dark:text-gray-400">
              Service Requests sdfdf
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {payload[1]?.value ?? 0}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div >
      <div className="max-w-2xs">
        <div style={{ minWidth: `${minChartWidth}px` }}>
          <div className={isSmall ? "h-[240px]" : "h-[350px]"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mergedData}
                margin={{ top: 16, right: 0, left: 0, bottom: isSmall ? 28 : 30 }}
                barCategoryGap={isSmall ? "12%" : "6%"}
                barGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbdde6ff" />
                <XAxis
                  dataKey="day"
                  interval={0}
                  padding={{ left: 0, right: 0 }}     // remove left space
                  tick={{ fontSize: isSmall ? 10 : 11 }}
                  angle={isSmall ? -20 : 0}
                  textAnchor={isSmall ? "end" : "middle"}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                  tick={{ fontSize: isSmall ? 10 : 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 8 }}
                />
                <Bar
                  dataKey="views"
                  name="Page Views"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={isSmall ? 18 : 28}
                />
                <Bar
                  dataKey="bookings"
                  name="Service Requests"
                  fill="#11b34cff"
                  radius={[6, 6, 0, 0]}
                  barSize={isSmall ? 18 : 28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBarChart;
