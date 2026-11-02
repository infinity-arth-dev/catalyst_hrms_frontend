"use client";

import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { useTotalStat } from "@/hooks/dashboard-hooks/useTotalStat";

export default function TotalStat() {
  const { chartData, loading, viewMode, setViewMode } = useTotalStat();
  const [activeLabel, setActiveLabel] = useState("");

  // Select the latest period that has data
  useEffect(() => {
    if (chartData.length > 0) {
      const last = [...chartData].reverse().find((i) => i.value !== null);
      setActiveLabel((last ?? chartData[chartData.length - 1]).label);
    }
  }, [chartData]);

  const tab = (mode: "monthly" | "yearly", text: string) => (
    <button
      onClick={() => setViewMode(mode)}
      className={`px-3 py-1.5 rounded-md transition ${
        viewMode === mode
          ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {text}
    </button>
  );

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-white/10 p-4 sm:p-5 flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Average attendance</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {viewMode === "monthly" ? "By month" : "By year"}
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg text-xs font-medium">
          {tab("monthly", "Monthly")}
          {tab("yearly", "Yearly")}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 min-h-[240px] flex flex-col items-center justify-center gap-2 text-gray-400">
          <div className="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 min-h-[240px] flex flex-col items-center justify-center text-center">
          <div className="bg-brand-blue/10 p-3 rounded-full mb-3 text-brand-blue">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">No attendance data</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Data for this period is not available yet.</p>
        </div>
      ) : (
        <div className="flex gap-3 flex-1 min-h-[240px]">
          {/* Y axis */}
          <div className="flex flex-col justify-between text-[11px] text-gray-400 pb-6 pt-1 shrink-0">
            {["100%", "75%", "50%", "25%", "0%"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          {/* Plot */}
          <div className="relative flex-1 overflow-x-auto no-scrollbar">
            <div className="relative h-full min-w-max md:min-w-0">
              {/* grid lines */}
              <div className="absolute inset-x-0 top-1 bottom-6 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-dashed border-gray-100 dark:border-white/5" />
                ))}
              </div>

              <div className="relative h-full flex items-end justify-around gap-2 px-1">
                {chartData.map((item) => {
                  const hasData = item.value !== null;
                  const pct = hasData ? Math.min(item.value as number, 100) : 0;
                  const active = hasData && activeLabel === item.label;

                  return (
                    <div
                      key={item.label}
                      onMouseEnter={() => hasData && setActiveLabel(item.label)}
                      onClick={() => hasData && setActiveLabel(item.label)}
                      className={`flex-1 min-w-[2rem] h-full flex flex-col justify-end items-center ${hasData ? "cursor-pointer" : ""}`}
                    >
                      <div className="w-full max-w-[2.25rem] flex-1 flex flex-col justify-end items-center">
                        {active && (
                          <span className="mb-1 text-[11px] font-bold text-white bg-brand-orange rounded-full px-2 py-0.5 whitespace-nowrap">
                            {pct}%
                          </span>
                        )}
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            active
                              ? "bg-brand-blue"
                              : hasData
                              ? "bg-brand-blue/20 hover:bg-brand-blue/40"
                              : "bg-transparent"
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-1.5 text-[11px] whitespace-nowrap ${
                          active ? "font-bold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}