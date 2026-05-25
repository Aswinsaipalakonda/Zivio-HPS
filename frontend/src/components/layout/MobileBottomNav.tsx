"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface MobileBottomNavProps {
  navItems: NavItem[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ navItems }) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 pb-safe shadow-lg lg:hidden flex justify-around items-center h-[56px] px-2 transition-all duration-200">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all relative font-sans text-[10px]"
          >
            <div
              className={`flex flex-col items-center transition-all ${
                isActive 
                  ? "text-primary scale-105" 
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="font-semibold tracking-wide">{item.label}</span>
            </div>
            
            {/* Active dot indicator */}
            {isActive && (
              <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
