"use client";

import React, { useState } from "react";
import { BarChart2, ClipboardList, Calendar, User as UserIcon } from "lucide-react";
import DirectorGuard from "../../components/guards/DirectorGuard";
import { DesktopSidebar } from "../../components/layout/DesktopSidebar";
import { MobileBottomNav } from "../../components/layout/MobileBottomNav";
import { MobileDrawer } from "../../components/layout/MobileDrawer";
import { Header } from "../../components/layout/Header";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const DIRECTOR_NAV_ITEMS = [
  { href: "/director", icon: BarChart2, label: "Analytics" },
  { href: "/director/tasks", icon: ClipboardList, label: "Tasks" },
  { href: "/director/attendance", icon: Calendar, label: "Attendance" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
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
    <DirectorGuard>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
        {/* Top Full-Width Header */}
        <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 flex relative pt-[64px]">
          {/* Fixed Sidebar below Header */}
          <DesktopSidebar navItems={DIRECTOR_NAV_ITEMS} user={user} />

          {/* Right Side Main Content Panel */}
          <main className="flex-1 lg:pl-[260px] pb-[56px] lg:pb-0 min-h-[calc(100vh-64px)]">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav navItems={DIRECTOR_NAV_ITEMS} />

        {/* Mobile side drawer navigation */}
        <MobileDrawer
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          navItems={DIRECTOR_NAV_ITEMS}
          user={user}
        />
      </div>
    </DirectorGuard>
  );
}
