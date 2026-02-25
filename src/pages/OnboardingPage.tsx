import { useCallback, useEffect, useState, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Layers,
  LogIn,
  MousePointerClick,
  Rocket,
  Users,
  Waypoints,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import {
  OnboardingPractice,
  OnboardingPracticeRef,
} from '@/components/onboarding/OnboardingPractice';

const TOTAL_STEPS = 4;
const ONBOARDED_KEY = 'memo-onboarded';

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [consentChecked, setConsentChecked] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [currentPracticeCorrect, setCurrentPracticeCorrect] = useState(false);
  const practiceRef = useRef<OnboardingPracticeRef>(null);
  const navigate = useNavigate();

  const goNext = useCallback(() => {
    if (step === 2 && currentPracticeCorrect && !practiceCompleted) {
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
        if (step === 2 && !practiceCompleted && !currentPracticeCorrect) return;
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
      ? practiceCompleted || currentPracticeCorrect
      : step === 3
        ? consentChecked
        : true;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-16 flex w-full max-w-5xl flex-col gap-8 px-6 pb-20 lg:mt-24 lg:px-0">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {['Welcome', 'Our Mission', 'Practice', 'Guidelines'][step]}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
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
          {step === 1 && <StepHowItWorks onSignIn={goNext} />}
          {step === 2 && (
            <StepPractice
              ref={practiceRef}
              onComplete={() => {
                setPracticeCompleted(true);
                setDirection(1);
                setStep(s => s + 1);
              }}
              onCorrectStateChange={setCurrentPracticeCorrect}
              completed={practiceCompleted}
            />
          )}
          {step === 3 && (
            <StepConsent
              checked={consentChecked}
              onToggle={() => setConsentChecked(c => !c)}
            />
          )}
        </OnboardingStep>

        <div className="mx-auto flex w-full max-w-md items-center justify-between pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:border-slate-300 disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0a4da2] to-[#5538d1] px-6 py-2.5 text-sm font-bold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-28px_rgba(7,30,84,0.85)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${step === 1 ? 'opacity-40' : ''}`}
            >
              {step === 2 &&
              currentPracticeCorrect &&
              practiceRef.current?.isLastRound
                ? 'Continue'
                : step === 2
                  ? 'Next Round'
                  : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Button
              className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              disabled={!canAdvance}
              onClick={() => {
                try {
                  localStorage.setItem(ONBOARDED_KEY, '1');
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.warn('localStorage unavailable', e);
                }
                void navigate('/session');
              }}
            >
              <Rocket className="h-4 w-4 mr-1.5" />
              Start Your First Session
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function StepWelcome() {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
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
          className="text-3xl font-bold text-slate-900 sm:text-4xl"
        >
          Welcome to{' '}
          <span className="bg-gradient-to-r from-[#0a4da2] via-[#5538d1] to-[#9b5dfa] bg-clip-text text-transparent">
            Memo
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mx-auto max-w-xl text-base leading-relaxed text-slate-600"
        >
          A <strong className="text-slate-700">competency network</strong> maps
          how skills relate to each other — which ones are prerequisites, which
          extend others, and which are equivalent. These networks power
          personalized learning recommendations.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mx-auto w-full"
      >
        <CompetencyNetworkViz />
      </motion.div>
    </section>
  );
}

const NETWORK_NODES = [
  { id: 'methods', label: 'Methods', x: 80, y: 50, color: '#0a4da2' },
  { id: 'functions', label: 'Functions', x: 80, y: 150, color: '#0a4da2' },
  { id: 'recursion', label: 'Recursion', x: 280, y: 100, color: '#5538d1' },
  { id: 'mergesort', label: 'Merge Sort', x: 480, y: 50, color: '#7c3aed' },
  { id: 'sorting', label: 'Sorting', x: 600, y: 50, color: '#7c3aed' },
  { id: 'trees', label: 'Tree Traversal', x: 480, y: 155, color: '#9b5dfa' },
];

const NETWORK_EDGES = [
  { from: 'methods', to: 'functions', label: 'matches' },
  { from: 'recursion', to: 'methods', label: 'assumes' },
  { from: 'mergesort', to: 'recursion', label: 'assumes' },
  { from: 'trees', to: 'recursion', label: 'assumes' },
  { from: 'mergesort', to: 'sorting', label: 'extends' },
];

const EDGE_COLORS: Record<string, string> = {
  assumes: '#0a4da2',
  extends: '#7c3aed',
  matches: '#10b981',
};

function CompetencyNetworkViz() {
  const nodeMap = Object.fromEntries(NETWORK_NODES.map(n => [n.id, n]));

  return (
    <div className="relative rounded-2xl border border-[#0a4da2]/20 bg-gradient-to-br from-blue-50/90 via-white/80 to-indigo-50/70 p-5 shadow-[0_8px_30px_-10px_rgba(7,30,84,0.15)] overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Waypoints className="h-3.5 w-3.5 text-[#0a4da2]" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Competency Network Preview
        </span>
      </div>
      <svg viewBox="0 0 640 200" className="w-full h-auto">
        <defs>
          <marker
            id="arrow-assumes"
            viewBox="0 0 10 6"
            refX="9"
            refY="3"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,3 L0,6" fill="#0a4da2" fillOpacity="0.5" />
          </marker>
          <marker
            id="arrow-extends"
            viewBox="0 0 10 6"
            refX="9"
            refY="3"
            markerWidth="8"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,3 L0,6" fill="#7c3aed" fillOpacity="0.5" />
          </marker>
          <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#0a4da2"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        {/* Edges */}
        {NETWORK_EDGES.map((edge, i) => {
          const from = nodeMap[edge.from]!;
          const to = nodeMap[edge.to]!;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const isDirectional =
            edge.label === 'assumes' || edge.label === 'extends';
          const markerId =
            edge.label === 'extends'
              ? 'url(#arrow-extends)'
              : 'url(#arrow-assumes)';

          // Shorten line so arrowhead sits on circle edge, not behind it
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const r = 34; // node radius + small margin
          const x1 = from.x + (dx / len) * r;
          const y1 = from.y + (dy / len) * r;
          const x2 = to.x - (dx / len) * r;
          const y2 = to.y - (dy / len) * r;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={EDGE_COLORS[edge.label] ?? '#94a3b8'}
                strokeWidth={1.5}
                strokeOpacity={0.4}
                markerEnd={isDirectional ? markerId : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              />
              <motion.text
                x={edge.label === 'matches' ? mx - 30 : mx}
                y={my - (edge.label === 'matches' ? 0 : 10)}
                textAnchor="middle"
                fill={EDGE_COLORS[edge.label] ?? '#94a3b8'}
                fontSize={9}
                fontWeight={600}
                fontFamily="Geist, system-ui, sans-serif"
                opacity={0.6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
              >
                {edge.label}
              </motion.text>
            </g>
          );
        })}

        {/* Nodes */}
        {NETWORK_NODES.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -3, 0, 3, 0],
            }}
            transition={{
              opacity: { delay: 0.15 + i * 0.07, duration: 0.35 },
              scale: { delay: 0.15 + i * 0.07, duration: 0.35 },
              y: {
                delay: 1 + i * 0.2,
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={32}
              fill="white"
              stroke={node.color}
              strokeWidth={2}
              filter="url(#node-shadow)"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={node.color}
              fontSize={9}
              fontWeight={700}
              fontFamily="Geist, system-ui, sans-serif"
            >
              {node.label.includes(' ') ? (
                <>
                  <tspan x={node.x} dy="-0.5em">
                    {node.label.split(' ')[0]}
                  </tspan>
                  <tspan x={node.x} dy="1.1em">
                    {node.label.split(' ').slice(1).join(' ')}
                  </tspan>
                </>
              ) : (
                node.label
              )}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-5 mt-3 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-6 rounded-full"
            style={{ background: EDGE_COLORS.assumes }}
          />
          Assumes →
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-6 rounded-full"
            style={{ background: EDGE_COLORS.extends }}
          />
          Extends →
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-6 rounded-full"
            style={{ background: EDGE_COLORS.matches }}
          />
          Matches
        </span>
      </div>
    </div>
  );
}

const HOW_IT_WORKS_TILES = [
  {
    icon: Layers,
    color: 'from-[#0a4da2] to-[#4263eb]',
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'See two competencies',
    desc: 'We show you a pair of skills from a knowledge domain — like "Recursion" and "Divide and Conquer".',
  },
  {
    icon: MousePointerClick,
    color: 'from-[#7c3aed] to-[#9775fa]',
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Pick a relationship',
    desc: 'Decide how they relate: prerequisite, extension, equivalent, or unrelated. Use buttons or keyboard shortcuts.',
  },
  {
    icon: CheckCircle2,
    color: 'from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'Build the benchmark',
    desc: 'Your label joins a crowd-sourced dataset for fair, reproducible evaluation of recommender systems.',
  },
];

function StepHowItWorks({ onSignIn }: { onSignIn: () => void }) {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
      <div className="text-center space-y-3">
        <Badge className="w-fit mx-auto rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a4da2]">
          Our Mission
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Building a Better Benchmark
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed">
          Memo crowd-sources how competencies relate to each other to create an{' '}
          <strong className="text-slate-700">open benchmark dataset</strong>.
          Researchers can use it to fairly evaluate and compare competency-aware
          learning recommender systems.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {HOW_IT_WORKS_TILES.map((tile, i) => (
          <div
            key={tile.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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
              <h3 className="text-lg font-bold text-slate-900">{tile.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {tile.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto max-w-xl text-center text-base text-slate-600 leading-relaxed">
        Your contribution is simple. Just map relationships between pairs of
        skills.
      </p>

      <div className="mx-auto max-w-sm">
        <button
          type="button"
          onClick={onSignIn}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:border-slate-300 hover:-translate-y-0.5"
        >
          <LogIn className="h-4 w-4" />
          Sign in with University Account
          <Badge className="ml-1 rounded-full border-0 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            Coming soon
          </Badge>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Community-driven
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> Open-source research
        </span>
      </div>
    </section>
  );
}

const StepPractice = forwardRef<
  OnboardingPracticeRef,
  {
    onComplete: () => void;
    onCorrectStateChange: (isCorrect: boolean) => void;
    completed: boolean;
  }
>(function StepPractice({ onComplete, onCorrectStateChange, completed }, ref) {
  return (
    <section className="space-y-4 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
      <div className="text-center space-y-2">
        <Badge className="w-fit mx-auto rounded-full border border-amber-400/40 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
          Practice Round
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Try It Yourself
        </h2>
      </div>

      {completed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-sm rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center"
        >
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-3" />
          <p className="text-base font-semibold text-emerald-800">
            Practice complete!
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            Hit Continue to proceed to the guidelines.
          </p>
        </motion.div>
      ) : (
        <OnboardingPractice
          ref={ref}
          onComplete={onComplete}
          onCorrectStateChange={onCorrectStateChange}
        />
      )}
    </section>
  );
});

const GUIDELINES = [
  {
    emoji: '🎯',
    title: 'Accuracy over speed',
    desc: 'Take your time. One thoughtful label is better than many rushed ones.',
  },
  {
    emoji: '⏭️',
    title: 'Skip when unsure',
    desc: 'No penalty for skipping. If a pair is ambiguous, move on.',
  },
  {
    emoji: '🤝',
    title: 'No competition',
    desc: 'This is a collaboration, not a race. Every contribution matters.',
  },
  {
    emoji: '↩️',
    title: 'Undo is available',
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
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
      <div className="text-center space-y-3">
        <Badge className="w-fit mx-auto rounded-full border border-[#0a4da2]/30 bg-[#0a4da2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#0a4da2]">
          Guidelines
        </Badge>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Quality Over Quantity
        </h2>
        <p className="mx-auto max-w-xl text-base text-slate-600 leading-relaxed">
          Great benchmark data comes from careful, honest mappings.
          <br className="hidden sm:block" />
          Here are a few principles to keep in mind.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {GUIDELINES.map(g => (
          <div
            key={g.title}
            className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-5 space-y-2"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{g.emoji}</span>
              <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-[#0a4da2]/20 bg-[#0a4da2]/5 p-6 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-[#0a4da2] accent-[#0a4da2] focus:ring-[#0a4da2] transition"
          />
          <span className="text-sm text-slate-700 leading-relaxed">
            I understand that my mappings will be used as{' '}
            <span className="font-semibold text-slate-900">
              ground-truth benchmark data
            </span>{' '}
            for evaluating competency-aware recommender systems. My
            contributions are anonymous and cannot be traced back to me.
          </span>
        </label>
      </div>
    </section>
  );
}
