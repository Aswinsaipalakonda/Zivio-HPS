"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Bell, Sun, Moon, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { User } from "../../types";

export interface HeaderProps {
  user: User | null;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const [isDark, setIsDark] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const router = useRouter();
  const { signOut } = useClerk();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or document class on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkTheme = document.documentElement.classList.contains("dark") || 
                           localStorage.getItem("theme") === "dark" ||
                           (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      setIsDark(isDarkTheme);
      if (isDarkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleThemeToggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof window !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="w-full h-[64px] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-colors duration-200">
      {/* Left: Brand Logo & Name (No hamburger button) */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2.5 select-none cursor-pointer">
          <Image
            src="/favicon.png"
            alt="Zivio Logo"
            width={28}
            height={28}
            className="object-contain shrink-0"
          />
          <span className="text-[17px] font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
            Zivio
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4 shrink-0 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all border border-slate-200/40 dark:border-slate-700/40">
          <Bell className="w-[17px] h-[17px]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500 ring-1 ring-white dark:ring-slate-900" />
        </button>

        {/* Custom Premium Sliding Capsule Theme Switcher - Perfect pixel alignment */}
        <div
          onClick={handleThemeToggle}
          className="relative w-14 h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-between px-1.5 cursor-pointer border border-slate-200/40 dark:border-slate-700/40 select-none overflow-hidden"
        >
          {/* Active Sliding circle bubble */}
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-[#3A9DE9] rounded-full transition-transform duration-300 ease-out shadow-sm flex items-center justify-center ${
              isDark ? "translate-x-7" : "translate-x-0"
            }`}
          />
          {/* Sun Icon */}
          <Sun
            className={`w-3.5 h-3.5 z-10 ml-1 transition-colors duration-300 ${
              isDark ? "text-slate-400" : "text-white"
            }`}
          />
          {/* Moon Icon */}
          <Moon
            className={`w-3.5 h-3.5 z-10 mr-1 transition-colors duration-300 ${
              isDark ? "text-white" : "text-slate-400"
            }`}
          />
        </div>

        {/* Separator */}
        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        {/* User Profile Avatar with Online Dot & Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 cursor-pointer group select-none"
            >
              <div className="relative">
                <Avatar name={user.full_name} imageUrl={user.profile_picture_url} size="sm" />
                {/* Online Green dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all shrink-0 ${profileMenuOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-55 p-3 flex flex-col gap-2 transition-all duration-200 origin-top-right animate-in fade-in slide-in-from-top-2">
                {/* User info header */}
                <div className="flex items-center gap-3 p-2 border-b border-slate-150/40 dark:border-slate-800/40 pb-3">
                  <Avatar name={user.full_name} imageUrl={user.profile_picture_url} size="md" />
                  <div className="min-w-0 text-left">
                    <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                      {user.full_name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                      {user.email}
                    </p>
                    <span className="inline-block px-2 py-0.5 mt-1.5 bg-[#EAF3FC] dark:bg-blue-950/40 text-[#3A9DE9] text-[9px] font-bold tracking-wider rounded-md uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Dropdown Items */}
                <div className="flex flex-col gap-1 py-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>View Profile</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </header>
  );
};
