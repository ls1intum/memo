'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SessionStats = {
  completed: number;
  skipped: number;
};

type Competency = {
  title: string;
  description: string;
  tags: string[];
  outcomes: string[];
};

const competencies: Competency[] = [
  {
    title: 'Competency A',
    description:
      'Short description about competency A. What students should be able to do.',
    tags: ['Taxonomy', 'Knowledge Area'],
    outcomes: [
      'Key learning outcome 1',
      'Key learning outcome 2',
      'Key learning outcome 3',
    ],
  },
  {
    title: 'Competency B',
    description: "Short description about competency B and why it's relevant.",
    tags: ['Taxonomy', 'Knowledge Area'],
    outcomes: [
      'Learning outcome A',
      'Learning outcome B',
      'Learning outcome C',
    ],
  },
];

const relationTypes = [
  { value: 'isPrerequisiteOf', label: 'isPrerequisiteOf' },
  { value: 'isSimilarTo', label: 'isSimilarTo' },
  { value: 'isEquivalentTo', label: 'isEquivalentTo' },
  { value: 'isPartOf', label: 'isPartOf' },
] as const;

const defaultRelationType = relationTypes[0]!.value;

function CompetencyCard({ title, description, tags, outcomes }: Competency) {
  return (
    <Card className="border border-white/70 bg-white/85 shadow-[0_22px_70px_-38px_rgba(7,30,84,0.35)] backdrop-blur-lg">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-md bg-slate-100 text-slate-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
          <CardDescription className="text-sm text-slate-600">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-700">
          {outcomes.map(outcome => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function SessionPage() {
  const [relation, setRelation] = useState<string>(defaultRelationType);
  const [stats, setStats] = useState<SessionStats>({
    completed: 0,
    skipped: 0,
  });
  const [, setHistory] = useState<Array<'completed' | 'skipped'>>([]);

  function handleAction(type: 'completed' | 'skipped') {
    setStats(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setHistory(prev => [...prev, type]);
  }

  function handleUndo() {
    setHistory(prev => {
      const updated = [...prev];
      const last = updated.pop();
      if (last) {
        setStats(prevStats => ({
          ...prevStats,
          [last]: Math.max(0, prevStats[last] - 1),
        }));
      }
      return updated;
    });
  }

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
          <Button
            className="h-12 rounded-full bg-[#0a4da2] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:bg-[#0d56b5]"
            asChild
          >
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-8 flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 pb-24 lg:mt-12 lg:px-0">
        <section className="space-y-8 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            <span>Mapping Session</span>
            <span className="text-slate-300">•</span>
            <span>Completed: {stats.completed}</span>
            <span className="text-slate-300">•</span>
            <span>Skipped: {stats.skipped}</span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">
            How does Competency A relate to Competency B?
          </h2>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            <div className="col-span-1">
              <CompetencyCard {...competencies[0]} />
            </div>

            <div className="col-span-1 flex flex-col items-center justify-center gap-4">
              <div className="text-sm text-slate-600">Select Relation Type</div>
              <Card className="w-full border border-white/80 bg-white/80 shadow-sm md:w-[220px]">
                <CardContent className="p-4">
                  <RadioGroup
                    value={relation}
                    onValueChange={setRelation}
                    className="gap-3"
                  >
                    {relationTypes.map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-3">
                        <RadioGroupItem
                          value={value}
                          id={value}
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor={value}
                          className="text-sm font-normal text-slate-800"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1">
              <CompetencyCard {...competencies[1]} />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-700"
              onClick={handleUndo}
            >
              Undo ⌘+Z
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              className="border-white/70 bg-white/80 text-slate-800 hover:border-slate-200"
              onClick={() => handleAction('skipped')}
            >
              Skip
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-[#0a4da2] text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] hover:bg-[#0d56b5]"
              onClick={() => handleAction('completed')}
            >
              Add Relation
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/70 bg-white/80 text-sm text-slate-500 shadow-[0_-15px_60px_-45px_rgba(7,30,84,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex w/full max-w-6xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-0">
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
