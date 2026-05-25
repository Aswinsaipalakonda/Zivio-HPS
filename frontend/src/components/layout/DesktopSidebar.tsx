"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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

  // Define role badge color mappings (Neumorphic soft badges)
  let roleBadgeClass = "";
  switch (user?.role) {
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
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-surface border-r border-white/40 shadow-neu-flat z-30 justify-between">
      {/* Top Header Logo */}
      <div className="p-6 border-b border-text/5">
        <Link href="/" className="flex items-center gap-3 select-none">
          <Image
            src="/logo.png"
            alt="HPS Logo"
            width={85}
            height={28}
            className="object-contain"
            priority
          />
          <h1 className="font-mono text-xl font-black uppercase tracking-wider text-primary">
            Zivio
          </h1>
        </Link>
      </div>

      {/* Middle Menu Items Mapping */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-mono tracking-wide uppercase transition-all ${
                isActive
                  ? "bg-[#e6f2f2] text-primary font-bold border-l-[3px] border-primary shadow-neu-sm-pressed"
                  : "text-text/75 hover:bg-white/40 hover:text-text"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary animate-pulse" : "text-text/50"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Details Panel */}
      <div className="p-4 border-t border-text/5 bg-white/10 space-y-4">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar name={user.full_name} imageUrl={user.profile_picture_url} size="sm" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-text truncate font-sans">
                {user.full_name}
              </h4>
              <p className="text-[10px] text-text/50 truncate font-mono uppercase">
                {user.email}
              </p>
              {/* Colored Role Badge */}
              <span className={`inline-flex px-2 py-0.5 mt-1 rounded-full text-[9px] font-bold border ${roleBadgeClass}`}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Tactile Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full font-mono text-[10px] font-bold uppercase tracking-wider text-danger hover:bg-danger/10 py-2.5 rounded-lg border border-danger/25 transition-all shadow-neu-sm bg-surface active:shadow-neu-sm-pressed"
          style={{ minHeight: "36px" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
