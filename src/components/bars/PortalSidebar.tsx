"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { PORTAL_NAV } from "@/constants/Sidebar/navigation";
import ThemeToggleSwitch from "../buttons/ThemeToggle";

import { portalService } from "@/services/employeeProtalServices/employee.overview.service";
import { managerService } from "@/services/managerService";

export default function PortalSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLeadership, setIsLeadership] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const rawUser = localStorage.getItem("user");
            if (rawUser) {
                try {
                    const parsed = JSON.parse(rawUser);
                    if (parsed?.isLeadershipRole) {
                        setIsLeadership(true);
                        if (parsed?._id) {
                            managerService.getApprovalMetrics(parsed._id)
                                .then((metrics) => {
                                    setPendingCount(metrics?.pendingApprovalsCount || 0);
                                })
                                .catch(() => {});
                        }
                    }
                } catch (e) {
                    console.error("Error parsing user from localStorage", e);
                }
            }

            // Also check latest profile from API in case localStorage is empty or outdated
            portalService.getProfileData()
                .then((profile) => {
                    if (profile?.isLeadershipRole) {
                        setIsLeadership(true);
                        localStorage.setItem("user", JSON.stringify(profile));
                        if (profile?._id) {
                            managerService.getApprovalMetrics(profile._id)
                                .then((metrics) => {
                                    setPendingCount(metrics?.pendingApprovalsCount || 0);
                                })
                                .catch(() => {});
                        }
                    }
                })
                .catch(() => {});
        }
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        router.replace("/auth");
    };

    return (
        <>
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-primary border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 z-40">
                <Link href="/portal" className="flex items-center gap-2.5">
                    <Image src="/images/icon.png" alt="Catalyst Biomedical" width={32} height={32} className="w-8 h-8 object-contain rounded-full shrink-0" />
                    <div className="flex flex-col leading-[1.05]">
                        <span className="text-[11px] font-black text-primary dark:text-white uppercase tracking-tight">CATALYST</span>
                        <span className="text-[11px] font-black text-primary dark:text-white uppercase tracking-tight">BIOMEDICAL</span>
                        <span className="text-[9px] font-black text-brand-blue uppercase tracking-wider mt-0.5">HRMS</span>
                    </div>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-primary dark:text-white focus:outline-none"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={closeMobileMenu}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0A0A0A] border-r border-gray-100 dark:border-white/5 shadow-xl md:shadow-none z-50 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="h-16 md:h-24 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <Link href="/portal" className="flex items-center gap-3">
                        <Image src="/images/icon.png" alt="Catalyst Biomedical" width={36} height={36} className="w-9 h-9 object-contain rounded-full shrink-0" />
                        <div className="flex flex-col leading-[1.1]">
                            <span className="text-xs font-black text-primary dark:text-white uppercase tracking-tight">CATALYST</span>
                            <span className="text-xs font-black text-primary dark:text-white uppercase tracking-tight">BIOMEDICAL</span>
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-wider mt-0.5">HRMS</span>
                        </div>
                    </Link>
                    <button onClick={closeMobileMenu} className="md:hidden text-gray-500 hover:text-primary dark:hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                    <ThemeToggleSwitch />
                </div>

                <div className="flex-1 overflow-y-auto py-6 space-y-8">
                    {isMounted && PORTAL_NAV.map((section) => (
                        <div key={section.label} className="px-4">
                            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {section.label}
                            </p>
                            <div className="space-y-1">
                                {section.items
                                    .filter((item: any) => !item.leadershipOnly || isLeadership)
                                    .map((item: any) => {
                                        const isBaseRoute = item.url === "/portal" || item.url === "/";
                                        const isActive = isBaseRoute
                                            ? pathname === item.url
                                            : pathname === item.url || pathname.startsWith(`${item.url}/`);

                                        const Icon = item.icon;
                                        const showBadge = item.url === "/portal/team-leaves" && pendingCount > 0;

                                        return (
                                            <Link
                                                key={item.url}
                                                href={item.url}
                                                onClick={closeMobileMenu}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm transition-all duration-200 ${isActive
                                                    ? "bg-brand-blue text-white font-semibold shadow-md shadow-brand-blue/30"
                                                    : "text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "opacity-70"}`} />
                                                    <span>{item.title}</span>
                                                </div>
                                                {showBadge && (
                                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? "bg-white text-brand-blue" : "bg-brand-blue text-white"}`}>
                                                        {pendingCount}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}