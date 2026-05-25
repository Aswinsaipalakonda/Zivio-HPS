"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function RootPage() {
  const { user, isLoading, isSignedIn, role } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isSignedIn) {
        router.push("/sign-in");
      } else if (role === "MANAGER") {
        router.push("/manager/assign");
      } else if (role === "DIRECTOR") {
        router.push("/director");
      } else if (role === "EMPLOYEE" || role === "INTERN") {
        router.push("/dashboard");
      } else {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isSignedIn, role, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="relative flex flex-col items-center select-none">
        {/* Clean loading spinner with brand logo */}
        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center animate-pulse mb-5">
          <Image
            src="/favicon.png"
            alt="Zivio Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Workspace...
        </h1>
      </div>
    </main>
  );
}
