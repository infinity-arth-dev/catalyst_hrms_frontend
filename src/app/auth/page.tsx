"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLogin } from "@/hooks/useLogin";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Clock,
  CalendarDays,
  Wallet,
  CheckCircle2,
  Fingerprint,
  TriangleAlert,
} from "lucide-react";

const inputClass =
  "w-full h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-11 pr-11 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15 transition";

const features = [
  { icon: Clock, title: "Biometric attendance", desc: "Punches synced automatically, every day" },
  { icon: CalendarDays, title: "Leaves in one click", desc: "Apply, approve and track balances" },
  { icon: Wallet, title: "Payslips on demand", desc: "Your records, always available" },
];


// Animation delay helper (used by the .lg-up / .lg-pop classes below)
const d = (ms: number) => ({ "--d": `${ms}ms` } as CSSProperties);

const animations = `
@keyframes lg-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes lg-pop     { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }
@keyframes lg-float   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes lg-drift   { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-22px, -16px); } }
@keyframes lg-orbit   { to { transform: rotate(360deg); } }
@keyframes lg-ripple  { 0% { transform: scale(.9); opacity: .55; } 100% { transform: scale(3.4); opacity: 0; } }
@keyframes lg-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.lg-up     { opacity: 0; animation: lg-fade-up .8s cubic-bezier(.22,1,.36,1) forwards; animation-delay: var(--d, 0ms); }
.lg-pop    { opacity: 0; animation: lg-pop .5s cubic-bezier(.34,1.56,.64,1) forwards; animation-delay: var(--d, 0ms); }
.lg-float  { animation: lg-float 6s ease-in-out infinite; }
.lg-drift  { animation: lg-drift 10s ease-in-out infinite; }
.lg-orbit  { animation: lg-orbit 36s linear infinite; }
.lg-ripple { animation: lg-ripple 5s ease-out infinite; animation-delay: var(--d, 0ms); }
.lg-shimmer {
    background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,.5) 50%, transparent 60%);
    background-size: 200% 100%;
    animation: lg-shimmer 3.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .lg-up, .lg-pop, .lg-float, .lg-drift, .lg-orbit, .lg-ripple, .lg-shimmer {
    animation: none !important; opacity: 1 !important; transform: none !important;
  }
  .lg-ripple { opacity: 0 !important; }
  .lg-shimmer { background: none !important; }
}
`;

export default function LoginPage() {
  const {
    employeeCode,
    setEmployeeCode,
    password,
    setPassword,
    loading,
    error,
    showPassword,
    togglePasswordVisibility,
    handleLogin,
  } = useLogin();

  const [capsLock, setCapsLock] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#070a0f]">
      <style>{animations}</style>

      {/* ───────── Brand panel (desktop) ───────── */}
      <aside className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-14 text-white bg-gradient-to-br from-brand-blue via-brand-blue to-[#0382bd]">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Soft light from the top-left */}
        <div className="absolute -top-40 -left-40 h-[460px] w-[460px] rounded-full bg-white/10 blur-3xl pointer-events-none" />

        {/* Big orange circle slowly drifting */}
        <div className="lg-drift absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-brand-orange pointer-events-none" />
        <div className="lg-float absolute bottom-24 right-44 h-6 w-6 rounded-full bg-brand-orange pointer-events-none" />

        {/* Top: logo */}
        <div className="lg-up relative z-10 flex w-fit items-center gap-3" style={d(0)}>
          <div className="rounded-xl bg-white px-3 py-1.5 shadow-lg shadow-black/10">
            <Image
              src="/images/logo_catalyst.png"
              alt="Catalyst Biomedicals"
              width={190}
              height={56}
              unoptimized
              priority
              className="h-10 w-auto object-contain"
            />
          </div>
          <span className="relative overflow-hidden text-xs font-black bg-brand-orange px-2.5 py-1 rounded-md tracking-widest shadow-sm">
            HRMS
            <span className="lg-shimmer absolute inset-0" />
          </span>
        </div>

        {/* Middle: animated logo badge + headline */}
        <div className="relative flex flex-col items-center text-center">
          <div className="relative h-44 w-44">
            {/* Rings centred on the logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute h-[300px] w-[300px] rounded-full border border-white/15" />
              <div className="absolute h-[440px] w-[440px] rounded-full border border-white/10" />

              {/* Orbiting orange dot */}
              <div className="lg-orbit absolute h-[570px] w-[570px] rounded-full border border-white/10">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-orange shadow-lg shadow-brand-orange/50" />
              </div>

              {/* Ripples spreading from the logo */}
              <div className="lg-ripple absolute h-44 w-44 rounded-full border-2 border-white/40" style={d(0)} />
              <div className="lg-ripple absolute h-44 w-44 rounded-full border-2 border-white/40" style={d(2500)} />
            </div>

            {/* Floating glass chips (wide screens only) */}
            <div
              className="lg-float hidden xl:flex absolute -left-44 top-2 items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-2 shadow-lg shadow-black/10"
              style={{ animationDelay: "-2s" }}
            >
              <span className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold">Punched in</p>
                <p className="text-[10px] text-white/70">09:02 AM</p>
              </div>
            </div>
            <div
              className="lg-float hidden xl:flex absolute -right-44 bottom-2 items-center gap-2 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 px-3 py-2 shadow-lg shadow-black/10"
              style={{ animationDelay: "-4s" }}
            >
              <span className="h-7 w-7 rounded-lg bg-emerald-400/90 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold">Leave approved</p>
                <p className="text-[10px] text-white/70">Just now</p>
              </div>
            </div>

            {/* Logo badge, gently floating */}
            <div className="lg-pop absolute inset-0" style={d(150)}>
              <div className="lg-float h-full w-full rounded-full bg-white shadow-2xl shadow-black/25 flex items-center justify-center ring-8 ring-white/20">
                <Image
                  src="/images/icon.png"
                  alt="Catalyst Biomedical"
                  width={160}
                  height={160}
                  priority
                  className="h-36 w-36 object-contain"
                />
              </div>
            </div>
          </div>

          <h2 className="lg-up mt-16 text-4xl font-extrabold leading-tight max-w-md" style={d(350)}>
            Your work, leaves and attendance in one place.
          </h2>

          <ul className="mt-9 w-full max-w-sm space-y-3.5 text-left">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.title}
                  className="lg-up flex items-center gap-3.5"
                  style={d(550 + i * 140)}
                >
                  <span
                    className="lg-pop h-10 w-10 shrink-0 rounded-xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center"
                    style={d(700 + i * 140)}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-white/70 mt-0.5">{f.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="lg-up relative flex items-center justify-between text-xs text-white/70"
          style={d(1000)}
        >
          <p>© {currentYear ?? 2026} Catalyst Biomedical</p>
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure sign-in
          </p>
        </div>
      </aside>

      {/* ───────── Form side ───────── */}
      <main className="relative isolate flex-1 flex flex-col items-center justify-center px-5 py-10 overflow-hidden">
        {/* Soft glows */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="lg-drift absolute -top-28 -left-16 h-[340px] w-[340px] rounded-full bg-brand-blue/20 blur-[100px] dark:bg-brand-blue/15 lg:opacity-60" />
          <div
            className="lg-drift absolute -bottom-20 -right-16 h-[300px] w-[300px] rounded-full bg-brand-orange/15 blur-[100px] dark:bg-brand-orange/10 lg:opacity-60"
            style={{ animationDelay: "-5s" }}
          />
        </div>

        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg-up lg:hidden flex items-center justify-center gap-3 mb-8" style={d(0)}>
            <div className="flex items-center dark:bg-white dark:px-2.5 dark:py-1 dark:rounded-xl">
              <Image
                src="/images/o.png"
                alt="Catalyst Biomedicals"
                width={190}
                height={56}
                unoptimized
                priority
                className="h-11 w-auto object-contain"
              />
            </div>
            <span className="text-xs font-black text-white bg-brand-orange px-2.5 py-1 rounded-md tracking-widest">
              HRMS
            </span>
          </div>

          {/* Card */}
          <div className="lg-up rounded-3xl bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/80 dark:border-white/10 shadow-2xl shadow-brand-blue/10 dark:shadow-black/30 p-7 sm:p-9" style={d(100)}>
            {/* Brand accent bar (blue → orange, from the logo) */}
            <div className="h-1 w-14 rounded-full bg-gradient-to-r from-brand-blue to-brand-orange mb-6" />

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-7">
              Sign in with your employee or HR code.
            </p>

            {error && (
              <div
                role="alert"
                className="lg-up mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Employee code */}
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Employee code
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue pointer-events-none" />
                  <input
                    id="code"
                    type="text"
                    autoFocus
                    autoComplete="username"
                    placeholder="e.g. IA00141"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
                    maxLength={9}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelp((v) => !v)}
                    className="text-xs font-medium text-brand-blue hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKey}
                    onKeyUp={handleKey}
                    required
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {capsLock && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <TriangleAlert className="w-3.5 h-3.5" />
                    Caps Lock is on
                  </p>
                )}
                {showHelp && (
                  <p className="lg-up mt-2 rounded-lg bg-brand-blue/10 px-3 py-2 text-xs text-brand-blue">
                    Please contact your HR admin to reset your password.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden w-full h-12 rounded-xl bg-brand-orange hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/30"
              >
                {/* Shine sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

          </div>

          <p className="lg-up mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400" style={d(600)}>
            <ShieldCheck className="w-3.5 h-3.5" />
            © {currentYear ?? 2026} Catalyst Biomedical
          </p>
        </div>
      </main>
    </div>
  );
}