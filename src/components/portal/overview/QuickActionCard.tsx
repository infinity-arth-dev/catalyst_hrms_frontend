import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ 
  icon, 
  title, 
  desc, 
  href,
  color = "blue"
}: { 
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  color?: "blue" | "orange";
}) {
  const isOrange = color === "orange";

  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-primary rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
          isOrange ? "bg-brand-orange/10 text-brand-orange" : "bg-brand-blue/10 text-brand-blue"
        }`}>
          {icon}
        </div>
        <h3 className="text-base font-bold text-primary dark:text-white mb-1">{title}</h3>
        <p className="text-xs font-medium text-secondary dark:text-gray-400 mb-5">{desc}</p>
        <div className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
          isOrange ? "text-brand-orange" : "text-brand-blue"
        }`}>
          Go <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
