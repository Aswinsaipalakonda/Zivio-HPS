"use client";

import React from "react";
import { Home, Calendar, User as UserIcon } from "lucide-react";
import EmployeeGuard from "../../components/guards/EmployeeGuard";
import { DesktopSidebar } from "../../components/layout/DesktopSidebar";
import { MobileBottomNav } from "../../components/layout/MobileBottomNav";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const EMPLOYEE_NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/attendance", icon: Calendar, label: "Attendance" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <EmployeeGuard>
      <div className="min-h-screen flex flex-col lg:flex-row bg-surface text-text font-sans">
        {/* Desktop Sidebar Layout */}
        <DesktopSidebar navItems={EMPLOYEE_NAV_ITEMS} user={user} />
        
        {/* Main Content Pane */}
        <main className="flex-1 lg:pl-[240px] pb-[56px] lg:pb-0 min-h-screen flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav navItems={EMPLOYEE_NAV_ITEMS} />
      </div>
    </EmployeeGuard>
  );
}
