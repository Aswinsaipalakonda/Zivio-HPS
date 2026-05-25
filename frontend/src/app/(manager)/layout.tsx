"use client";

import React, { useState } from "react";
import { PlusCircle, ClipboardList, BarChart2, Users, User as UserIcon } from "lucide-react";
import ManagerGuard from "../../components/guards/ManagerGuard";
import { DesktopSidebar } from "../../components/layout/DesktopSidebar";
import { MobileBottomNav } from "../../components/layout/MobileBottomNav";
import { MobileDrawer } from "../../components/layout/MobileDrawer";
import { Header } from "../../components/layout/Header";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const MANAGER_NAV_ITEMS = [
  { href: "/manager/assign", icon: PlusCircle, label: "Assign Tasks" },
  { href: "/manager/tasks", icon: ClipboardList, label: "Task Review" },
  { href: "/manager/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/manager/team", icon: Users, label: "Team" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ManagerGuard>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
        {/* Top Full-Width Header */}
        <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 flex relative pt-[64px]">
          {/* Fixed Sidebar below Header */}
          <DesktopSidebar navItems={MANAGER_NAV_ITEMS} user={user} />

          {/* Right Side Main Content Panel */}
          <main className="flex-1 min-w-0 overflow-hidden lg:pl-[260px] pb-[56px] lg:pb-0 min-h-[calc(100vh-64px)]">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav navItems={MANAGER_NAV_ITEMS} />

        {/* Mobile side drawer navigation */}
        <MobileDrawer
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          navItems={MANAGER_NAV_ITEMS}
          user={user}
        />
      </div>
    </ManagerGuard>
  );
}
