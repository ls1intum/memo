import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'About the Project',
  description: 'About Memo — Competency-Based Benchmarking Platform',
};

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-[7rem] lg:px-0">
        {/* Hero Section */}
        <section className="space-y-12 text-center">
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
              <Link href="/session">Try the Platform</Link>
            </Button>
            <Button
              className="h-12 rounded-full border border-white/70 bg-white/80 px-7 text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-200 hover:bg-white"
              asChild
            >
              <Link href="/onboarding">Learn More</Link>
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
        <section className="grid gap-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
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
                  Manual Curation Doesn&apos;t Scale
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

        {/* Solution Section */}
        <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <div className="space-y-3">
            <Badge className="w-fit rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a4da2]">
              Our Solution
            </Badge>
            <h2 className="text-2xl font-semibold text-slate-900">
              Collaborative Data Collection Platform
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-slate-700">
              Memo enables educators and researchers to contribute competency
              mappings systematically, creating a high-quality benchmark dataset
              for evaluating educational recommender systems.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a4da2]">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Generalized Database Model
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Captures competency relationships independent of specific
                    LMS implementations, enabling universal benchmark dataset
                    creation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a4da2]">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Verified Contributors
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Domain-based email verification and role-based access
                    control ensure contributions come from credible sources.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a4da2]">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Admin Interfaces
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Comprehensive tools for user management, dataset export, and
                    quality monitoring.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a4da2]">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Production Infrastructure
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Docker containerization and deployment pipelines enable
                    scalable, concurrent access across institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="rounded-[32px] border border-white/70 bg-gradient-to-br from-[#0a4da2] via-[#4263eb] to-[#9775fa] p-8 text-white shadow-[0_32px_110px_-55px_rgba(7,30,84,0.65)]">
          <div className="space-y-4">
            <Badge className="w-fit rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Impact
            </Badge>
            <h2 className="text-2xl font-semibold">
              Advancing Educational Technology Research
            </h2>
            <div className="grid gap-4 text-white/90 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm">
                    Enable systematic evaluation of competency-aware recommender
                    systems
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm">
                    Facilitate empirical validation of pedagogical theories
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm">
                    Support cross-institutional comparative studies
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm">
                    Accelerate development of personalized learning systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              'Next.js 15',
              'React 19',
              'TypeScript',
              'PostgreSQL',
              'Prisma',
              'Tailwind CSS',
              'Docker',
              'Zustand',
              'TanStack Query',
              'shadcn/ui',
            ].map(tech => (
              <div
                key={tech}
                className="rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-white/80"
              >
                {tech}
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
              Bachelor&apos;s Thesis Project
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-white/70 bg-white/60">
              <CardHeader>
                <CardTitle>Viktoriya Totalova</CardTitle>
                <CardDescription>
                  Bachelor Computer Science Student
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
                <CardDescription>TUM BWL Student</CardDescription>
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
