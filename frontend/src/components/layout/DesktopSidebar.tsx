"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { User } from "../../types";

export interface NavItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface DesktopSidebarProps {
  navItems: NavItem[];
  user: User | null;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ navItems, user }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const getBottomButtonLabel = () => {
    switch (user?.role) {
      case "MANAGER": return "Allocate Task +";
      case "DIRECTOR": return "Create User +";
      case "EMPLOYEE":
      default:
        return "Check In +";
    }
  };

  const handleBottomButtonClick = () => {
    if (user?.role === "MANAGER") {
      router.push("/manager/assign");
    } else if (user?.role === "DIRECTOR") {
      router.push("/director");
    } else {
      router.push("/dashboard");
    }
  };

  // Determine active role from pathname
  const getActiveRole = (): "employee" | "manager" | "director" => {
    if (pathname.startsWith("/manager")) return "manager";
    if (pathname.startsWith("/director")) return "director";
    return "employee";
  };
  const activeRole = getActiveRole();

  // Separate navItems into MENU (first 3) and ORGANISATION (rest)
  const menuItems = navItems.slice(0, 3);
  const orgItems = navItems.slice(3);

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-[64px] bottom-0 w-[260px] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 z-40 justify-between transition-colors duration-200">
      {/* Workspace / Team Selection Block (ProDeel Sidebar Top) */}
      <div className="px-5 pt-5 pb-2 shrink-0">
        {user ? (
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-[20px] select-none">
            <div className="flex items-center gap-3 min-w-0">
              {/* Dark initials emblem circle */}
              <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm">
                ZT
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                  {user.full_name.split(" ")[0]} Team
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                  hello@fillo.com
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-14 bg-slate-50 dark:bg-slate-800 rounded-[20px] animate-pulse" />
        )}
      </div>

      {/* Scrollable Navigation links */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-2">
        {/* MENU Label section */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3.5 mb-2">
            Menu
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                    isActive
                      ? "bg-[#EAF3FC] dark:bg-blue-950/30 text-[#3A9DE9]"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#3A9DE9]" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ORGANISATION Label section */}
        {orgItems.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3.5 mb-2">
              Organisation
            </div>
            <div className="space-y-1">
              {orgItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                      isActive
                        ? "bg-[#EAF3FC] dark:bg-blue-950/30 text-[#3A9DE9]"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#3A9DE9]" : "text-slate-400 dark:text-slate-500"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-5 pb-5 pt-3 space-y-3 shrink-0 border-t border-slate-100 dark:border-slate-800/80">
        {/* Primary CTA Capsule Button */}
        <button
          onClick={handleBottomButtonClick}
          className="flex items-center justify-center gap-2 w-full text-[13px] font-bold text-white bg-[#3A9DE9] hover:bg-[#2480CC] py-3.5 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98]"
        >
          {getBottomButtonLabel()}
        </button>

        {/* Role Switcher (styled as neat rounded border pills) */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <button
            onClick={() => router.push("/dashboard")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${
              activeRole === "employee"
                ? "bg-[#3A9DE9] text-white border-[#3A9DE9]"
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-650 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Emp
          </button>
          <button
            onClick={() => router.push("/manager/assign")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${
              activeRole === "manager"
                ? "bg-[#3A9DE9] text-white border-[#3A9DE9]"
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-650 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Mgr
          </button>
          <button
            onClick={() => router.push("/director")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${
              activeRole === "director"
                ? "bg-[#3A9DE9] text-white border-[#3A9DE9]"
                : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-650 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Dir
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full text-[12px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 py-2.5 rounded-xl transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
