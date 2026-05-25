"use client";

import React from "react";
import { PlusCircle, ClipboardList, BarChart2, Users, User as UserIcon } from "lucide-react";
import ManagerGuard from "../../components/guards/ManagerGuard";
import { DesktopSidebar } from "../../components/layout/DesktopSidebar";
import { MobileBottomNav } from "../../components/layout/MobileBottomNav";
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ManagerGuard>
      <div className="min-h-screen flex flex-col lg:flex-row bg-surface text-text font-sans">
        {/* Desktop Sidebar Layout */}
        <DesktopSidebar navItems={MANAGER_NAV_ITEMS} user={user} />
        
        {/* Main Content Pane */}
        <main className="flex-1 lg:pl-[240px] pb-[56px] lg:pb-0 min-h-screen flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav navItems={MANAGER_NAV_ITEMS} />
      </div>
    </ManagerGuard>
  );
}
