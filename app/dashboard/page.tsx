import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <header className="relative z-10 mx-auto flex w/full max-w-6xl items-center justify-between px-6 py-10 lg:px-0">
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
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-20 lg:mt-12 lg:px-0">
        <section className="space-y-3 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <Badge className="w-fit rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a4da2]">
            Overview
          </Badge>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Contributor dashboard (placeholder)
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-700">
            Progress, streaks, and badges are mocked for now. Backend, auth, and
            persistence are out of scope.
          </p>
        </section>

        <section className="grid gap-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Total mappings (example)
            </p>
            <p className="text-3xl font-semibold text-slate-900">42</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Streak
            </p>
            <p className="text-3xl font-semibold text-slate-900">3 days</p>
            <p className="text-sm text-slate-600">
              You mapped on 3 days in a row.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Badges
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>First 10 mappings</li>
              <li>Consistency</li>
              <li>Session finisher</li>
            </ul>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-full border-white/70 bg-white/80 text-slate-800 hover:border-slate-200"
            asChild
          >
            <Link href="/session">Start New Session</Link>
          </Button>
          <Button
            className="rounded-full bg-[#0a4da2] px-6 text-sm font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] hover:bg-[#0d56b5]"
            asChild
          >
            <Link href="/">Back to Landing</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
