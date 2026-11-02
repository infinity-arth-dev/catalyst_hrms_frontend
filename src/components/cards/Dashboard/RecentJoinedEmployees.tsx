"use client";

import Image from "next/image";
import { UserPlus } from "lucide-react";
import { useRecentEmployees } from "@/hooks/dashboard-hooks/useRecentEmployees";

const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime())
    ? d
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function RecentJoinedEmployees() {
  const { employees, loading } = useRecentEmployees();

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-primary border border-gray-200 dark:border-white/10 p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recently joined</h3>
        <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-md">New hires</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3 rounded bg-gray-200 dark:bg-white/10" />
                  <div className="w-16 h-2 rounded bg-gray-200 dark:bg-white/10" />
                </div>
              </div>
              <div className="w-14 h-3 rounded bg-gray-200 dark:bg-white/10" />
            </div>
          ))
        ) : employees.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="bg-brand-blue/10 p-3 rounded-full mb-3 text-brand-blue">
              <UserPlus className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">No new hires</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[170px]">
              New employees will show here after onboarding.
            </p>
          </div>
        ) : (
          employees.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={e.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=05ABF0&color=fff`}
                    alt={e.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{e.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{e.role}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(e.joinDate)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}