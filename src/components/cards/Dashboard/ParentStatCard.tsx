"use client";

import { Users, UserCheck, UserX, CalendarDays } from "lucide-react";
import { useDashboardStats } from "@/hooks/dashboard-hooks/useDashboardStats";

const getStyle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("present"))
    return { Icon: UserCheck, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
  if (t.includes("absent"))
    return { Icon: UserX, tint: "bg-brand-orange/10 text-brand-orange" };
  if (t.includes("leave"))
    return { Icon: CalendarDays, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  return { Icon: Users, tint: "bg-brand-blue/10 text-brand-blue" };
};

const cardBase =
  "rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-white/10 p-4 sm:p-5 flex flex-col justify-between";

export default function ParentStatCard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-white/10 p-5 h-[130px] animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10" />
            <div className="mt-5 w-20 h-4 rounded bg-gray-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
      {stats.map((stat, i) => {
        const { Icon, tint } = getStyle(stat.title);
        return (
          <div key={i} className={`${cardBase} min-h-[130px]`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tint}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}