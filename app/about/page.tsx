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
    <div className="page-wrapper">
      <div className="blur-orb-container">
        <div className="blur-orb blur-orb-white" />
        <div className="blur-orb blur-orb-blue" />
        <div className="blur-orb blur-orb-pink" />
      </div>

      <main className="container container-xl relative z-10 flex flex-col gap-16 pb-20 pt-32">
        {/* Hero Section */}
        <section className="stack-xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="stack-lg">
            <h1 className="hero-title">
              Building the foundation for{' '}
              <span className="text-gradient-primary">
                competency-based recommender benchmarking
              </span>
            </h1>
            <p className="text-lg mx-auto max-w-4xl font-medium leading-relaxed text-slate-1000">
              A collaborative platform for collecting high-quality competency
              relationship data, enabling systematic evaluation of educational
              recommender systems.
            </p>
          </div>
          <div className="flex-center flex-wrap gap-3">
            <Button
              className="btn-primary h-12 rounded-full px-7 text-base"
              asChild
            >
              <Link href="/session">Try the Platform</Link>
            </Button>
            <Button
              className="btn-secondary h-12 rounded-full px-7 text-base"
              asChild
            >
              <Link href="#problem">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="card text-center p-6">
            <div className="heading-3 text-[#0a4da2]">4 Months</div>
            <div className="text-label mt-1 text-slate-600">
              Development Timeline
            </div>
          </div>
          <div className="card text-center p-6">
            <div className="heading-3 text-[#0a4da2]">2 Students</div>
            <div className="text-label mt-1 text-slate-600">
              Collaborative Effort
            </div>
          </div>
          <div className="card text-center p-6">
            <div className="heading-3 text-[#0a4da2]">TUM</div>
            <div className="text-label mt-1 text-slate-600">
              Technical University of Munich
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section
          id="problem"
          className="card grid gap-6 p-8 scroll-mt-28"
        >
          <div className="stack-xs">
            <Badge className="badge-default text-label-caps w-fit">
              The Problem
            </Badge>
            <h2 className="heading-4 text-slate-900">
              Why We Need Standardized Benchmarks
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="card-hover">
              <CardHeader>
                <div className="icon-container mb-3">
                  <svg
                    className="icon-primary"
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
                <CardTitle className="heading-6">No Shared Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Researchers lack standardized benchmark datasets, making
                  rigorous comparison of competency-based recommender systems
                  impossible.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="icon-container mb-3">
                  <svg
                    className="icon-primary"
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
                <CardTitle className="heading-6">Data Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Existing platforms lack mechanisms to verify contributor
                  expertise or weight contributions based on credentials.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="icon-container mb-3">
                  <svg
                    className="icon-primary"
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
                <CardTitle className="heading-6">
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
        <section className="card stack-lg p-8">
          <div className="stack-xs">
            <Badge className="badge-primary text-label-caps w-fit">
              Our Solution
            </Badge>
            <h2 className="heading-4 text-slate-900">
              Collaborative Data Collection Platform
            </h2>
            <p className="text-base max-w-3xl leading-relaxed text-slate-700">
              Memo enables educators and researchers to contribute competency
              mappings systematically, creating a high-quality benchmark dataset
              for evaluating educational recommender systems.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="feature-box">
              <div className="flex items-start gap-4">
                <div className="icon-container-sm">
                  <svg
                    className="icon-white"
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
                  <p className="text-sm mt-1 text-slate-600">
                    Captures competency relationships independent of specific
                    LMS implementations, enabling universal benchmark dataset
                    creation.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-box">
              <div className="flex items-start gap-4">
                <div className="icon-container-sm">
                  <svg
                    className="icon-white"
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
                  <p className="text-sm mt-1 text-slate-600">
                    Domain-based email verification and role-based access
                    control ensure contributions come from credible sources.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-box">
              <div className="flex items-start gap-4">
                <div className="icon-container-sm">
                  <svg
                    className="icon-white"
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
                  <p className="text-sm mt-1 text-slate-600">
                    Comprehensive tools for user management, dataset export, and
                    quality monitoring.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-box">
              <div className="flex items-start gap-4">
                <div className="icon-container-sm">
                  <svg
                    className="icon-white"
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
                  <p className="text-sm mt-1 text-slate-600">
                    Docker containerization and deployment pipelines enable
                    scalable, concurrent access across institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="section-gradient-primary">
          <div className="stack-md">
            <Badge className="badge-light">
              Impact
            </Badge>
            <h2 className="heading-4">
              Advancing Educational Technology Research
            </h2>
            <div className="grid gap-4 text-white/90 sm:grid-cols-2">
              <div className="stack-sm">
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
              <div className="stack-sm">
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
        <section className="card stack-lg p-8">
          <div className="stack-xs">
            <Badge className="badge-default text-label-caps w-fit">
              Technology
            </Badge>
            <h2 className="heading-4 text-slate-900">
              Built with Modern Web Technologies
            </h2>
            <p className="text-base max-w-2xl leading-relaxed text-slate-700">
              The platform leverages industry-standard tools to ensure
              reliability, scalability, and maintainability.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { name: 'Next.js 15', color: 'from-black to-gray-800' },
              { name: 'React 19', color: 'from-blue-500 to-cyan-500' },
              { name: 'TypeScript', color: 'from-blue-600 to-blue-700' },
              { name: 'PostgreSQL', color: 'from-blue-700 to-indigo-800' },
              { name: 'Prisma', color: 'from-teal-600 to-cyan-600' },
              { name: 'Tailwind CSS', color: 'from-cyan-500 to-blue-500' },
            ].map(tech => (
              <div
                key={tech.name}
                className="card-hover group relative overflow-hidden p-6"
              >
                <div className="relative z-10">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200/50 transition-all duration-300 group-hover:scale-110 group-hover:from-[#0a4da2]/10 group-hover:to-[#0a4da2]/5">
                    <div
                      className={`h-6 w-6 rounded-lg bg-linear-to-br ${tech.color} opacity-80 group-hover:opacity-100`}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-[#0a4da2]">
                    {tech.name}
                  </h3>
                </div>
                <div className="absolute inset-0 z-0 bg-linear-to-br from-transparent via-transparent to-[#0a4da2]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="card stack-lg p-8">
          <div className="stack-xs">
            <Badge className="badge-default text-label-caps w-fit">
              Team
            </Badge>
            <h2 className="heading-4 text-slate-900">
              Bachelor&apos;s Thesis Project
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

          <div className="info-box">
            <strong>Timeline:</strong> December 15, 2025 – April 15, 2026
          </div>
        </section>
      </main>
    </div>
  );
}
