import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { CheckSquare, Calendar, BarChart3 } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-surface text-text font-sans">
      {/* Left Column (Desktop Hero - 5 cols) */}
      <section className="hidden lg:flex lg:col-span-5 relative p-12 flex-col justify-between text-white overflow-hidden">
        {/* Rich dark teal & deep spruce gradient background for premium contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002626] via-[#003838] to-[#006666] z-0" />
        
        {/* Hero image overlay with opacity and elegant mix-blend-mode */}
        <div className="absolute inset-0 z-10 opacity-30 mix-blend-overlay">
          <Image
            src="/zivio_login_hero.png"
            alt="Workspace Hero"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Subtle decorative curved layout lines */}
        <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
          <svg className="w-full h-full text-white" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Top brand signature */}
        <div className="relative z-20">
          <Image
            src="/logo_white.png"
            alt="HPS Logo"
            width={140}
            height={44}
            className="object-contain mb-2"
            priority
          />
          <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
            Productivity Suite
          </span>
        </div>

        {/* Center elegant Geist typography */}
        <div className="relative z-20 my-auto py-8">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Manage your <br />
            <span className="italic font-light text-white/90 font-serif">Team Activity</span> <br />
            Brilliantly.
          </h1>
          <p className="text-sm xl:text-base text-white/70 max-w-sm leading-relaxed font-light">
            All-in-one platform to coordinate daily tasks, record seamless attendance logs, and track performance metrics instantly.
          </p>
        </div>

        {/* Bottom features indicators (aligned like the Opulea screen) */}
        <div className="relative z-20 space-y-4 pt-4 border-t border-white/15">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90 shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Smart Tasking
              </h3>
              <p className="text-[11px] text-white/60 font-light">
                Coordinate and assign team milestones every morning.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Auto Attendance
              </h3>
              <p className="text-[11px] text-white/60 font-light">
                Idempotent check-ins recorded automatically on load.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90 shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Insights Dashboard
              </h3>
              <p className="text-[11px] text-white/60 font-light">
                Aggregate daily status indexes and work metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column (Clerk Login Card - 7 cols) */}
      <section className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        
        {/* Sleek logo for both mobile and desktop right side */}
        <div className="flex flex-col items-center mb-8 text-center max-w-sm">
          <Image
            src="/logo.png"
            alt="HPS Logo"
            width={120}
            height={38}
            className="object-contain mb-3"
            priority
          />
          <h2 className="text-2xl font-black uppercase tracking-widest text-primary mb-1">
            Welcome Back
          </h2>
          <p className="text-xs font-medium text-text/50 font-mono tracking-wide">
            Google auth allowlist gateway active
          </p>
        </div>

        {/* Tactile pressed / flat Neumorphic form holder */}
        <div className="w-full max-w-md bg-surface rounded-neu shadow-neu-flat border border-white/60 p-8 flex flex-col items-center">
          
          <div className="w-full flex justify-center py-2">
            <SignIn
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent border-0 w-full",
                  header: "hidden", // COMPLETELY HIDES Clerk's duplicate "Sign in to Zivio - HPS" headers
                  footerAction: "hidden", // Completely hides sign-up redirections
                  dividerRow: "hidden",
                  formButtonPrimary: "neu-button bg-primary text-white hover:bg-opacity-95 active:shadow-neu-sm-pressed active:translate-y-[1px] font-mono text-xs font-bold uppercase tracking-wider rounded-lg w-full h-11 border-0 shadow-neu-sm",
                  socialButtonsBlockButton: "neu-button border border-white/40 text-text/80 font-mono text-xs hover:translate-y-[-1px] active:translate-y-[1px] rounded-lg w-full h-11 shadow-neu-sm bg-surface active:shadow-neu-sm-pressed",
                  formFieldInput: "neu-input bg-surface shadow-neu-sm-pressed font-mono text-sm border-0 rounded-lg w-full h-11 text-text",
                  formFieldLabel: "font-mono text-xs text-text/80 mb-1.5 font-bold tracking-wide uppercase",
                  footer: "hidden"
                },
                variables: {
                  colorPrimary: "#006666",
                  borderRadius: "8px",
                }
              }}
            />
          </div>

          {/* Secure details warning footer (Very subtle) */}
          <div className="mt-8 border-t border-text/10 pt-4 w-full text-center">
            <p className="font-mono text-[9px] text-danger/80 font-extrabold uppercase tracking-widest">
              Strict allowlist security
            </p>
            <p className="text-[10px] text-text/45 mt-1 leading-relaxed max-w-[280px] mx-auto">
              Access is strictly restricted to pre-registered Google accounts. Contact the administration department for queries.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
