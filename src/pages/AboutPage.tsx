import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-[8rem] lg:px-0">
        {/* Hero Section */}
        <section className="space-y-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-8">
            <h1 className="text-balance text-[3.2rem] font-semibold leading-[1.04] tracking-tight text-slate-900 sm:text-[3.9rem] lg:text-[4.9rem]">
              Building the foundation for{' '}
              <span className="bg-gradient-to-r from-[#0a4da2] via-[#5538d1] to-[#9b5dfa] bg-clip-text text-transparent">
                competency-based recommender benchmarking
              </span>
            </h1>
            <p className="mx-auto max-w-4xl text-xl font-medium leading-relaxed text-slate-1000">
              A collaborative platform for collecting high-quality competency
              relationship data, enabling systematic evaluation of educational
              recommender systems.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className="h-12 rounded-full bg-[#0a4da2] px-7 text-base font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]"
              asChild
            >
              <Link to="/session">Try the Platform</Link>
            </Button>
            <Button
              className="h-12 rounded-full border border-white/70 bg-white/80 px-7 text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-200 hover:bg-white"
              asChild
            >
              <a href="#problem">Learn More</a>
            </Button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-[#0a4da2]">4 Months</div>
            <div className="mt-1 text-sm font-medium text-slate-600">
              Development Timeline
            </div>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-[#0a4da2]">2 Students</div>
            <div className="mt-1 text-sm font-medium text-slate-600">
              Collaborative Effort
            </div>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold text-[#0a4da2]">TUM</div>
            <div className="mt-1 text-sm font-medium text-slate-600">
              Technical University of Munich
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section
          id="problem"
          className="grid gap-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl scroll-mt-28"
        >
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              The Problem
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-900">
              Why We Need Standardized Benchmarks
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-white/70 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a4da2]/10">
                  <svg
                    className="h-6 w-6 text-[#0a4da2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">No Shared Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Researchers lack standardized benchmark datasets, making
                  rigorous comparison of competency-based recommender systems
                  impossible.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a4da2]/10">
                  <svg
                    className="h-6 w-6 text-[#0a4da2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">Data Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Existing platforms lack mechanisms to verify contributor
                  expertise or weight contributions based on credentials.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/60 backdrop-blur-sm transition-all hover:bg-white/80">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a4da2]/10">
                  <svg
                    className="h-6 w-6 text-[#0a4da2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <CardTitle className="text-lg">
                  Manual Curation Doesn't Scale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Current manual approaches to curating competency relationships
                  are neither scalable nor reproducible across institutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-8 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Technology
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-900">
              Built with Modern Web Technologies
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-700">
              The platform leverages industry-standard tools to ensure
              reliability, scalability, and maintainability.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { name: 'React 19', color: 'from-blue-500 to-cyan-500' },
              { name: 'TypeScript', color: 'from-blue-600 to-blue-700' },
              { name: 'Spring Boot', color: 'from-green-500 to-green-600' },
              { name: 'PostgreSQL', color: 'from-blue-700 to-indigo-800' },
              { name: 'Keycloak', color: 'from-orange-500 to-red-500' },
              { name: 'Tailwind CSS', color: 'from-cyan-500 to-blue-500' },
            ].map(tech => (
              <div
                key={tech.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#0a4da2]/30 hover:shadow-lg hover:shadow-[#0a4da2]/10"
              >
                <div className="relative z-10">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/50 transition-all duration-300 group-hover:scale-110 group-hover:from-[#0a4da2]/10 group-hover:to-[#0a4da2]/5">
                    <div
                      className={`h-6 w-6 rounded-lg bg-gradient-to-br ${tech.color} opacity-80 group-hover:opacity-100`}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-[#0a4da2]">
                    {tech.name}
                  </h3>
                </div>
                <div className="absolute inset-0 -z-0 bg-gradient-to-br from-transparent via-transparent to-[#0a4da2]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Team
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-900">
              Bachelor's Thesis Project
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-white/70 bg-white/60">
              <CardHeader>
                <CardTitle>Viktoriya Totalova</CardTitle>
                <CardDescription>
                  B.Sc. Computer Science Student, TUM
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Developing foundational infrastructure: database model,
                authentication systems, administrative interfaces, and
                production deployment.
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/60">
              <CardHeader>
                <CardTitle>Mark Stockhausen</CardTitle>
                <CardDescription>
                  B.Sc. Management & Technology Student, TUM
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Implementing contributor interface, scheduling service, and
                engagement strategies for optimal participant interaction.
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/60">
              <CardHeader>
                <CardTitle>Prof. Dr. Stephan Krusche</CardTitle>
                <CardDescription>Supervisor</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Chair of Applied Software Engineering, Technical University of
                Munich
              </CardContent>
            </Card>

            <Card className="border-white/70 bg-white/60">
              <CardHeader>
                <CardTitle>Maximilian Anzinger, M.Sc.</CardTitle>
                <CardDescription>Advisor</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Research advisor providing guidance on competency-based
                educational systems.
              </CardContent>
            </Card>
          </div>

          <div className="rounded-xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
            <strong>Timeline:</strong> December 15, 2025 – April 15, 2026
          </div>
        </section>
      </main>
    </div>
  );
}
