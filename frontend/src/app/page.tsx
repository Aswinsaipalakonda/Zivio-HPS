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
        // Fallback for unauthorized email allowlist denials
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isSignedIn, role, router]);

  // Premium, pulsing monochromatic loading screen while resolving routing redirect
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-surface p-6">
      <div className="relative flex flex-col items-center select-none">
        {/* Pulsing logo ring representing neumorphic aesthetics */}
        <div className="w-24 h-24 rounded-full bg-surface shadow-neu-sm border border-white/50 flex items-center justify-center animate-pulse mb-4">
          <Image
            src="/logo.png"
            alt="HPS Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-text/50 animate-pulse">
          Securing Session...
        </h1>
      </div>
    </main>
  );
}
