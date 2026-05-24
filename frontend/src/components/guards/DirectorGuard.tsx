"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export default function DirectorGuard({ children }: { children: React.ReactNode }) {
  const { role, isLoading, isSignedIn } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isSignedIn) {
        router.push("/sign-in");
      } else if (role !== "DIRECTOR") {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isSignedIn, role, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn || role !== "DIRECTOR") {
    return null;
  }

  return <>{children}</>;
}
