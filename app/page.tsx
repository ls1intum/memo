'use client';

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type HeroSlide = {
  tag: string
  title: string
  description: string
  bullets: string[]
  gradient: string
}

type ProblemStatement = {
  headline: string
  insight: string
  detail: string
}

type ApproachPillar = {
  title: string
  description: string
  bullets: string[]
}

// const heroStats = [
//   { value: 'Computer Science', label: 'Pilot Domain' },
//   { value: 'Nov 2025', label: 'Target Start' },
//   { value: 'Jan 2026', label: 'Benchmark Release' },
// ]

const heroHighlight: HeroSlide = {
  tag: 'Benchmark Engine',
  title: 'Curate reproducible evaluation drops',
  description:
    'Freeze competency-resource graphs into transparent benchmark releases with diagnostics and provenance baked in.',
  bullets: [
    'Fairness-ready slices to compare recommenders across cohorts',
    'Alignment strength, licensing, and contributor lineage captured automatically',
    'Versioned exports with scripts so teams can reproduce results instantly',
  ],
  gradient: 'from-[#3b5bdb] via-[#5538d1] to-[#9775fa]',
}

const valueHighlights = [
  {
    tag: 'Benchmark',
    title: 'A growing competency atlas',
    description:
      'Collaboratively curate networks across courses, programs, and institutions with a shared schema and visual oversight.',
  },
  {
    tag: 'Quality signals',
    title: 'Trusted data, ready for evaluation',
    description:
      'Provenance, licensing, and confidence scores travel with every mapping so recommenders inherit reliable context.',
  },
  {
    tag: 'Open evaluation',
    title: 'Benchmarking without barriers',
    description:
      'Frozen datasets, diagnostic slices, and reference pipelines make recommender comparisons reproducible and comparable.',
  },
  {
    tag: 'Contributor first',
    title: 'Delightful mapping experience',
    description:
      'Soft onboarding, responsive controls, and gentle rewards help experts stay engaged without sacrificing data quality.',
  },
]

const [primaryHighlight, ...supportingHighlights] = valueHighlights

const problemStatements: ProblemStatement[] = [
  {
    headline: 'Fragmented competency data',
    insight: 'Schemas vary by institution and miss essential relations.',
    detail:
      'Without a shared structure, prerequisite and similarity links disappear, preventing coherent learning pathways and fair evaluation baselines.',
  },
  {
    headline: 'Opaque recommendations',
    insight: 'Learners and educators cannot audit decisions.',
    detail:
      'Recommenders lean on implicit signals, leaving curricula misaligned and progress tracking anecdotal instead of evidence-based.',
  },
  {
    headline: 'Stalled research progress',
    insight: 'Results are not comparable across datasets.',
    detail:
      'When benchmarks differ in coverage and quality, algorithmic advances are impossible to compare, slowing down innovation for the whole field.',
  },
]

const approachPillars: ApproachPillar[] = [
  {
    title: 'Contributor Studio',
    description:
      'Give experts a calm, productivity-grade workspace to map competencies without spreadsheets or scripts.',
    bullets: [
      'Guided tasks for competency-to-competency and competency-to-resource mappings',
      'Inline validation, keyboard controls, and instant preview diffs',
      'Progress cues and session summaries that reward accuracy over volume',
    ],
  },
  {
    title: 'Prioritisation Engine',
    description:
      'Surface the next best task using transparent signals so every contribution increases coverage and confidence.',
    bullets: [
      'Balanced task selection across sparse domains and emerging topics',
      'Consensus detection to flag inconsistencies before they reach the benchmark',
      'Campaign tooling for cohort sprints, classrooms, and partner programmes',
    ],
  },
  {
    title: 'Benchmark Release Hub',
    description:
      'Package validated graphs into reproducible drops that help researchers and institutions measure progress.',
    bullets: [
      'Versioned exports with diagnostics, provenance, and licensing metadata',
      'Reference evaluation scripts for quick experimentation and comparison',
      'Fairness-ready slices to analyse impact across learner cohorts',
    ],
  },
]

const [leadPillar, ...otherPillars] = approachPillars

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <LiquidGlassGradient />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-10 lg:px-0">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/70 bg-white shadow-[0_15px_40px_-25px_rgba(7,30,84,0.6)]">
            <span aria-hidden="true" className="text-2xl">🕸️</span>
          </div>
          <span className="text-sm font-medium tracking-[0.08em] text-slate-600">
            Memo Benchmark
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden rounded-full px-4 text-sm font-medium tracking-[0.08em] text-slate-500 hover:bg-white/80 hover:text-slate-900 md:inline-flex"
            asChild
          >
            <a href="#highlights">Product Highlights</a>
          </Button>
          <Button className="h-10 rounded-full bg-[#0a4da2] px-5 text-sm font-medium tracking-[0.08em] text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]">
            Start Mapping
          </Button>
        </div>
      </header>

      <main className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-32 pt-40 lg:px-0">
        <section
          id="overview"
          className="grid items-center gap-16"
        >
          <div className="space-y-12">
            <div className="space-y-8">
              <h1 className="text-balance text-[3.2rem] font-semibold leading-[1.04] tracking-tight text-slate-900 sm:text-[3.9rem] lg:text-[4.9rem]">
                Personalized learning needs a
                {' '}
                <span className="bg-gradient-to-r from-[#0a4da2] via-[#5538d1] to-[#9b5dfa] bg-clip-text text-transparent">
                  transparent competency benchmark
                </span>
                . Let’s build it together.
              </h1>
              <p className="max-w-4xl text-xl leading-relaxed text-slate-1000">
              Memo brings people together to build and validate shared competency networks to create the trusted data foundation recommender systems need for meaningful evaluation.              </p>
              
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="h-12 rounded-full bg-[#0a4da2] px-7 text-sm font-semibold text-white shadow-[0_24px_60px_-28px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]">
                Discover the platform
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

        <section id="highlights" className="space-y-10">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]">
              Highlights
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Built to support research, teaching, and learners
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              Every detail is designed to make competency mapping approachable while producing benchmark-quality data for
              recommender evaluation.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-white via-white/80 to-[#dbe4ff]/60 p-[1px] shadow-[0_32px_120px_-60px_rgba(7,30,84,0.6)]">
            <div className="absolute left-1/4 top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#91a7ff]/25 blur-[140px]" />
            <div className="absolute right-0 bottom-[-10rem] h-[26rem] w-[20rem] rounded-full bg-[#ffd6ff]/35 blur-[140px]" />
            <div className="relative grid gap-12 rounded-[46px] bg-white/75 p-8 backdrop-blur-2xl lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-12">
              <div className="space-y-6">
                <Badge className="w-fit rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]">
                  {primaryHighlight.tag}
                </Badge>
                <h3 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  {primaryHighlight.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                  {primaryHighlight.description}
                </p>
              </div>
              <div className="grid gap-6">
                {supportingHighlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_85px_-50px_rgba(7,30,84,0.45)] transition hover:-translate-y-1 hover:bg-white/90"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#0a4da2] via-[#748ffc] to-[#4dabf7]" />
                    <div className="space-y-2 pl-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#0a4da2]/80">
                        {highlight.tag}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{highlight.title}</h4>
                      <p className="text-sm leading-relaxed text-slate-600">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="space-y-10">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]">
              Challenges
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              What is holding competency-aware recommenders back?
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              Institutions, researchers, and learners all struggle when competency data is inconsistent, opaque, or
              inaccessible. Memo Benchmark addresses the bottlenecks head-on.
            </p>
          </div>
          <div className="relative rounded-[48px] border border-white/70 bg-white/75 p-10 shadow-[0_26px_90px_-50px_rgba(7,30,84,0.45)] backdrop-blur-2xl">
            <div className="absolute left-8 top-6 bottom-6 w-px bg-gradient-to-b from-[#0a4da2]/40 via-[#4dabf7]/20 to-transparent" />
            <div className="space-y-10">
              {problemStatements.map((problem, index) => (
                <div key={problem.headline} className="relative pl-14">
                  <div className="absolute left-7 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#0a4da2] shadow-[0_0_0_6px_rgba(10,77,162,0.1)]" />
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]/80">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{problem.headline}</div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-[#0a4da2]">
                    {problem.insight}
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{problem.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="space-y-10">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-white/70 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]">
              Our Approach
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A platform that unites contributors and researchers
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              Memo Benchmark pairs a contributor-first experience with transparent prioritisation and reproducible
              benchmark releases.
            </p>
          </div>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0a4da2] via-[#4263eb] to-[#9775fa] p-[1px] shadow-[0_32px_110px_-55px_rgba(7,30,84,0.65)]">
              <div className="absolute -left-10 top-[-12rem] h-[28rem] w-[24rem] rounded-full bg-white/20 blur-[160px]" />
              <div className="absolute right-[-8rem] bottom-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[#ffe8ff]/30 blur-[150px]" />
              <div className="relative flex h-full flex-col justify-between gap-8 rounded-[38px] bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-10 text-white backdrop-blur-2xl">
                <div className="space-y-4">
                  <Badge className="w-fit rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                    {leadPillar.title}
                  </Badge>
                  <h3 className="text-3xl font-semibold leading-snug sm:text-4xl">{leadPillar.description}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-white/80">
                    Together, the studio, prioritisation engine, and benchmark hub form a loop that keeps competency data current, high-signal, and evaluation-ready.
                  </p>
                </div>
                <ul className="space-y-3">
                  {leadPillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                      <span className="mt-[6px] inline-flex h-1.5 w-6 rounded-full bg-white/60" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              {otherPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] transition hover:-translate-y-1 hover:bg-white/90"
                >
                  <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-[#0a4da2]/0 via-[#4dabf7]/50 to-[#0a4da2]/0" />
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{pillar.description}</p>
                    <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      {pillar.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-3 leading-relaxed shadow-[0_14px_45px_-35px_rgba(7,30,84,0.4)]"
                        >
                          <span className="mt-[6px] inline-flex h-1.5 w-1.5 rounded-full bg-[#0a4da2]/60" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="relative overflow-hidden rounded-[48px] border border-white/60 bg-gradient-to-br from-white via-white/80 to-[#edf2ff]/70 p-[1px] shadow-[0_32px_120px_-60px_rgba(7,30,84,0.6)]"
        >
          <div className="absolute left-[-10%] top-[-30%] h-[30rem] w-[30rem] rounded-full bg-[#b2c8ff]/35 blur-[150px]" />
          <div className="absolute right-[-15%] bottom-[-25%] h-[32rem] w-[32rem] rounded-full bg-[#ffe2ff]/40 blur-[160px]" />
          <div className="relative mx-auto grid max-w-5xl gap-10 rounded-[46px] bg-white/75 p-10 text-center backdrop-blur-2xl sm:p-12">
            <div className="space-y-4">
              <Badge className="w-fit rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#0a4da2]">
                Get Involved
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Help shape the competency benchmark movement
              </h2>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600">
                We are partnering with institutions and researchers to pilot Memo Benchmark. Join the beta circle to access
                guided onboarding, quarterly dataset drops, and direct input into the roadmap.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="h-12 rounded-full bg-[#0a4da2] px-8 text-sm font-semibold text-white shadow-[0_22px_60px_-30px_rgba(7,30,84,0.7)] hover:bg-[#0d56b5]">
                Join early access
              </Button>
              <Button
                variant="ghost"
                className="h-12 rounded-full border border-white/70 bg-white/75 px-8 text-sm font-semibold text-slate-600 shadow-[0_18px_55px_-38px_rgba(7,30,84,0.45)] hover:bg-white/85 hover:text-slate-900"
              >
                Book a walkthrough
              </Button>
            </div>
          </div>
        </section>


      </main>

      <footer className="relative z-20 border-t border-slate-200/70 bg-white/80 text-sm text-slate-500 shadow-[0_-15px_60px_-45px_rgba(7,30,84,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/85 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0a4da2] shadow-[0_12px_45px_-30px_rgba(7,30,84,0.4)]">
              TUM
            </div>
            <span>Memo Benchmark Platform</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <a className="transition hover:text-slate-900" href="#overview">
              Overview
            </a>
            <a className="transition hover:text-slate-900" href="#problem">
              Challenges
            </a>
            <a className="transition hover:text-slate-900" href="#approach">
              Our Approach
            </a>
            <a className="transition hover:text-slate-900" href="#cta">
              Get Involved
            </a>
          </div>
          <div className="text-slate-400">© {new Date().getFullYear()} Technical University of Munich</div>
        </div>
      </footer>
    </div>
  )
}

function HeroSlideCard({ slide, progress }: { slide: HeroSlide; progress: number }) {
  return (
    <Card className="relative overflow-hidden border border-white/60 bg-white/80 shadow-[0_28px_85px_-48px_rgba(7,30,84,0.55)] backdrop-blur-2xl">
      <div
        className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${slide.gradient} opacity-90`}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col gap-5 rounded-[32px] p-8 text-white">
        <div className="flex flex-col gap-3">
          <Badge className="w-fit rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
            {slide.tag}
          </Badge>
          <h3 className="text-2xl font-semibold leading-snug sm:text-3xl">{slide.title}</h3>
          <p className="text-sm leading-relaxed text-white/80 sm:text-base">{slide.description}</p>
        </div>
        <ul className="space-y-3">
          {slide.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm leading-relaxed text-white/85">
              <span className="mt-[6px] inline-flex h-1.5 w-1.5 rounded-full bg-white/70" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  )
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
  )
}
