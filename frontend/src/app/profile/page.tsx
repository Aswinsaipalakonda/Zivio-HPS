"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogOut, User as UserIcon, Mail, Briefcase, Calendar, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { DesktopSidebar } from "../../components/layout/DesktopSidebar";
import { MobileBottomNav } from "../../components/layout/MobileBottomNav";
import { MobileDrawer } from "../../components/layout/MobileDrawer";
import { Header } from "../../components/layout/Header";
import { formatDate } from "../../lib/utils";

// Define the role-specific nav items to maintain navigation context
import { Home, ClipboardList, BarChart2, PlusCircle, Users } from "lucide-react";

const EMPLOYEE_NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/attendance", icon: Calendar, label: "Attendance" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

const MANAGER_NAV_ITEMS = [
  { href: "/manager/assign", icon: PlusCircle, label: "Assign Tasks" },
  { href: "/manager/tasks", icon: ClipboardList, label: "Task Review" },
  { href: "/manager/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/manager/team", icon: Users, label: "Team" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

const DIRECTOR_NAV_ITEMS = [
  { href: "/director", icon: BarChart2, label: "Analytics" },
  { href: "/director/tasks", icon: ClipboardList, label: "Tasks" },
  { href: "/director/attendance", icon: Calendar, label: "Attendance" },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

export default function ProfilePage() {
  const { user, isLoading, isSignedIn, role } = useCurrentUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    router.push("/sign-in");
    return null;
  }

  // Determine navigation context based on user role
  let navItems = EMPLOYEE_NAV_ITEMS;
  if (role === "MANAGER") {
    navItems = MANAGER_NAV_ITEMS;
  } else if (role === "DIRECTOR") {
    navItems = DIRECTOR_NAV_ITEMS;
  }

  let roleBadgeClass = "";
  switch (user.role) {
    case "MANAGER":
      roleBadgeClass = "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40";
      break;
    case "DIRECTOR":
      roleBadgeClass = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40";
      break;
    case "INTERN":
      roleBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
      break;
    case "EMPLOYEE":
    default:
      roleBadgeClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700";
      break;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <DesktopSidebar navItems={navItems} user={user} />

      {/* Main Panel Content */}
      <main className="flex-1 min-w-0 overflow-hidden lg:pl-[260px] pb-[56px] lg:pb-0 min-h-screen flex flex-col">
        <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            {/* Header Title */}
            <h2 className="font-sans text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              My Profile
            </h2>

            {/* Profile Card */}
            <Card variant="flat" padding="lg" className="w-full flex flex-col items-center">
              {/* Profile Photo Wrapper */}
              <div className="w-24 h-24 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shrink-0 bg-slate-50 dark:bg-slate-850">
                <Avatar
                  name={user.full_name}
                  imageUrl={user.profile_picture_url}
                  size="lg"
                />
              </div>

              {/* User details */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {user.full_name}
                </h3>
                <span className={`inline-flex px-3 py-1 mt-2 rounded-full text-xs font-semibold border uppercase tracking-wider ${roleBadgeClass}`}>
                  {user.role}
                </span>
              </div>

              {/* Data list mapping */}
              <div className="w-full space-y-3 mb-8">
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate block">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Department
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate block">
                      {user.department || "General Operations"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Join Date
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate block">
                      {formatDate(user.date_joined)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Status Access
                    </span>
                    <span className="text-sm font-semibold text-emerald-600 truncate block">
                      Active Allowed
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button variant="danger" fullWidth onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out from Zivio
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav navItems={navItems} />

      {/* Mobile side drawer navigation */}
      <MobileDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
        user={user}
      />
    </div>
  );
}
