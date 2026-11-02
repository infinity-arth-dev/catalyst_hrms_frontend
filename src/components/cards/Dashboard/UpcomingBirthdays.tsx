"use client";

import Image from "next/image";
import { Gift, CalendarX } from "lucide-react";
import { useUpcomingBirthdays } from "@/hooks/dashboard-hooks/useUpcomingBirthdays";

export default function UpcomingBirthdays() {
  const { birthdays, loading } = useUpcomingBirthdays();

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-white/10 p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-brand-orange" />
          Birthdays
        </h3>
        <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 px-2 py-1 rounded-md">This month</span>
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="w-16 h-2 rounded bg-gray-200 dark:bg-white/10" />
                </div>
              </div>
              <div className="w-12 h-5 rounded bg-gray-200 dark:bg-white/10" />
            </div>
          ))
        ) : birthdays.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="bg-brand-orange/10 p-3 rounded-full mb-3 text-brand-orange">
              <CalendarX className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">No upcoming birthdays</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[190px]">
              No more birthdays for the rest of this month.
            </p>
          </div>
        ) : (
          birthdays.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between gap-2 p-2 rounded-xl border transition-colors ${
                p.isToday
                  ? "bg-brand-orange/10 border-brand-orange/25"
                  : "border-transparent hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=F95F21&color=fff`}
                    alt={p.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${p.isToday ? "text-brand-orange" : "text-gray-900 dark:text-white"}`}>
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.role}</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded-md ${
                  p.isToday ? "bg-brand-orange text-white" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
                }`}
              >
                {p.isToday ? "Today" : p.date}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}