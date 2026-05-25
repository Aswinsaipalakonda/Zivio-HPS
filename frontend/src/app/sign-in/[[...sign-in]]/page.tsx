import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { CheckSquare, Calendar, BarChart3 } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 text-slate-900 font-sans">
      {/* Left Column (Desktop Hero - 5 cols) */}
      <section className="hidden lg:flex lg:col-span-5 relative p-12 flex-col justify-between text-white overflow-hidden">
        {/* HPS Logo blue / dark slate gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#3A9DE9] z-0" />
        
        {/* Hero image overlay */}
        <div className="absolute inset-0 z-10 opacity-20 mix-blend-overlay">
          <Image
            src="/zivio_login_hero.png"
            alt="Workspace Hero"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Curved decorative layout SVG */}
        <div className="absolute inset-0 z-10 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-white" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Top brand signature */}
        <div className="relative z-20">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_white.png"
              alt="HPS Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
            <span className="font-sans text-xl font-bold tracking-tight text-white">
              Zivio
            </span>
          </div>
          <span className="font-sans text-[10px] tracking-widest text-white/40 uppercase block mt-1">
            Productivity Suite
          </span>
        </div>

        {/* Center elegant typography */}
        <div className="relative z-20 my-auto py-8">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Manage your <br />
            <span className="text-[#3A9DE9]">Team Activity</span> <br />
            Brilliantly.
          </h1>
          <p className="text-sm xl:text-base text-white/70 max-w-sm leading-relaxed font-light">
            All-in-one platform to coordinate daily tasks, record seamless attendance logs, and track performance metrics instantly.
          </p>
        </div>

        {/* Bottom features indicators */}
        <div className="relative z-20 space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90 shrink-0">
              <CheckSquare className="w-4 h-4 text-[#3A9DE9]" />
            </div>
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
                Smart Tasking
              </h3>
              <p className="text-[11px] text-white/60 font-light">
                Coordinate and assign team milestones every morning.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90 shrink-0">
              <Calendar className="w-4 h-4 text-[#3A9DE9]" />
            </div>
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
                Auto Attendance
              </h3>
              <p className="text-[11px] text-white/60 font-light">
                Idempotent check-ins recorded automatically on load.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/90 shrink-0">
              <BarChart3 className="w-4 h-4 text-[#3A9DE9]" />
            </div>
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
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
            width={48}
            height={48}
            className="object-contain mb-3 rounded-xl"
            priority
          />
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-1">
            Welcome Back
          </h2>
          <p className="text-xs font-semibold text-slate-400 font-sans tracking-wide">
            Google auth allowlist gateway active
          </p>
        </div>

        {/* Flat White Form Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
          
          <div className="w-full flex justify-center py-2">
            <SignIn
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent border-0 w-full",
                  header: "hidden", 
                  footerAction: "hidden", 
                  dividerRow: "hidden",
                  formButtonPrimary: "bg-primary text-white hover:bg-[#2480CC] shadow-sm font-sans text-xs font-bold uppercase tracking-wider rounded-xl w-full h-11 border-0 transition-all active:scale-[0.98]",
                  socialButtonsBlockButton: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-sans text-xs font-semibold rounded-xl w-full h-11 transition-all active:scale-[0.98]",
                  formFieldInput: "bg-white border border-slate-200 font-sans text-sm rounded-xl w-full h-11 text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none px-3 transition-all",
                  formFieldLabel: "font-sans text-xs text-slate-600 mb-1.5 font-bold tracking-wide uppercase",
                  footer: "hidden"
                },
                variables: {
                  colorPrimary: "#3A9DE9",
                  borderRadius: "12px",
                }
              }}
            />
          </div>

          {/* Secure details warning footer */}
          <div className="mt-8 border-t border-slate-100 pt-4 w-full text-center">
            <p className="font-sans text-[10px] text-red-500 font-bold uppercase tracking-widest">
              Strict allowlist security
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-[280px] mx-auto">
              Access is strictly restricted to pre-registered Google accounts. Contact the administration department for queries.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
