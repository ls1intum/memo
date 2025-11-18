import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const experienceOptions = ['Beginner', 'Intermediate', 'Expert'];

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10 lg:px-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-[0.08em] text-slate-900">
            Competency Benchmark Mapping Platform
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="hidden h-12 rounded-full border border-white/70 bg-white/80 px-7 text-sm font-semibold text-slate-900 shadow-[0_14px_38px_-30px_rgba(7,30,84,0.55)] transition hover:border-slate-200 hover:bg-white md:inline-flex"
            asChild
          >
            <Link href="/">Back to Start</Link>
          </Button>
          <Button
            className="h-12 rounded-full bg-[#0a4da2] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]"
            asChild
          >
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 pb-20 lg:px-0">
        <section className="space-y-3 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <Badge className="w-fit rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a4da2]">
            Onboarding
          </Badge>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Tell us how you want to map
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-700">
            Map competency–competency relations and align resources one focused
            task at a time. Your inputs help build reproducible benchmark data.
          </p>
        </section>

        <section className="grid gap-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl sm:grid-cols-2">
          <form className="space-y-5">
            <label className="block space-y-2 text-sm font-medium text-slate-800">
              Alias or name
              <input
                type="text"
                placeholder="Optional"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#0a4da2] focus:outline-none"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-800">
              Experience level (optional)
              <select className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#0a4da2] focus:outline-none">
                <option value="">Select level</option>
                {experienceOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0a4da2] focus:ring-[#0a4da2]"
              />
              <span>
                I consent to my mappings being used as ground-truth benchmark
                data.
              </span>
            </label>
          </form>

          <div className="space-y-4 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Quick primer
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Competency ↔ Competency: prerequisite, similarity, part-of
                relations.
              </li>
              <li>
                Competency ↔ Resource: align exercises, quizzes, and papers to
                the best competency fit.
              </li>
              <li>
                Short sessions: we queue focused tasks; you decide add, skip, or
                undo.
              </li>
            </ul>
            <p className="rounded-xl bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
              No account needed. Data is mock-only for now.
            </p>
          </div>
        </section>

        <div className="flex justify-end">
          <Button className="rounded-full bg-[#0a4da2] px-6 text-sm font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] hover:bg-[#0d56b5]">
            <Link href="/session">Continue to session</Link>
          </Button>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200/70 bg-white/80 text-sm text-slate-500 shadow-[0_-15px_60px_-45px_rgba(7,30,84,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-0">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-sm font-semibold">
              Memo Benchmark Platform
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
            <a className="transition hover:text-slate-900" href="#overview">
              Overview
            </a>
            <a className="transition hover:text-slate-900" href="#challenges">
              Challenges
            </a>
          </div>
          <div className="text-slate-400">
            © {new Date().getFullYear()} Memo
          </div>
        </div>
      </footer>
    </div>
  );
}
