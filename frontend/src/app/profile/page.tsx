"use client";

import React from "react";
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

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    // If not signed in, redirect to login
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

  // Define role badge color mappings (Neumorphic soft badges)
  let roleBadgeClass = "";
  switch (user.role) {
    case "MANAGER":
      roleBadgeClass = "bg-purple-100 text-purple-800 border-purple-200";
      break;
    case "DIRECTOR":
      roleBadgeClass = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case "INTERN":
      roleBadgeClass = "bg-teal-100 text-teal-800 border-teal-200";
      break;
    case "EMPLOYEE":
    default:
      roleBadgeClass = "bg-green-100 text-green-800 border-green-200";
      break;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface text-text font-sans">
      {/* Desktop Sidebar Layout Wrapper */}
      <DesktopSidebar navItems={navItems} user={user} />

      {/* Main Panel Content with Sidebar offset padding */}
      <main className="flex-1 lg:pl-[240px] pb-[56px] lg:pb-0 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            {/* Header Title */}
            <h2 className="font-mono text-2xl font-black uppercase tracking-wide text-text mb-6">
              My Profile
            </h2>

            {/* Profile tactile Neumorphic Card */}
            <Card variant="flat" padding="lg" className="w-full flex flex-col items-center">
              {/* Recessed ring surrounding profile photo */}
              <div className="w-24 h-24 rounded-full bg-surface shadow-neu-sm border border-white/50 flex items-center justify-center mb-6 shrink-0">
                <Avatar
                  name={user.full_name}
                  imageUrl={user.profile_picture_url}
                  size="lg"
                  className="shadow-neu-sm-pressed"
                />
              </div>

              {/* User details */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-extrabold text-text tracking-tight">
                  {user.full_name}
                </h3>
                <span className={`inline-flex px-3 py-1 mt-2 rounded-full text-xs font-bold border uppercase font-mono tracking-wider ${roleBadgeClass}`}>
                  {user.role}
                </span>
              </div>

              {/* Data list mapping (Neumorphic recessed inputs or boxes) */}
              <div className="w-full space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-surface/50 p-3 rounded-lg border border-white/40 shadow-neu-sm-pressed">
                  <Mail className="w-5 h-5 text-text/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/45 block">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-text/90 truncate block">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface/50 p-3 rounded-lg border border-white/40 shadow-neu-sm-pressed">
                  <Briefcase className="w-5 h-5 text-text/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/45 block">
                      Department
                    </span>
                    <span className="text-sm font-semibold text-text/90 truncate block">
                      {user.department || "General Operations"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface/50 p-3 rounded-lg border border-white/40 shadow-neu-sm-pressed">
                  <Calendar className="w-5 h-5 text-text/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/45 block">
                      Join Date
                    </span>
                    <span className="text-sm font-semibold text-text/90 truncate block">
                      {formatDate(user.date_joined)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface/50 p-3 rounded-lg border border-white/40 shadow-neu-sm-pressed">
                  <ShieldCheck className="w-5 h-5 text-text/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/45 block">
                      Status Access
                    </span>
                    <span className="text-sm font-semibold text-success truncate block">
                      Active Allowed
                    </span>
                  </div>
                </div>
              </div>

              {/* Outlined Danger Action Button */}
              <Button variant="danger" fullWidth onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out from Zivio
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Layout Wrapper */}
      <MobileBottomNav navItems={navItems} />
    </div>
  );
}
