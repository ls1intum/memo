import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { MappingCard } from '@/components/session/MappingCard';
import { TypeSelectionButton } from '@/components/session/TypeSelectionButton';
import {
  THEME_COLORS,
  RELATIONSHIP_TYPES,
  RELATIONSHIP_SELECTED_COLORS,
  RELATIONSHIP_UNSELECTED_COLORS,
  RELATIONSHIP_ICON_BG_COLORS,
  RELATIONSHIP_ICONS,
  type RelationshipType,
} from '@/components/session/session-constants';

type GuidanceLevel = 'strict' | 'soft' | 'free';

interface TutorialRound {
  competencies: [
    { id: string; title: string; description: string; createdAt: string },
    { id: string; title: string; description: string; createdAt: string },
  ];
  correctAnswer: RelationshipType;
  guidanceLevel: GuidanceLevel;
  guidanceLabel: string;
  introText: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

const TUTORIAL_ROUNDS: TutorialRound[] = [
  {
    competencies: [
      {
        id: 'r1-b',
        title: 'Divide and Conquer',
        description:
          'Breaking problems into smaller, independent subproblems, solving them recursively, and combining results (e.g. merge sort, binary search).',
        createdAt: '',
      },
      {
        id: 'r1-a',
        title: 'Recursion',
        description:
          'Understanding and applying recursive problem-solving strategies, including base cases, recursive calls, and stack behavior.',
        createdAt: '',
      },
    ],
    correctAnswer: 'ASSUMES',
    guidanceLevel: 'strict',
    guidanceLabel: 'Guided',
    introText:
      'Divide and Conquer assumes understanding recursion first. Click the highlighted button below!',
    feedbackCorrect:
      'Correct! Recursion is a prerequisite for Divide and Conquer.',
    feedbackWrong: '',
  },
  {
    competencies: [
      {
        id: 'r2-a',
        title: 'Merge Sort',
        description:
          'A divide-and-conquer sorting algorithm that recursively splits, sorts, and merges sub-arrays in O(n log n) time.',
        createdAt: '',
      },
      {
        id: 'r2-b',
        title: 'Sorting',
        description:
          'Ordering elements of a collection according to a comparison criterion, including understanding of time complexity and stability.',
        createdAt: '',
      },
    ],
    correctAnswer: 'EXTENDS',
    guidanceLevel: 'soft',
    guidanceLabel: 'Hints',
    introText:
      'Merge Sort is a specific sorting algorithm. How does it relate to the general concept of Sorting?',
    feedbackCorrect:
      'Exactly! Merge Sort extends the concept of Sorting, a specialized technique that builds on the general idea.',
    feedbackWrong:
      'Not quite. Think about whether one is a specialization of the other. Try again!',
  },
  {
    competencies: [
      {
        id: 'r3-a',
        title: 'Methods',
        description:
          'Functions that are defined inside a class or an object, and typically operate on instances of that class.',
        createdAt: '',
      },
      {
        id: 'r3-b',
        title: 'Functions',
        description:
          'Self-contained blocks of code that take inputs, perform specific actions, and return an output.',
        createdAt: '',
      },
    ],
    correctAnswer: 'MATCHES',
    guidanceLevel: 'free',
    guidanceLabel: 'On Your Own',
    introText: 'Now try this one on your own. No hints this time!',
    feedbackCorrect:
      'Perfect! Methods and Functions are essentially equivalent — they describe the same concept.',
    feedbackWrong:
      'These two are actually very similar concepts. Methods and Functions are essentially the same thing.',
  },
];

interface OnboardingPracticeProps {
  onComplete: () => void;
  onCorrectStateChange?: (isCorrect: boolean) => void;
  onLastRoundChange?: (isLastRound: boolean) => void;
}

export interface OnboardingPracticeRef {
  nextRound: () => void;
  isLastRound: boolean;
}

export const OnboardingPractice = forwardRef<
  OnboardingPracticeRef,
  OnboardingPracticeProps
>(function OnboardingPractice(
  { onComplete, onCorrectStateChange, onLastRoundChange },
  ref
) {
  const [round, setRound] = useState(0);
  const [selectedRelation, setSelectedRelation] =
    useState<RelationshipType | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  const current = TUTORIAL_ROUNDS[round]!;
  const isCorrect = selectedRelation === current.correctAnswer;
  const isLastRound = round === TUTORIAL_ROUNDS.length - 1;

  function handleSelect(value: RelationshipType | null) {
    if (!value || isCorrect) return;

    // Strict mode: only allow the correct answer
    if (current.guidanceLevel === 'strict' && value !== current.correctAnswer) {
      return;
    }

    // Soft mode: wrong answer, show feedback, let them try again
    if (current.guidanceLevel === 'soft' && value !== current.correctAnswer) {
      setWrongAttempt(true);
      setSelectedRelation(value);
      // Reset after a moment to let them try again
      setTimeout(() => {
        setSelectedRelation(null);
        setWrongAttempt(false);
      }, 1500);
      return;
    }

    setSelectedRelation(value);
    setWrongAttempt(false);
  }

  // Effect to notify parent when selection clears/changes
  useEffect(() => {
    if (onCorrectStateChange) {
      onCorrectStateChange(isCorrect);
    }
  }, [isCorrect, onCorrectStateChange]);

  useEffect(() => {
    if (onLastRoundChange) {
      onLastRoundChange(isLastRound);
    }
  }, [isLastRound, onLastRoundChange]);

  function handleNext() {
    if (isLastRound) {
      onComplete();
      return;
    }
    setRound(r => r + 1);
    setSelectedRelation(null);
    setWrongAttempt(false);
  }

  useImperativeHandle(ref, () => ({
    nextRound: handleNext,
    isLastRound,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-3">
        {TUTORIAL_ROUNDS.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                i < round
                  ? 'bg-emerald-500 text-white'
                  : i === round
                    ? 'bg-gradient-to-br from-[#0a4da2] to-[#5538d1] text-white ring-2 ring-[#0a4da2]/30 ring-offset-2 dark:ring-offset-slate-800'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {i < round ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            {i < TUTORIAL_ROUNDS.length - 1 && (
              <div
                className={`h-0.5 w-8 rounded-full transition-all duration-300 ${
                  i < round ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Question ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${round}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <div className="text-center">
            <h2 className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-800 dark:text-slate-200 leading-relaxed tracking-tight">
              How does{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary})`,
                }}
              >
                {current.competencies[0].title}
              </span>{' '}
              relate to{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${THEME_COLORS.destination.primary}, ${THEME_COLORS.destination.secondary})`,
                }}
              >
                {current.competencies[1].title}
              </span>
              ?
            </h2>
          </div>

          {/* ── Cards ── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] mt-5">
            <MappingCard
              type="competency"
              title={current.competencies[0].title}
              description={current.competencies[0].description}
              themeColors={THEME_COLORS.source}
              borderColorClass="border-[#0a4da2]/30 dark:border-[#6b9fff]/30"
              gradientFromClass="from-blue-50/80 dark:from-blue-950/30"
              isTransitioning={false}
            />

            <div className="flex flex-col items-center justify-center z-10 px-3 gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-0.5 w-12"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary})`,
                  }}
                />
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-xl ring-3 ring-white dark:ring-slate-800"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary}, ${THEME_COLORS.destination.primary})`,
                  }}
                >
                  <ArrowRight
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div
                  className="h-0.5 w-12"
                  style={{
                    backgroundImage: `linear-gradient(to left, ${THEME_COLORS.destination.primary}, ${THEME_COLORS.destination.secondary})`,
                  }}
                />
              </div>
            </div>

            <MappingCard
              type="competency"
              title={current.competencies[1].title}
              description={current.competencies[1].description}
              themeColors={THEME_COLORS.destination}
              borderColorClass="border-[#9775fa]/30 dark:border-[#b39dff]/30"
              gradientFromClass="from-purple-50/80 dark:from-purple-950/30"
              isTransitioning={false}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`intro-${round}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-xl bg-gradient-to-r from-blue-50/90 via-purple-50/70 to-blue-50/90 dark:from-blue-950/50 dark:via-purple-950/30 dark:to-blue-950/50 border border-blue-200/50 dark:border-blue-800/30 py-3 px-5 text-center"
        >
          {wrongAttempt ? (
            <motion.p
              initial={{ x: -6 }}
              animate={{ x: [0, -4, 4, -4, 4, 0] }}
              transition={{ duration: 0.4 }}
              className="text-base font-bold text-amber-700 dark:text-amber-400"
            >
              {current.feedbackWrong}
            </motion.p>
          ) : selectedRelation && !wrongAttempt ? (
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {isCorrect ? current.feedbackCorrect : current.feedbackWrong}
            </p>
          ) : (
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {current.introText}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {RELATIONSHIP_TYPES.map(({ value, label }, index) => {
            const isSelected = selectedRelation === value;
            const IconComponent = RELATIONSHIP_ICONS[value];
            const iconBgColors = RELATIONSHIP_ICON_BG_COLORS[value];
            const isCorrectBtn = value === current.correctAnswer;

            // Strict mode: dim non-correct buttons
            const isStrictDisabled =
              current.guidanceLevel === 'strict' && !isCorrectBtn && !isCorrect;

            return (
              <div key={value} className="relative">
                {current.guidanceLevel === 'soft' &&
                  isCorrectBtn &&
                  !selectedRelation &&
                  !isCorrect && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: [0, 4, 0] }}
                      transition={{
                        opacity: { delay: 1, duration: 0.3 },
                        y: {
                          delay: 1,
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 z-20"
                    >
                      <ChevronDown className="h-5 w-5 text-purple-500" />
                    </motion.div>
                  )}

                <div
                  className={`transition-all duration-300 ${
                    isStrictDisabled ? 'opacity-30 pointer-events-none' : ''
                  }`}
                >
                  {/* Pulsing ring for strict guidance */}
                  {current.guidanceLevel === 'strict' &&
                    isCorrectBtn &&
                    !selectedRelation &&
                    !isCorrect && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-blue-400 z-10 pointer-events-none"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}

                  <TypeSelectionButton
                    value={value}
                    label={label}
                    isSelected={isSelected}
                    shortcutKey={(index + 1).toString()}
                    icon={<IconComponent className="h-4 w-4" />}
                    selectedClass={RELATIONSHIP_SELECTED_COLORS[value]}
                    unselectedClass={RELATIONSHIP_UNSELECTED_COLORS[value]}
                    iconBgClass={
                      isSelected
                        ? iconBgColors.selected
                        : iconBgColors.unselected
                    }
                    focusRingColor="focus-visible:ring-blue-500"
                    onSelect={v => handleSelect(v as RelationshipType)}
                    onHoverEnter={() => {}}
                    onHoverLeave={() => {}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
