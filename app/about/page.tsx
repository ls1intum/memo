import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Accordion, AccordionItem } from '../../components/ui/accordion';
import { Tabs } from '../../components/ui/tabs';
import { Avatar } from '../../components/ui/avatar';
import Image from 'next/image';

export const metadata = {
  title: 'About Us',
  description: 'About us — Memo',
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-uranian-blue/20 dark:to-yinmn-blue/10">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <header className="text-center space-y-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue rounded-full blur-lg opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-1">
                <Image
                  src="/technical-university-of-munich-tum-logo-vector.svg"
                  alt="TUM Logo"
                  width={200}
                  height={60}
                  className="transition-transform group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-air-superiority-blue dark:via-air-superiority-blue dark:to-uranian-blue bg-clip-text text-transparent leading-relaxed pb-2">
              Applied Education Technologies
            </h1>
            <p className="text-xl text-muted-foreground">Memo Demo Platform</p>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The Applied Education Technologies (AET) group develops educational technologies
              and course formats to make hands-on computing education more accessible, project-based,
              and impactful. We collaborate with industry and academic partners to design practical
              learning experiences, real client projects, and AI-powered tools that support teaching
              and learning.
            </p>
          </div>
        </header>

        {/* Core Values Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-air-superiority-blue/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-uranian-blue/40 dark:bg-air-superiority-blue/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-yinmn-blue dark:text-air-superiority-blue"
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
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              We address complex problems with agile methods and continuous software engineering.
              Our work focuses on AI-powered educational technologies, project-based learning, and
              practical courses that prepare students for real-world challenges.
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-air-superiority-blue/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-uranian-blue/40 dark:bg-air-superiority-blue/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-yinmn-blue dark:text-air-superiority-blue"
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
              <CardTitle>iPraktikum</CardTitle>
            </CardHeader>
            <CardContent>
              iPraktikum pairs students with industry partners to build production-ready applications.
              Students gain hands-on skills including CI/CD, usability testing, and full-stack
              development while delivering value to real clients.
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-air-superiority-blue/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-uranian-blue/40 dark:bg-air-superiority-blue/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-yinmn-blue dark:text-air-superiority-blue"
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
              <CardTitle>Partners</CardTitle>
            </CardHeader>
            <CardContent>
              AET works with universities and industry partners (BMW, Bosch, Capgemini, ETH, and more)
              to scale projects and bring real-world contexts into teaching.
            </CardContent>
          </Card>
        </section>

        {/* Projects Section */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-air-superiority-blue dark:to-air-superiority-blue bg-clip-text text-transparent mb-2">
              Projects & Highlights
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-air-superiority-blue/10 to-transparent rounded-full -mr-20 -mt-20"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yinmn-blue to-air-superiority-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <CardTitle>LEARN-Kit</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  A modular teaching kit for hands-on CS workshops that supports inclusive, practical
                  learning experiences for classrooms and outreach.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="px-3 py-1 rounded-full bg-uranian-blue/50 text-yinmn-blue dark:bg-air-superiority-blue/30 dark:text-air-superiority-blue">
                    Education
                  </Badge>
                  <Badge className="px-3 py-1 rounded-full bg-uranian-blue/50 text-yinmn-blue dark:bg-air-superiority-blue/30 dark:text-air-superiority-blue">
                    Workshops
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-air-superiority-blue/10 to-transparent rounded-full -mr-20 -mt-20"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yinmn-blue to-air-superiority-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <CardTitle>Research & Publications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Recent work includes peer assessment studies, dynamic GUI testing for auto-graders,
                  and virtual prototyping for industrial design reviews.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="px-3 py-1 rounded-full bg-uranian-blue/50 text-yinmn-blue dark:bg-air-superiority-blue/30 dark:text-air-superiority-blue">
                    Research
                  </Badge>
                  <Badge className="px-3 py-1 rounded-full bg-uranian-blue/50 text-yinmn-blue dark:bg-air-superiority-blue/30 dark:text-air-superiority-blue">
                    Innovation
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-uranian-blue/50 to-air-superiority-blue/30 dark:from-yinmn-blue/20 dark:to-air-superiority-blue/20 border border-air-superiority-blue/30 dark:border-air-superiority-blue/40 hover:scale-105 transition-transform duration-300 shadow-md">
            <div className="text-3xl font-bold text-yinmn-blue dark:text-air-superiority-blue mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-uranian-blue/50 to-air-superiority-blue/30 dark:from-yinmn-blue/20 dark:to-air-superiority-blue/20 border border-air-superiority-blue/30 dark:border-air-superiority-blue/40 hover:scale-105 transition-transform duration-300 shadow-md">
            <div className="text-3xl font-bold text-yinmn-blue dark:text-air-superiority-blue mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-uranian-blue/50 to-air-superiority-blue/30 dark:from-yinmn-blue/20 dark:to-air-superiority-blue/20 border border-air-superiority-blue/30 dark:border-air-superiority-blue/40 hover:scale-105 transition-transform duration-300 shadow-md">
            <div className="text-3xl font-bold text-yinmn-blue dark:text-air-superiority-blue mb-1">20+</div>
            <div className="text-sm text-muted-foreground">Partners</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-uranian-blue/50 to-air-superiority-blue/30 dark:from-yinmn-blue/20 dark:to-air-superiority-blue/20 border border-air-superiority-blue/30 dark:border-air-superiority-blue/40 hover:scale-105 transition-transform duration-300 shadow-md">
            <div className="text-3xl font-bold text-yinmn-blue dark:text-air-superiority-blue mb-1">10+</div>
            <div className="text-sm text-muted-foreground">Years</div>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-air-superiority-blue dark:to-air-superiority-blue bg-clip-text text-transparent mb-2">
              Our Team
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
                <Avatar
                  initials="SK"
                  alt="Prof. Dr. Stephan Krusche"
                  size={96}
                  className="relative ring-4 ring-uranian-blue/50 dark:ring-air-superiority-blue/50"
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">Prof. Dr. Stephan Krusche</div>
                <div className="text-xs text-muted-foreground">Group Lead</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
                <Avatar
                  initials="RL"
                  alt="Research Team Member"
                  size={96}
                  className="relative ring-4 ring-uranian-blue/50 dark:ring-air-superiority-blue/50"
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">Dr. Research Lead</div>
                <div className="text-xs text-muted-foreground">Senior Researcher</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
                <Avatar
                  initials="TL"
                  alt="Development Team Member"
                  size={96}
                  className="relative ring-4 ring-uranian-blue/50 dark:ring-air-superiority-blue/50"
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">Tech Lead</div>
                <div className="text-xs text-muted-foreground">Software Architect</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
                <Avatar
                  initials="ES"
                  alt="Education Team Member"
                  size={96}
                  className="relative ring-4 ring-uranian-blue/50 dark:ring-air-superiority-blue/50"
                />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm">Education Specialist</div>
                <div className="text-xs text-muted-foreground">Pedagogy Expert</div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Offerings with Tabs */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-verdigris dark:to-wisteria bg-clip-text text-transparent mb-2">
              Course Offerings
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue mx-auto rounded-full"></div>
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
                        <CardTitle className="text-lg">Introduction to Software Engineering</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn the fundamentals of software development, version control, testing, and agile methodologies.
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
                        <CardTitle className="text-lg">Web Development Fundamentals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Build modern web applications using HTML, CSS, JavaScript, and popular frameworks.
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
                        <CardTitle className="text-lg">iPraktikum - Industry Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Work with real industry partners on production applications, gaining professional development experience.
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
                        <CardTitle className="text-lg">AI in Education Technologies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Explore how artificial intelligence can enhance teaching and learning experiences.
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
                        <CardTitle className="text-lg">Git & Version Control Workshop</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Master Git workflows, branching strategies, and collaborative development practices.
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
                        <CardTitle className="text-lg">CI/CD & DevOps Essentials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn continuous integration, deployment pipelines, and modern DevOps practices.
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
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-verdigris dark:to-wisteria bg-clip-text text-transparent mb-2">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yinmn-blue to-air-superiority-blue mx-auto rounded-full"></div>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion>
              <AccordionItem title="What is iPraktikum?">
                iPraktikum is our flagship project-based course where students work in teams with
                industry partners to develop real-world software applications. Students gain hands-on
                experience with modern development practices, agile methodologies, and professional
                software engineering workflows.
              </AccordionItem>
              <AccordionItem title="How can I participate in AET courses?">
                AET courses are available to TUM students through the regular course registration system.
                Check the course catalog for prerequisites, available slots, and registration deadlines.
                Some courses may require prior programming experience or specific technical knowledge.
              </AccordionItem>
              <AccordionItem title="Do you offer courses for beginners?">
                Yes! We offer several beginner-friendly courses including Introduction to Software
                Engineering and Web Development Fundamentals. These courses assume no prior programming
                experience and provide a solid foundation in software development.
              </AccordionItem>
              <AccordionItem title="Can industry partners collaborate with AET?">
                Absolutely! We actively seek partnerships with industry organizations for student
                projects, research collaborations, and course development. Contact us to discuss
                potential collaboration opportunities.
              </AccordionItem>
              <AccordionItem title="What technologies and tools do students learn?">
                Students work with modern technologies including Git, CI/CD pipelines, cloud platforms,
                popular programming languages and frameworks, testing tools, and agile project management
                systems. The specific tech stack varies by course and project requirements.
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  );
}
