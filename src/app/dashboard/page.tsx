"use client";

import { useEffect, useState } from "react";
import TotalStat from "@/components/cards/Dashboard/TotalStat";
import ParentStatCard from "@/components/cards/Dashboard/ParentStatCard";
import RecentJoinedEmployees from "@/components/cards/Dashboard/RecentJoinedEmployees";
import DepartmentChart from "@/components/cards/Dashboard/DepartmentChart";
import UpcomingBirthdays from "@/components/cards/Dashboard/UpcomingBirthdays";

export default function Dashboard() {
  // localStorage is not available during server render, so read it after mount
  const [role, setRole] = useState("");
  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Hello{role ? `, ${role}` : ""}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here is what is happening in your workforce today.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-5 mb-4 sm:mb-5">
        <div className="xl:col-span-2">
          <ParentStatCard />
        </div>
        <div className="xl:col-span-3 min-w-0">
          <TotalStat />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        <DepartmentChart />
        <RecentJoinedEmployees />
        <div className="md:col-span-2 xl:col-span-1">
          <UpcomingBirthdays />
        </div>
      </div>
    </div>
  );
}