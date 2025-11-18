'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ProblemStatement = {
  headline: string;
  insight: string;
  detail: string;
};

// const heroStats = [
//   { value: 'Computer Science', label: 'Pilot Domain' },
//   { value: 'Nov 2025', label: 'Target Start' },
//   { value: 'Jan 2026', label: 'Benchmark Release' },
// ]

const problemStatements: ProblemStatement[] = [
  {
    headline: 'No standardized benchmark',
    insight: 'Fragmented and Non-Reproducible Evaluations.',
    detail:
      'Competency-aware recommenders are still judged on small, proprietary, or ad hoc datasets, making results hard to compare or reproduce.',
  },
  {
    headline: 'Inconsistent competency graphs',
    insight: 'Core relations are incomplete or modeled differently everywhere.',
    detail:
      'Relations such as prerequisite, assumes and part-of are missing or incompatible across sources, preventing clean alignment and pathing.',
  },
  {
    headline: 'Ambiguous skill granularity',
    insight: 'Competencies are scoped inconsistently.',
    detail:
      'Skills are modeled at wildly different levels of detail across systems, blocking clean alignment, benchmarking, and path planning.',
  },
];
const [leadProblem, ...otherProblems] = problemStatements;

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <LiquidGlassGradient />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10 lg:px-0">
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
            <a href="#challenges">Current Challenges</a>
          </Button>
          <Button className="h-12 rounded-full bg-[#0a4da2] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]">
            Start Mapping
          </Button>
        </div>
      </header>

      <main className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-32 pt-48 lg:px-0">
        <section id="overview" className="grid items-center gap-16 pb-8">
          <div className="space-y-12">
            <div className="space-y-8">
              <h1 className="text-balance text-[3.2rem] font-semibold leading-[1.04] tracking-tight text-slate-900 sm:text-[3.9rem] lg:text-[4.9rem]">
                Personalized learning needs a{' '}
                <span className="bg-gradient-to-r from-[#0a4da2] via-[#5538d1] to-[#9b5dfa] bg-clip-text text-transparent">
                  transparent competency benchmark
                </span>
                . Let’s build it together.
              </h1>
              <p className="max-w-4xl text-xl leading-relaxed text-slate-1000">
                Memo brings people together to build and validate shared
                competency networks to create the trusted data foundation
                recommender systems need for meaningful evaluation.{' '}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="h-12 rounded-full bg-[#0a4da2] px-7 text-base font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]">
                Discover Platform
              </Button>
            </div>
            {/* <div className="grid gap-5 pt-10 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-white/70 bg-white/80 px-6 py-6 text-left text-slate-600 shadow-[0_22px_70px_-38px_rgba(7,30,84,0.55)] backdrop-blur-xl"
                >
                  <div className="text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</div>
                  <p className="mt-2 text-sm leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div> */}
          </div>

          {/* <div className="flex flex-col justify-center gap-6">
            <HeroSlideCard slide={heroHighlight} progress={100} />
          </div> */}
        </section>

        <section id="challenges" className="space-y-10">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]">
              Current Challenges
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Why competency-aware recommenders stall
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              Personalization is only as strong as the competency data beneath it. Incompatible graphs
              and opaque recommendations keep research and practice from compounding.
            </p>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0a4da2] via-[#4263eb] to-[#9775fa] p-[1px] shadow-[0_32px_110px_-55px_rgba(7,30,84,0.65)] transition hover:-translate-y-1 hover:shadow-[0_36px_120px_-65px_rgba(7,30,84,0.55)]">
              <div className="absolute -left-10 top-[-12rem] h-[28rem] w-[24rem] rounded-full bg-white/20 blur-[160px]" />
              <div className="absolute right-[-8rem] bottom-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[#ffe8ff]/30 blur-[150px]" />
              <div className="relative flex h-full flex-col justify-between gap-8 rounded-[38px] bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-10 text-white backdrop-blur-2xl transition hover:bg-white/12">
                <div className="space-y-4">
                  <Badge className="w-fit rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                    {leadProblem.insight}
                  </Badge>
                  <h3 className="text-3xl font-semibold leading-snug sm:text-4xl">
                    {leadProblem.headline}
                  </h3>
                  <p className="max-w-2xl text-base leading-relaxed text-white/80">
                    {leadProblem.detail}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {otherProblems.map((problem, _index) => (
                <div
                  key={problem.headline}
                  className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] transition hover:-translate-y-1 hover:bg-white/90"
                >
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {problem.headline}
                    </h3>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0a4da2]">
                      {problem.insight}
                    </div>
                    <p className="text-base leading-relaxed text-slate-600">
                      {problem.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-20 border-t border-slate-200/70 bg-white/80 text-sm text-slate-500 shadow-[0_-15px_60px_-45px_rgba(7,30,84,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-0">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-sm font-semibold">Memo Benchmark Platform</span>
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

function LiquidGlassGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(237,242,255,0.6))]" />
      <div className="absolute left-1/2 top-[-8rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-[50%] bg-white/80 blur-[140px] opacity-85 mix-blend-screen" />
      <div className="absolute left-[12%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/40 blur-[120px] mix-blend-screen" />
      <div className="absolute right-[18%] top-[30%] h-[26rem] w-[24rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/65 via-[#fff3f8]/45 to-transparent blur-[150px] mix-blend-screen" />
      <div className="absolute bottom-[-10rem] left-1/2 h-[36rem] w-[50rem] -translate-x-1/2 rounded-[220px] bg-white/70 blur-[160px] opacity-95 mix-blend-screen" />
      <div className="absolute left-1/3 top-[58%] h-72 w-72 rounded-full bg-[#9ce8d1]/35 blur-[130px] mix-blend-screen" />
    </div>
  );
}
