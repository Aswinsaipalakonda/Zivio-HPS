import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-surface text-text">
      {/* Left half (desktop only) */}
      <section className="hidden md:flex md:col-span-5 bg-primary p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Subtle background graphic or glow representing monochromatic playfulness */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        
        {/* Logo and Tagline */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo_white.png"
              alt="HPS Logo"
              width={160}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight mb-4 uppercase">
            Zivio
          </h1>
          <p className="font-mono text-lg font-medium text-white/90 leading-snug">
            "Every task. Every person. Every day."
          </p>
        </div>

        {/* Decorative Description */}
        <div className="relative z-10 max-w-sm">
          <h2 className="font-mono text-xs font-bold tracking-widest uppercase text-white/60 mb-2">
            Platform Capabilities
          </h2>
          <p className="font-mono text-sm text-white/80 leading-relaxed">
            A minimal, tactile dashboard created for high-performing teams to align daily goals, register attendance, and review analytical metrics seamlessly.
          </p>
          <div className="mt-8 flex gap-2 font-mono text-[10px] text-white/40 uppercase">
            <span>Security Verified</span>
            <span>•</span>
            <span>Clerk JWT Active</span>
          </div>
        </div>
      </section>

      {/* Right half (or full screen on mobile) */}
      <section className="col-span-1 md:col-span-7 flex flex-col justify-center items-center p-6 md:p-12">
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-center mb-8 text-center">
          <Image
            src="/logo.png"
            alt="HPS Logo"
            width={120}
            height={40}
            className="object-contain mb-4"
            priority
          />
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wide">
            Zivio
          </h1>
          <p className="font-mono text-xs font-semibold text-text/60">
            "Every task. Every person. Every day."
          </p>
        </div>

        {/* Tactile Neumorphic Card holding Clerk SignIn */}
        <div className="w-full max-w-md bg-surface rounded-neu shadow-neu-flat border border-white/60 p-8 flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="font-mono text-xl font-bold text-text mb-1 tracking-wide uppercase">
              Welcome to Zivio
            </h2>
            <p className="text-xs font-medium text-text/60 font-sans">
              Sign in with your company Google account
            </p>
          </div>

          <div className="w-full flex justify-center py-2">
            <SignIn
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent border-0 w-full",
                  header: "hidden",
                  footerAction: "hidden", // Hide Sign Up redirect
                  dividerRow: "hidden",
                  formButtonPrimary: "neu-button bg-primary text-white hover:bg-opacity-90 active:shadow-neu-sm-pressed active:translate-y-[1px] font-mono text-sm font-semibold rounded-lg w-full h-11 border-0",
                  socialButtonsBlockButton: "neu-button border border-white/30 text-text/80 font-mono text-xs hover:translate-y-[-1px] active:translate-y-[1px] rounded-lg w-full h-11 shadow-neu-sm bg-surface active:shadow-neu-sm-pressed",
                  formFieldInput: "neu-input bg-surface shadow-neu-sm-pressed font-mono text-sm border-0 rounded-lg w-full h-11 text-text",
                  formFieldLabel: "font-mono text-xs text-text/80 mb-1 font-bold",
                  footer: "hidden"
                },
                variables: {
                  colorPrimary: "#006666",
                  borderRadius: "8px",
                }
              }}
            />
          </div>

          {/* Strict Allowlist Footer Warning */}
          <div className="mt-6 border-t border-text/10 pt-4 w-full text-center">
            <p className="font-mono text-[10px] text-danger/80 font-bold uppercase tracking-wider">
              ⚠️ Strict Authorization Active
            </p>
            <p className="text-[11px] text-text/50 font-sans mt-1">
              Only approved company emails can access this system. Unregistered users will be redirected to the access denied page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
