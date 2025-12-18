import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Accordion, AccordionItem } from '../../components/ui/accordion';
import { Tabs } from '../../components/ui/tabs';

export const metadata = {
  title: 'About Us',
  description: 'About us — Memo',
};

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <LiquidGlassGradient />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Hero + Gallery Section */}
        <section className="space-y-10 px-4 py-12 sm:px-8 lg:px-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="mx-auto w-fit rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-900 shadow-sm">
              About us
            </Badge>
            <h1 className="text-balance text-[2.6rem] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[3.3rem] lg:text-[3.7rem]">
              Applied Software Engineering — Grounded in Research and{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="absolute inset-x-0 bottom-1 h-3 rounded-full bg-[#d8e4ff]" />
                <span className="relative text-[#0a4da2]">
                  Built with Partners
                </span>
              </span>{' '}
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">
              At the Chair of Applied Software Engineering (TUM), we design
              practice-first courses, competency graphs, and industry labs so
              students ship real software with academic rigor. Our teams
              publish, coach partners, and keep every cohort anchored in
              reproducible engineering.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:auto-rows-[minmax(0,1fr)] items-start">
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="flex flex-wrap lg:flex-col gap-3">
                {[
                  'Applied Software Engineering',
                  'Competency Graphs',
                  'Industry Labs',
                  'Teaching Innovation',
                ].map(label => (
                  <span
                    key={label}
                    className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
                <div className="text-3xl font-semibold text-slate-900">
                  400+
                </div>
                <div className="text-sm font-medium text-slate-600">
                  students coached each year
                </div>
              </div>
              <button className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black">
                Explore teaching
                <span className="inline-block text-base">→</span>
              </button>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md flex items-center justify-center text-slate-400 text-sm font-semibold">
                Visual placeholder
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="text-xl font-semibold leading-tight">
                      Meet our lecturers
                    </div>
                    <p className="text-sm text-white/70">
                      Coaches, researchers, and industry mentors guiding student
                      teams on architecture, AI, and continuous delivery across
                      TUM courses.
                    </p>
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15">
                      View teaching formats
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -bottom-12 h-40 w-40 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-52 w-52 rounded-full border border-white/5" />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-md flex items-center justify-center text-slate-400 text-sm font-semibold">
                Visual placeholder
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-white/70 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg rounded-[32px]">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-[#0a4da2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-[#0a4da2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base leading-relaxed text-slate-600">
              We address complex problems with agile methods and continuous
              software engineering. Our work focuses on AI-powered educational
              technologies, project-based learning, and practical courses that
              prepare students for real-world challenges.
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-white/70 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg rounded-[32px]">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-[#0a4da2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-[#0a4da2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">
                iPraktikum
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base leading-relaxed text-slate-600">
              iPraktikum pairs students with industry partners to build
              production-ready applications. Students gain hands-on skills
              including CI/CD, usability testing, and full-stack development
              while delivering value to real clients.
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-white/70 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg rounded-[32px]">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-[#0a4da2]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-[#0a4da2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base leading-relaxed text-slate-600">
              AET works with universities and industry partners (BMW, Bosch,
              Capgemini, ETH, and more) to scale projects and bring real-world
              contexts into teaching.
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              How We Work
            </h2>
            <p className="text-base leading-relaxed text-slate-600 max-w-3xl mx-auto">
              We pair research-backed methods with rapid prototyping, invite
              partners into our studios early, and share what we learn through
              open assets and reproducible workflows. Every initiative is
              treated as a pilot that we iterate in the open before scaling.
            </p>
            <p className="text-base leading-relaxed text-slate-600 max-w-3xl mx-auto">
              Teams rotate between discovery, delivery, and reflection cycles so
              students, faculty, and industry mentors stay aligned. We keep our
              playbooks lightweight—clear success metrics, transparent retros,
              and artifacts anyone can reuse.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Passionate educators, researchers, and engineers dedicated to
              transforming software education.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Photo
              </div>
              <div className="text-center space-y-1">
                <div className="font-semibold text-slate-900">
                  Prof. Dr. Stephan Krusche
                </div>
                <div className="text-sm text-slate-600">Group Lead</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Photo
              </div>
              <div className="text-center space-y-1">
                <div className="font-semibold text-slate-900">
                  Dr. Research Lead
                </div>
                <div className="text-sm text-slate-600">Senior Researcher</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Photo
              </div>
              <div className="text-center space-y-1">
                <div className="font-semibold text-slate-900">Tech Lead</div>
                <div className="text-sm text-slate-600">Software Architect</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Photo
              </div>
              <div className="text-center space-y-1">
                <div className="font-semibold text-slate-900">
                  Education Specialist
                </div>
                <div className="text-sm text-slate-600">Pedagogy Expert</div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Offerings with Tabs */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Course Offerings
            </h2>
            <p className="text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Comprehensive programs from undergraduate basics to advanced
              graduate projects.
            </p>
          </div>
          <Tabs
            items={[
              {
                id: 'undergraduate',
                title: 'Undergraduate',
                content: (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Introduction to Software Engineering
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn the fundamentals of software development,
                          version control, testing, and agile methodologies.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            Beginner Friendly
                          </Badge>
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            6 ECTS
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Web Development Fundamentals
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Build modern web applications using HTML, CSS,
                          JavaScript, and popular frameworks.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            Hands-on
                          </Badge>
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            5 ECTS
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ),
              },
              {
                id: 'graduate',
                title: 'Graduate',
                content: (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          iPraktikum - Industry Project
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Work with real industry partners on production
                          applications, gaining professional development
                          experience.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-yinmn-blue/80 text-white dark:bg-yinmn-blue/90 dark:text-white">
                            Advanced
                          </Badge>
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            10 ECTS
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          AI in Education Technologies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Explore how artificial intelligence can enhance
                          teaching and learning experiences.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-yinmn-blue/80 text-white dark:bg-yinmn-blue/90 dark:text-white">
                            Research-Focused
                          </Badge>
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            8 ECTS
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ),
              },
              {
                id: 'workshops',
                title: 'Workshops',
                content: (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Git & Version Control Workshop
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Master Git workflows, branching strategies, and
                          collaborative development practices.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            Half-Day
                          </Badge>
                          <Badge className="bg-uranian-blue/30 text-yinmn-blue dark:bg-uranian-blue/40 dark:text-white">
                            All Levels
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          CI/CD & DevOps Essentials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn continuous integration, deployment pipelines,
                          and modern DevOps practices.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-air-superiority-blue/30 text-yinmn-blue dark:bg-air-superiority-blue/40 dark:text-white">
                            Full-Day
                          </Badge>
                          <Badge className="bg-yinmn-blue/80 text-white dark:bg-yinmn-blue/90 dark:text-white">
                            Intermediate
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about our programs and partnerships.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion>
              <AccordionItem title="What is iPraktikum?">
                iPraktikum is our flagship project-based course where students
                work in teams with industry partners to develop real-world
                software applications. Students gain hands-on experience with
                modern development practices, agile methodologies, and
                professional software engineering workflows.
              </AccordionItem>
              <AccordionItem title="How can I participate in AET courses?">
                AET courses are available to TUM students through the regular
                course registration system. Check the course catalog for
                prerequisites, available slots, and registration deadlines. Some
                courses may require prior programming experience or specific
                technical knowledge.
              </AccordionItem>
              <AccordionItem title="Do you offer courses for beginners?">
                Yes! We offer several beginner-friendly courses including
                Introduction to Software Engineering and Web Development
                Fundamentals. These courses assume no prior programming
                experience and provide a solid foundation in software
                development.
              </AccordionItem>
              <AccordionItem title="Can industry partners collaborate with AET?">
                Absolutely! We actively seek partnerships with industry
                organizations for student projects, research collaborations, and
                course development. Contact us to discuss potential
                collaboration opportunities.
              </AccordionItem>
              <AccordionItem title="What technologies and tools do students learn?">
                Students work with modern technologies including Git, CI/CD
                pipelines, cloud platforms, popular programming languages and
                frameworks, testing tools, and agile project management systems.
                The specific tech stack varies by course and project
                requirements.
              </AccordionItem>
            </Accordion>
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
