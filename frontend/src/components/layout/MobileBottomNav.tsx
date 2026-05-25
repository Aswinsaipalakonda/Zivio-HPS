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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-white/40 pb-safe shadow-neu-flat lg:hidden flex justify-around items-center h-[56px] px-2">
      {navItems.map((item) => {
        // Match exact or nested paths
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all relative font-mono text-[10px]"
          >
            <div
              className={`flex flex-col items-center transition-all ${
                isActive ? "text-primary scale-105" : "text-text/50 hover:text-text/80"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="font-bold tracking-wide uppercase">{item.label}</span>
            </div>
            
            {/* Active circular dot indicator */}
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
