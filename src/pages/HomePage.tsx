import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ProblemStatement = {
  headline: string;
  insight: string;
  detail: string;
};

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

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <LiquidGlassGradient />

      <main className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-4 pt-[11.5rem] lg:px-0">
        <section id="overview" className="grid items-center gap-16 pb-8">
          <div className="space-y-12">
            <div className="space-y-8">
              <h1 className="text-balance text-[3.2rem] font-semibold leading-[1.04] tracking-tight text-slate-900 sm:text-[3.9rem] lg:text-[4.9rem]">
                Personalized learning needs a{' '}
                <span className="bg-gradient-to-r from-[#0a4da2] via-[#5538d1] to-[#9b5dfa] bg-clip-text text-transparent">
                  transparent competency benchmark
                </span>
                . Let&apos;s build it together.
              </h1>
              <p className="max-w-4xl text-xl font-medium leading-relaxed text-slate-1000">
                Memo turns collaborative competency mapping into an open
                benchmark dataset for fair, reproducible evaluation of
                competency-aware recommender systems.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-full bg-[#0a4da2] px-7 text-base font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]"
                asChild
              >
                <a href="/session">Start Contributing</a>
              </Button>
            </div>
            <div className="relative flex justify-center pt-20 pb-12">
              <div className="relative w-full max-h-[520px] overflow-hidden">
                <img
                  src="/sessionPreview.png"
                  alt="Preview of a Memo competency mapping session"
                  className="mx-auto h-auto w-[90%] max-w-6xl rounded-[32px]"
                />
              </div>
              <div className="pointer-events-none absolute left-1/2 bottom-10 flex w-screen -translate-x-1/2 items-end justify-center">
                <div className="h-24 w-screen bg-gradient-to-b from-transparent via-white/70 to-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate left-1/2 right-1/2 w-screen -translate-x-1/2 transform bg-white px-6 pb-[8.5rem] pt-32 lg:px-0 -mt-56">
          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Problem
            </span>
            <div className="space-y-4">
              <h2 className="text-balance text-4xl font-semibold leading-tight text-slate-900 sm:text-[2.7rem] lg:text-[3rem]">
                Missing Benchmarks for
                <br />
                Competency-Based Recommenders
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 line-clamp-2">
                Competency-based recommenders use{' '}
                <span className="font-semibold text-slate-900">
                  competency networks
                </span>
                —graphs of skills and their relationships—to suggest learning
                content. However, reliance on custom networks and datasets makes
                results across recommender systems hard to compare and trust.
              </p>
            </div>
            <button className="w-full max-w-xl rounded-2xl border border-[#d9e6ff] bg-[#e9f1ff] px-6 py-6 text-lg font-semibold text-[#0a4da2] shadow-[0_22px_60px_-36px_rgba(7,30,84,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_-40px_rgba(7,30,84,0.45)]">
              Visualization
            </button>
          </div>
        </section>

        <section
          id="challenges"
          className="relative isolate left-1/2 right-1/2 w-screen -translate-x-1/2 transform px-6 pb-12 pt-32 lg:px-0 -mt-24"
        >
          <div className="absolute inset-0 bg-white" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_20%,rgba(255,255,255,1)_80%,rgba(255,255,255,0)_100%)]"
            aria-hidden
          />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:px-0">
            <div className="space-y-4 text-center">
              <Badge className="mx-auto w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a4da2]">
                Current Challenges
              </Badge>
              <h2 className="text-balance text-4xl font-semibold leading-tight text-slate-900 sm:text-[2.7rem] lg:text-[3rem]">
                Why Competency-Aware Recommenders Stall
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-700">
                Personalization is only as strong as the competency data beneath
                it. Incompatible graphs and opaque recommendations keep research
                and practice from compounding.
              </p>
            </div>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0a4da2] via-[#4263eb] to-[#9775fa] p-[1px] shadow-[0_32px_110px_-55px_rgba(7,30,84,0.65)] transition hover:-translate-y-1 hover:shadow-[0_36px_120px_-65px_rgba(7,30,84,0.55)]">
                <div className="absolute -left-10 top-[-12rem] h-[28rem] w-[24rem] rounded-full bg-white/20 blur-[160px]" />
                <div className="absolute right-[-8rem] bottom-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[#ffe8ff]/30 blur-[150px]" />
                <div className="relative flex h-full flex-col justify-between gap-8 rounded-[38px] bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-10 text-white backdrop-blur-2xl transition hover:bg-white/12">
                  <div className="space-y-4">
                    <Badge className="w-fit rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
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
                {otherProblems.map(problem => (
                  <div
                    key={problem.headline}
                    className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] transition hover:-translate-y-1 hover:bg-white/90"
                  >
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {problem.headline}
                      </h3>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0a4da2]">
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
          </div>
        </section>
      </main>
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
