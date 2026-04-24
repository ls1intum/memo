import { useCallback, useEffect, useState, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { CompetencyNetworkViz } from '@/components/competency-network/CompetencyNetworkViz';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Layers,
  LogIn,
  MousePointerClick,
  Users,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import {
  OnboardingPractice,
  OnboardingPracticeRef,
} from '@/components/onboarding/OnboardingPractice';
import { useAuth } from '@/contexts/useAuth';
import { usersApi } from '@/lib/api/users';

const TOTAL_STEPS = 5;
const ONBOARDED_KEY = 'memo-onboarded';
const SESSION_DEGREE_KEY = 'onboarding-degree';
const SESSION_FIELD_KEY = 'onboarding-field';

export function OnboardingPage() {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    domainError,
    logout,
    onboardingLogin,
  } = useAuth();
  const [step, setStep] = useState(() => {
    try {
      const s = parseInt(
        new URLSearchParams(window.location.search).get('step') ?? '0',
        10
      );
      return isNaN(s) || s < 0 || s >= TOTAL_STEPS ? 0 : s;
    } catch {
      return 0;
    }
  });
  const [direction, setDirection] = useState(1);
  const [consentChecked, setConsentChecked] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [currentPracticeCorrect, setCurrentPracticeCorrect] = useState(false);
  const [isPracticeLastRound, setIsPracticeLastRound] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_DEGREE_KEY) || null
  );
  const [fieldOfStudy, setFieldOfStudy] = useState<string>(
    () => sessionStorage.getItem(SESSION_FIELD_KEY) || ''
  );
  const practiceRef = useRef<OnboardingPracticeRef>(null);
  const navigate = useNavigate();

  function handleSelectDegree(degree: string) {
    setSelectedDegree(degree);
    sessionStorage.setItem(SESSION_DEGREE_KEY, degree);
  }

  function handleFieldOfStudyChange(field: string) {
    setFieldOfStudy(field);
    sessionStorage.setItem(SESSION_FIELD_KEY, field);
  }

  const goNext = useCallback(() => {
    if (step === 3 && currentPracticeCorrect && !practiceCompleted) {
      practiceRef.current?.nextRound();
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(s => s + 1);
    }
  }, [step, currentPracticeCorrect, practiceCompleted]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }, [step]);

  // Arrow key navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowRight' && step < TOTAL_STEPS - 1) {
        // Don't advance past practice unless completed
        if (step === 3 && !practiceCompleted && !currentPracticeCorrect) return;
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft' && step > 0) {
        e.preventDefault();
        goBack();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, practiceCompleted, currentPracticeCorrect, goNext, goBack]);

  const canAdvance =
    step === 2
      ? isAuthenticated &&
        selectedDegree !== null &&
        fieldOfStudy.trim().length > 0
      : step === 3
        ? practiceCompleted || currentPracticeCorrect
        : step === 4
          ? consentChecked
          : true;

  if (domainError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <GraduationCap className="h-12 w-12" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Access denied
          </h1>
          <p className="max-w-xs text-center text-sm text-muted-foreground">
            Your email domain is not permitted. Please use a university email
            address.
          </p>
        </div>
        <div className="w-full max-w-sm rounded-lg border p-6">
          <Button variant="outline" className="w-full" onClick={() => logout()}>
            Sign out and try a different account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900 dark:from-[#0f1729] dark:via-[#111b30] dark:to-[#0f1729] dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px] dark:bg-slate-800/30" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px] dark:bg-[#7fb0ff]/10" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px] dark:from-[#ffdff3]/10 dark:via-[#fff3f8]/5" />
      </div>

      <main className="relative z-10 mx-auto mt-16 flex w-full max-w-5xl flex-col gap-8 px-6 pb-20 lg:mt-24 lg:px-0">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {
                ['Welcome', 'Our Mission', 'Profile', 'Practice', 'Guidelines'][
                  step
                ]
              }
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200/60 dark:bg-slate-700/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0a4da2] to-[#7c6cff]"
              initial={false}
              animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>

        <OnboardingStep stepKey={`step-${step}`} direction={direction}>
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepHowItWorks />}
          {step === 2 && (
            <StepProfile
              selectedDegree={selectedDegree}
              onSelectDegree={handleSelectDegree}
              fieldOfStudy={fieldOfStudy}
              onFieldOfStudyChange={handleFieldOfStudyChange}
              onSignIn={onboardingLogin}
              isAuthenticated={isAuthenticated}
              isAuthLoading={isAuthLoading}
            />
          )}
          {step === 3 && (
            <StepPractice
              ref={practiceRef}
              onComplete={() => {
                setPracticeCompleted(true);
                setDirection(1);
                setStep(s => s + 1);
              }}
              onSkip={() => {
                setDirection(1);
                setStep(s => s + 1);
              }}
              onCorrectStateChange={setCurrentPracticeCorrect}
              onLastRoundChange={setIsPracticeLastRound}
              completed={practiceCompleted}
            />
          )}
          {step === 4 && (
            <StepConsent
              checked={consentChecked}
              onToggle={() => setConsentChecked(c => !c)}
            />
          )}
        </OnboardingStep>

        <div className="mx-auto flex w-full max-w-md items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:border-slate-300 disabled:opacity-0 disabled:pointer-events-none dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < TOTAL_STEPS - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] px-6 py-5 text-sm font-bold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-28px_rgba(7,30,84,0.85)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
            >
              {step === 3 && !practiceCompleted
                ? isPracticeLastRound
                  ? 'Continue'
                  : 'Next Round'
                : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              disabled={!canAdvance}
              onClick={async () => {
                try {
                  await usersApi.acceptConsent();
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error('Failed to record consent', e);
                  toast.error(
                    'Could not record your consent. Please try again.',
                    { duration: 10000 }
                  );
                  return;
                }

                try {
                  localStorage.setItem(ONBOARDED_KEY, '1');
                  sessionStorage.removeItem(SESSION_DEGREE_KEY);
                  sessionStorage.removeItem(SESSION_FIELD_KEY);
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.warn('Storage unavailable', e);
                }

                void navigate('/session');
              }}
            >
              Start Your First Session
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function StepWelcome() {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)]">
      <div className="space-y-3 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a4da2] to-[#7c6cff] shadow-xl shadow-blue-500/20"
        >
          <Brain className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100"
        >
          Welcome to{' '}
          <span className="bg-gradient-to-r from-[#0a4da2] via-[#5538d1] to-[#9b5dfa] bg-clip-text text-transparent dark:from-[#6b9fff] dark:via-[#9b7ff5] dark:to-[#c4a5ff]">
            Memo
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400"
        >
          A{' '}
          <strong className="text-slate-700 dark:text-slate-300">
            competency network
          </strong>{' '}
          maps how skills relate to each other - which ones are prerequisites,
          which extend others, and which are equivalent. These networks power
          personalized learning recommendations.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mx-auto w-full"
      >
        <CompetencyNetworkViz idPrefix="onboarding" />
      </motion.div>
    </section>
  );
}

const HOW_IT_WORKS_TILES = [
  {
    icon: Layers,
    color: 'from-[#0a4da2] to-[#4263eb]',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    title: 'See Two Competencies',
    desc: 'We show you a pair of skills from a knowledge domain like "Recursion" and "Divide and Conquer".',
  },
  {
    icon: MousePointerClick,
    color: 'from-[#7c3aed] to-[#9775fa]',
    iconBg:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    title: 'Pick a Relationship',
    desc: 'Decide how they relate: prerequisite, extension, equivalent, or unrelated. Use buttons or keyboard shortcuts.',
  },
  {
    icon: CheckCircle2,
    color: 'from-emerald-500 to-emerald-600',
    iconBg:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    title: 'Build the Benchmark',
    desc: 'Your label joins a crowd-sourced dataset for fair, reproducible evaluation of recommender systems.',
  },
];

function StepHowItWorks() {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)]">
      <div className="text-center space-y-3">
        <Badge className="w-fit mx-auto rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a4da2] dark:border-[#6b9fff]/30 dark:bg-[#6b9fff]/15 dark:text-[#6b9fff]">
          Our Mission
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Building a Better Benchmark
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed dark:text-slate-400">
          Memo crowd-sources how competencies relate to each other to create an{' '}
          <strong className="text-slate-700 dark:text-slate-300">
            open benchmark dataset
          </strong>
          . Researchers can use it to fairly evaluate and compare
          competency-aware learning recommender systems.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {HOW_IT_WORKS_TILES.map((tile, i) => (
          <div
            key={tile.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800/60 dark:hover:bg-slate-800/80"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile.iconBg} transition group-hover:scale-110`}
                >
                  <tile.icon className="h-5 w-5" />
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${tile.color}">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${tile.color.includes('0a4da2') ? '#0a4da2, #4263eb' : tile.color.includes('7c3aed') ? '#7c3aed, #9775fa' : '#10b981, #059669'})`,
                    }}
                  >
                    {i + 1}
                  </span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {tile.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                {tile.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto max-w-xl text-center text-base text-slate-600 leading-relaxed dark:text-slate-400">
        Your contribution is simple. Just map relationships between pairs of
        skills.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Community-Driven
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> Open-Source Research
        </span>
      </div>
    </section>
  );
}

const DEGREES = [
  { id: 'undergrad', label: 'Undergraduate Student' },
  { id: 'grad', label: 'Graduate Student' },
  { id: 'doc', label: 'Doctoral Student' },
  { id: 'postdoc', label: 'Postdoc / Researcher' },
  { id: 'industry', label: 'Industry Professional' },
  { id: 'other', label: 'Other' },
];

const COMMON_DOMAINS = [
  'Computer Science',
  'Business Administration',
  'Data Science',
  'Mathematics',
];

function StepProfile({
  selectedDegree,
  onSelectDegree,
  fieldOfStudy,
  onFieldOfStudyChange,
  onSignIn,
  isAuthenticated,
  isAuthLoading,
}: {
  selectedDegree: string | null;
  onSelectDegree: (degree: string) => void;
  fieldOfStudy: string;
  onFieldOfStudyChange: (field: string) => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}) {
  const [domainOpen, setDomainOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-8 sm:p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)]">
      <div className="text-center space-y-3">
        <Badge className="w-fit mx-auto rounded-full border border-indigo-400/30 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-900/30 dark:text-indigo-300">
          Your Profile
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Set Everything Up
        </h2>
        <p className="mx-auto max-w-xl text-base text-slate-600 leading-relaxed dark:text-slate-400">
          Link your university account and share your academic background to
          help us better understand the diverse perspectives shaping our
          dataset.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl mt-8 grid gap-6 md:grid-cols-2">
        {/* Authentication Card */}
        <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white p-6 sm:p-7 space-y-4 shadow-sm relative overflow-hidden dark:border-slate-700/50 dark:bg-slate-800/80">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-50 px-3 py-1 border-b border-l border-amber-200/50 dark:bg-amber-900/30 dark:border-amber-700/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Required
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 dark:text-slate-100">
              <LogIn className="h-4 w-4 text-[#0a4da2] dark:text-[#6b9fff]" />
              Authentication
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed flex-grow dark:text-slate-400">
            We use your university account to securely record your contributions
            while keeping your data private.
          </p>
          {isAuthLoading ? (
            <span className="mt-2 text-sm text-slate-500">
              Checking authentication…
            </span>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Signed in via University
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="flex w-full sm:w-auto self-start mt-2 items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 dark:hover:border-slate-500"
            >
              <span>Sign in via University Email</span>
            </button>
          )}
        </div>

        {/* Demographics Card */}
        <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white p-6 sm:p-7 space-y-4 shadow-sm relative overflow-hidden dark:border-slate-700/50 dark:bg-slate-800/80">
          <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-50 px-3 py-1 border-b border-l border-amber-200/50 dark:bg-amber-900/30 dark:border-amber-700/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Required
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 dark:text-slate-100">
              <GraduationCap className="h-4 w-4 text-[#0a4da2] dark:text-[#6b9fff]" />
              Academic Status
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">
            Please select your current academic progress or highest degree so we
            can better understand the demographics of our contributors.
          </p>

          <div className="space-y-4 mt-2">
            <div className="relative">
              <Select
                value={selectedDegree || undefined}
                onValueChange={onSelectDegree}
              >
                <SelectTrigger className="h-auto w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition focus:border-[#0a4da2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4da2] data-[placeholder]:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:data-[placeholder]:text-slate-400 dark:focus:border-[#6b9fff] dark:focus:bg-slate-700 dark:focus:ring-[#6b9fff]">
                  <SelectValue placeholder="Select Your Status..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden dark:border-slate-600 dark:bg-slate-800">
                  {DEGREES.map(degree => (
                    <SelectItem
                      key={degree.id}
                      value={degree.id}
                      className="cursor-pointer font-medium py-2.5"
                    >
                      {degree.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Popover open={domainOpen} onOpenChange={setDomainOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={domainOpen}
                    className={`h-auto w-full justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm transition hover:bg-slate-50 focus:border-[#0a4da2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a4da2] dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-700 dark:focus:border-[#6b9fff] dark:focus:bg-slate-700 dark:focus:ring-[#6b9fff] ${
                      !fieldOfStudy
                        ? 'text-slate-500 dark:text-slate-400 font-medium'
                        : 'text-slate-700 font-medium dark:text-slate-200'
                    }`}
                  >
                    {fieldOfStudy ||
                      'Domain / Field of Study (e.g. Computer Science)'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden dark:bg-slate-800 dark:border-slate-600"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search or enter domain..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="h-11"
                    />
                    <CommandList>
                      <CommandEmpty className="p-2">
                        {searchQuery.trim() !== '' ? (
                          <Button
                            variant="ghost"
                            className="h-auto w-full justify-start px-2 py-2 text-sm font-normal text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                            onClick={() => {
                              onFieldOfStudyChange(searchQuery.trim());
                              setDomainOpen(false);
                            }}
                          >
                            <span className="truncate">
                              Use &quot;{searchQuery}&quot;
                            </span>
                          </Button>
                        ) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400 py-2 px-2">
                            Type your domain...
                          </span>
                        )}
                      </CommandEmpty>
                      <CommandGroup heading="Common Domains">
                        {COMMON_DOMAINS.map(domain => (
                          <CommandItem
                            key={domain}
                            value={domain}
                            onSelect={currentValue => {
                              onFieldOfStudyChange(currentValue);
                              setSearchQuery('');
                              setDomainOpen(false);
                            }}
                            className="cursor-pointer font-medium"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${fieldOfStudy === domain ? 'opacity-100 text-[#0a4da2] dark:text-[#6b9fff]' : 'opacity-0'}`}
                            />
                            {domain}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const StepPractice = forwardRef<
  OnboardingPracticeRef,
  {
    onComplete: () => void;
    onSkip: () => void;
    onCorrectStateChange: (isCorrect: boolean) => void;
    onLastRoundChange: (isLastRound: boolean) => void;
    completed: boolean;
  }
>(function StepPractice(
  { onComplete, onSkip, onCorrectStateChange, onLastRoundChange, completed },
  ref
) {
  return (
    <section className="relative space-y-4 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)]">
      {!completed && (
        <Button
          type="button"
          onClick={onSkip}
          className="absolute right-8 top-8 z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-500"
        >
          Skip
        </Button>
      )}
      <div className="text-center space-y-2 mb-4">
        <Badge className="w-fit mx-auto rounded-full border border-amber-400/40 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-300">
          Practice Round
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Try It Yourself
        </h2>
      </div>

      {completed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-sm rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center dark:border-emerald-700/50 dark:bg-emerald-900/30"
        >
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-3 dark:text-emerald-400" />
          <p className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
            Practice complete!
          </p>
          <p className="text-sm text-emerald-600 mt-1 dark:text-emerald-400">
            Hit Continue to proceed to the guidelines.
          </p>
        </motion.div>
      ) : (
        <OnboardingPractice
          ref={ref}
          onComplete={onComplete}
          onCorrectStateChange={onCorrectStateChange}
          onLastRoundChange={onLastRoundChange}
        />
      )}
    </section>
  );
});

const GUIDELINES = [
  {
    emoji: '🎯',
    title: 'Accuracy Over Speed',
    desc: 'Take your time. One thoughtful label is better than many rushed ones.',
  },
  {
    emoji: '⏭️',
    title: 'Skip When Unsure',
    desc: 'No penalty for skipping. If a pair is ambiguous, move on.',
  },
  {
    emoji: '🤝',
    title: 'No Competition',
    desc: 'This is a collaboration, not a race. Every contribution matters.',
  },
  {
    emoji: '↩️',
    title: 'Undo Is Available',
    desc: 'Made a mistake? Use the undo button or Shift+Z to fix it.',
  },
];

function StepConsent({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)]">
      <div className="text-center space-y-3">
        <Badge className="w-fit mx-auto rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a4da2] dark:border-[#6b9fff]/30 dark:bg-[#6b9fff]/15 dark:text-[#6b9fff]">
          Guidelines
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Quality Over Quantity
        </h2>
        <p className="mx-auto max-w-xl text-base text-slate-600 leading-relaxed dark:text-slate-400">
          Great benchmark data comes from careful, honest mappings.
          <br className="hidden sm:block" />
          Here are a few principles to keep in mind.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {GUIDELINES.map(g => (
          <div
            key={g.title}
            className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-5 space-y-2 dark:border-slate-700/50 dark:bg-slate-800/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{g.emoji}</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {g.title}
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">
              {g.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-[#0a4da2]/20 bg-[#0a4da2]/5 p-6 space-y-4 dark:border-[#6b9fff]/20 dark:bg-[#6b9fff]/10">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-[#0a4da2] accent-[#0a4da2] focus:ring-[#0a4da2] transition dark:border-slate-600 dark:accent-[#6b9fff]"
          />
          <span className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
            I understand that my mappings will be used as{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              ground-truth benchmark data
            </span>{' '}
            to evaluate competency-aware recommender systems. My contributions
            will remain private and, within this research project, will only be
            used in anonymized form. I agree to the{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0a4da2] underline underline-offset-2 hover:text-[#0d56b5]"
            >
              privacy policy
            </a>
            .
          </span>
        </label>
      </div>
    </section>
  );
}
