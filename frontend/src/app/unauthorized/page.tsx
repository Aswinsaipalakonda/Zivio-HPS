"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card variant="flat" padding="lg" className="w-full max-w-md flex flex-col items-center text-center">
        {/* Recessed red pulsing lock icon container */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-6 text-red-500 animate-pulse shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">
          Access Denied
        </h1>
        
        <p className="text-sm font-sans text-slate-500 leading-relaxed mb-8">
          Your email address is not registered in the Zivio system. Please contact your manager or system administrator to add your email to the approved allowlist.
        </p>
        
        <Button variant="danger" fullWidth onClick={handleSignOut}>
          Sign Out & Return
        </Button>
      </Card>
    </main>
  );
}
