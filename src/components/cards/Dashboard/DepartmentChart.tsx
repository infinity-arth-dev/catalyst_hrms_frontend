"use client";

import { useState } from "react";
import { PieChart } from "lucide-react";
import { useDepartmentStats } from "@/hooks/dashboard-hooks/useDepartmentStats";

// Colours based on the logo (blue, orange and their shades)
const PALETTE = ["#05ABF0", "#F95F21", "#0382BD", "#FB9A6C", "#7DD3F7", "#C2410C", "#0E7490", "#FDBA74"];

export default function DepartmentChart() {
  const { chartData, totalEmployees, loading } = useDepartmentStats();
  const [hovered, setHovered] = useState<number | null>(null);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offsetDeg = 0;
  const active = hovered !== null ? chartData[hovered] : null;

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-white/10 p-4 sm:p-5 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Staff by department</h3>

      {loading ? (
        <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center gap-2 text-gray-400">
          <div className="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center text-center">
          <div className="bg-brand-blue/10 p-3 rounded-full mb-3 text-brand-blue">
            <PieChart className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">No department data</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Departments will show here once added.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 flex-1">
          {/* Donut */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {active ? active.value : totalEmployees}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[90px] leading-tight mt-0.5">
                {active ? active.label : "Total staff"}
              </span>
            </div>

            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="16" stroke="currentColor" className="text-gray-100 dark:text-white/5" />
              {chartData.map((item, i) => {
                const dash = (item.percentage / 100) * circumference;
                const rot = offsetDeg;
                offsetDeg += (item.percentage / 100) * 360;
                const isHover = hovered === i;
                const dim = hovered !== null && !isHover;
                return (
                  <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={PALETTE[i % PALETTE.length]}
                    strokeWidth={isHover ? 22 : 16}
                    strokeDasharray={`${Math.max(dash - 2, 0)} ${circumference}`}
                    className={`cursor-pointer transition-all duration-300 ${dim ? "opacity-25" : ""}`}
                    style={{ transformOrigin: "center", transformBox: "fill-box", transform: `rotate(${rot}deg)` }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setHovered(isHover ? null : i)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-1">
            {chartData.map((item, i) => (
              <li
                key={item.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm cursor-pointer transition ${
                  hovered === i ? "bg-gray-50 dark:bg-white/5" : ""
                } ${hovered !== null && hovered !== i ? "opacity-50" : ""}`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                  <span className="truncate text-gray-600 dark:text-gray-300">{item.label}</span>
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}