'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRandomCompetenciesAction } from '@/app/actions/competencies';
import {
  createCompetencyRelationshipAction,
  deleteCompetencyRelationshipAction,
} from '@/app/actions/competency_relationships';
import { getOrCreateDemoUserAction } from '@/app/actions/users';
import type { Competency } from '@/domain_core/model/domain_model';
import { RelationshipType } from '@/domain_core/model/domain_model';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';
import {
  ArrowRight,
  Info,
  ArrowLeftRight,
  Check,
  Layers,
  TrendingUp,
  Equal,
  Unlink,
} from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SessionStats = {
  completed: number;
  skipped: number;
};

type RelationshipTypeOption = {
  value: RelationshipType;
  label: string;
};

// Define relationship types statically from the enum - no server call needed
const RELATIONSHIP_TYPES: RelationshipTypeOption[] = (
  Object.values(RelationshipType) as RelationshipType[]
).map(type => ({
  value: type,
  label: type.charAt(0) + type.slice(1).toLowerCase(),
}));

// Blue-Purple theme colors (hardcoded after user selection)
const THEME_COLORS = {
  source: { primary: '#0a4da2', secondary: '#4263eb' },
  destination: { primary: '#7c3aed', secondary: '#9775fa' },
};

// Helper to get dynamic description for relationship types
// Used in the live preview banner
const getRelationshipDescription = (
  type: RelationshipType,
  titleA: string,
  titleB: string
) => {
  switch (type) {
    case 'ASSUMES':
      return (
        <>
          <span className="font-medium text-slate-900">{titleA}</span> requires{' '}
          <span className="font-medium text-slate-900">{titleB}</span> as
          prerequisite
        </>
      );
    case 'EXTENDS':
      return (
        <>
          <span className="font-medium text-slate-900">{titleA}</span> builds on
          / is a subset or advanced form of{' '}
          <span className="font-medium text-slate-900">{titleB}</span>
        </>
      );
    case 'MATCHES':
      return (
        <>
          <span className="font-medium text-slate-900">{titleA}</span> is
          equivalent / strongly overlaps with{' '}
          <span className="font-medium text-slate-900">{titleB}</span>
        </>
      );
    case 'UNRELATED':
      return (
        <>
          <span className="font-medium text-slate-900">{titleA}</span> and{' '}
          <span className="font-medium text-slate-900">{titleB}</span> have no
          meaningful relationship
        </>
      );
    default:
      return '';
  }
};

// Text colors for relationship types (used in preview sentence)
const RELATIONSHIP_TYPE_TEXT_COLORS: Record<RelationshipType, string> = {
  ASSUMES: 'text-blue-600',
  EXTENDS: 'text-purple-600',
  MATCHES: 'text-emerald-600',
  UNRELATED: 'text-slate-600',
};

// Shared scrollbar styles for competency description containers
const SCROLLBAR_STYLES: {
  scrollbarWidth: 'thin';
  scrollbarColor: string;
} = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgb(203 213 225) transparent',
};

function SessionPageContent() {
  const searchParams = useSearchParams();
  const countParam = searchParams.get('count');
  const parsedCount = countParam ? Number(countParam) : NaN;
  const count =
    Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 2;

  const [relation, setRelation] = useState<RelationshipType | null>(null);
  const [stats, setStats] = useState<SessionStats>({
    completed: 0,
    skipped: 0,
  });
  const [history, setHistory] = useState<
    Array<{
      type: 'completed' | 'skipped';
      relationshipId?: string;
      competencies?: Competency[];
    }>
  >([]);
  const [competencies, setCompetencies] = useState<Competency[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swapRotation, setSwapRotation] = useState(0);
  const [hoveredRelation, setHoveredRelation] =
    useState<RelationshipType | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((val: RelationshipType) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredRelation(val), 120);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredRelation(null), 70);
  }, []);

  // Cleanup hover timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, []);
  const [relationshipToDelete, setRelationshipToDelete] = useState<
    string | null
  >(null);

  useEffect(() => {
    async function loadDemoUser() {
      try {
        const result = await getOrCreateDemoUserAction();
        if (result.success && result.user) {
          setUserId(result.user.id);
        } else {
          setError(
            result.error ??
              'Failed to load user information. Please try again later.'
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading user information.'
        );
      }
    }

    void loadDemoUser();
  }, []);

  const loadCompetencies = useCallback(
    async (isInitialLoad = false) => {
      setError(null);

      // Only set competencies to null on initial load, not during transitions
      if (isInitialLoad) {
        setCompetencies(null);
      } else {
        setIsTransitioning(true);
      }

      const result = await getRandomCompetenciesAction(count);

      if (!result.success) {
        setError(
          result.error ??
            'An unexpected error occurred while fetching competencies.'
        );
        setCompetencies([]);
        setIsTransitioning(false);
        return;
      }

      if (!result.competencies || result.competencies.length === 0) {
        setCompetencies([]);
        setIsTransitioning(false);
        return;
      }

      setCompetencies(result.competencies);
      setIsTransitioning(false);
    },
    [count]
  );

  useEffect(() => {
    loadCompetencies(true);
  }, [loadCompetencies]);

  const handleAction = useCallback(
    async (type: 'completed' | 'skipped') => {
      if (type === 'completed') {
        // Create relationship in database using FormData
        if (!competencies || competencies.length < 2 || !relation || !userId) {
          setError('Missing required data to create relationship');
          return;
        }

        setIsCreating(true);
        setError(null);

        try {
          const formData = new FormData();
          formData.set('relationshipType', relation);
          formData.set('originId', competencies[0]!.id);
          formData.set('destinationId', competencies[1]!.id);
          formData.set('userId', userId);

          const result = await createCompetencyRelationshipAction(formData);

          if (!result.success) {
            setError(result.error ?? 'Failed to create relationship');
            setIsCreating(false);
            return;
          }

          // Success - update stats and reload new competencies
          setStats(prev => ({ ...prev, completed: prev.completed + 1 }));
          setHistory(prev => [
            ...prev,
            {
              type: 'completed',
              relationshipId: result.relationship?.id,
              competencies: competencies ? [...competencies] : undefined,
            },
          ]);
          setRelation(null); // Reset selection after adding relation
          await loadCompetencies();
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'An unexpected error occurred'
          );
        } finally {
          setIsCreating(false);
        }
      } else if (type === 'skipped') {
        // When skipping, just update stats and reload
        setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
        setHistory(prev => [
          ...prev,
          {
            type: 'skipped',
            competencies: competencies ? [...competencies] : undefined,
          },
        ]);
        setRelation(null); // Reset relationship type selection
        try {
          await loadCompetencies();
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : 'An unexpected error occurred while fetching competencies.'
          );
        }
      }
    },
    [competencies, relation, userId, loadCompetencies]
  );

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      const updated = [...prev];
      const last = updated.pop();
      if (last) {
        setStats(prevStats => ({
          ...prevStats,
          [last.type]: Math.max(0, prevStats[last.type] - 1),
        }));

        // If it was a completed action with a relationship, mark it for deletion
        if (last.type === 'completed' && last.relationshipId) {
          setRelationshipToDelete(last.relationshipId);
        }

        // Restore the competencies that were shown before this action
        if (last.competencies && last.competencies.length >= 2) {
          setCompetencies(last.competencies);
        }
      }
      return updated;
    });
  }, []);

  // Delete relationship from DB when relationshipToDelete is set
  useEffect(() => {
    if (relationshipToDelete) {
      deleteCompetencyRelationshipAction(relationshipToDelete)
        .then(result => {
          if (!result.success) {
            setError(result.error ?? 'Failed to delete relationship');
          }
        })
        .catch(err => {
          setError(
            err instanceof Error ? err.message : 'Failed to delete relationship'
          );
        })
        .finally(() => {
          setRelationshipToDelete(null);
        });
    }
  }, [relationshipToDelete]);

  const isLoading = competencies === null && !error;
  const noCompetencies = competencies !== null && competencies.length === 0;
  const notEnough =
    !!competencies && competencies.length > 0 && competencies.length < 2;

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Shift+Z for Undo (only if there's history to undo, and NOT Cmd/Ctrl+Shift+Z)
      // Check this early to prevent conflicts with other handlers
      if (
        event.key.toLowerCase() === 'z' &&
        event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        history.length > 0
      ) {
        event.preventDefault();
        event.stopPropagation();
        handleUndo();
        return;
      }

      // If Enter is pressed on a relationship button, prevent default button behavior
      // and let the global handler manage it
      if (
        event.key === 'Enter' &&
        target.tagName === 'BUTTON' &&
        target.closest('[data-relationship-button]')
      ) {
        event.preventDefault();
        event.stopPropagation();
        // Continue to global Enter handler below
      }

      // Space for Skip (only if not loading and has competencies)
      if (
        event.key === ' ' &&
        !isLoading &&
        !isCreating &&
        competencies &&
        competencies.length >= 2
      ) {
        event.preventDefault();
        handleAction('skipped');
        return;
      }

      // 1, 2, 3, 4 for relationship types (only if relationship types are loaded)
      // Check this BEFORE Enter to prevent conflicts
      if (
        ['1', '2', '3', '4'].includes(event.key) &&
        RELATIONSHIP_TYPES.length > 0 &&
        !isLoading &&
        !isCreating
      ) {
        event.preventDefault();
        event.stopPropagation();
        const index = parseInt(event.key) - 1;
        if (RELATIONSHIP_TYPES[index]) {
          const selectedValue = RELATIONSHIP_TYPES[index]!.value;
          setRelation(prev => (prev === selectedValue ? null : selectedValue));
        }
        return;
      }

      // Enter for Add Relation (only if not loading, not creating, has userId, relation, and competencies)
      if (
        event.key === 'Enter' &&
        !isLoading &&
        !isCreating &&
        userId &&
        relation &&
        competencies &&
        competencies.length >= 2
      ) {
        event.preventDefault();
        event.stopPropagation();
        handleAction('completed');
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isLoading,
    isCreating,
    userId,
    relation,
    competencies,
    history,
    handleAction,
    handleUndo,
  ]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl flex-col gap-6 px-6 pb-24 lg:mt-24 lg:px-0">
        <section className="space-y-6 rounded-[24px] border border-white/70 bg-white/85 p-6 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-center gap-3 pb-4 border-b border-slate-200/60">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] text-white border-0 font-semibold text-xs px-4 py-1.5 shadow-md">
                Mapping Session
              </Badge>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>
                    Completed:{' '}
                    <span className="font-semibold text-slate-900">
                      {stats.completed}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          {error && (
            <Card className="border border-red-100 bg-red-50/80">
              <CardHeader>
                <CardTitle className="text-red-800">
                  Failed to load competencies
                </CardTitle>
                <CardDescription className="text-red-700">
                  {error}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {noCompetencies && !error && (
            <Card className="border border-red-100 bg-red-50/80">
              <CardHeader>
                <CardTitle className="text-red-800">
                  No competencies available
                </CardTitle>
                <CardDescription className="text-red-700">
                  There are currently no competencies in the database. Please
                  run the seed script (e.g. <code>npm run db:seed</code>) or
                  create competencies manually before starting a mapping
                  session.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {notEnough && !error && (
            <Card className="border border-amber-100 bg-amber-50/80">
              <CardHeader>
                <CardTitle className="text-amber-800">
                  Not enough competencies
                </CardTitle>
                <CardDescription className="text-amber-700">
                  At least two competencies are required to start a mapping
                  session. Please add more competencies first.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!error && !noCompetencies && !notEnough && (
            <>
              {/* Main Question */}
              <div className="flex flex-col items-center justify-center text-center space-y-2 mx-auto w-full">
                {isLoading || !competencies || competencies.length < 2 ? (
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500">
                      How does
                    </span>
                    <div className="h-7 w-40 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500">
                      relate to
                    </span>
                    <div className="h-7 w-36 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500">
                      ?
                    </span>
                  </div>
                ) : (
                  <h1 className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-800 leading-relaxed tracking-tight">
                    How does{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary})`,
                      }}
                    >
                      {competencies[0]!.title}
                    </span>{' '}
                    relate to{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${THEME_COLORS.destination.primary}, ${THEME_COLORS.destination.secondary})`,
                      }}
                    >
                      {competencies[1]!.title}
                    </span>
                    ?
                  </h1>
                )}
              </div>

              {/* Competencies Side by Side for Comparison */}
              <div className="py-4">
                <div
                  className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr]"
                  style={{ isolation: 'isolate' }}
                >
                  {/* Origin Competency */}
                  {isLoading || !competencies || !competencies[0] ? (
                    <Card className="relative flex h-[280px] flex-col border-2 border-slate-200/50 bg-gradient-to-br from-slate-50/80 to-white shadow-lg overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-slate-300 to-slate-200 rounded-r-full" />
                      <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5">
                        <div className="h-6 w-24 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                        <div className="flex gap-2">
                          <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse" />
                          <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse" />
                        </div>
                        <div className="h-6 w-3/4 rounded-md bg-slate-200 animate-pulse mt-2" />
                        <div className="space-y-2 mt-2">
                          <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                          <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
                          <div className="h-4 w-4/6 rounded bg-slate-100 animate-pulse" />
                        </div>
                      </CardHeader>
                    </Card>
                  ) : (
                    <Card
                      className={`relative flex h-[280px] flex-col border-2 border-[#0a4da2]/30 bg-gradient-to-br from-blue-50/80 to-white shadow-lg transition-all duration-300 overflow-hidden ${isTransitioning || isCreating ? 'opacity-60 scale-[0.99]' : 'opacity-100 scale-100'}`}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
                        style={{
                          backgroundImage: `linear-gradient(to bottom, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary})`,
                        }}
                      />
                      <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5 overflow-visible">
                        <div className="flex-shrink-0">
                          <Badge
                            className="w-fit text-white font-semibold text-xs px-3 py-1.5"
                            style={{
                              backgroundColor: THEME_COLORS.source.primary,
                              borderColor: THEME_COLORS.source.primary,
                            }}
                          >
                            Competency
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          {/* Placeholder badges; replace with competency metadata once available */}
                          <Tooltip side="top">
                            <TooltipTrigger asChild>
                              <Badge
                                tabIndex={0}
                                className="bg-slate-100 text-slate-700 border border-slate-300 cursor-help hover:bg-slate-200 transition-colors"
                              >
                                Apply
                                <Info className="h-3 w-3 ml-1.5" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Bloom&apos;s Taxonomy categorizes learning
                                objectives by cognitive level.
                              </p>
                              <p className="mt-1">
                                → Apply: use knowledge in practice (implement,
                                execute, solve).
                              </p>
                              <p className="mt-1 text-[11px] text-slate-200">
                                Levels: Remember • Understand • Apply • Analyze
                                • Evaluate • Create
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Badge className="bg-slate-100 text-slate-700 border border-slate-300">
                            Control Flow
                          </Badge>
                        </div>
                        <div className="flex-1 flex flex-col min-h-0 space-y-2">
                          <CardTitle className="text-lg font-bold text-slate-900 flex-shrink-0">
                            {competencies[0]!.title}
                          </CardTitle>
                          <div
                            className="flex-1 overflow-y-scroll pr-2 scrollbar-thin"
                            style={SCROLLBAR_STYLES}
                          >
                            <CardDescription className="text-base leading-relaxed text-slate-600">
                              {competencies[0]!.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}

                  {/* Arrow Connection with Swap Button */}
                  <div className="flex flex-col items-center justify-center z-10 px-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-0.5 w-12"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary})`,
                        }}
                      />
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-xl ring-3 ring-white"
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
                    {competencies && competencies.length >= 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSwapRotation(prev => prev + 180);
                          setIsTransitioning(true);

                          // Wait for fade out before swapping
                          setTimeout(() => {
                            if (competencies && competencies.length >= 2) {
                              setCompetencies([
                                competencies[1]!,
                                competencies[0]!,
                              ]);
                            }
                            setIsTransitioning(false);
                          }, 300);
                        }}
                        className="text-slate-700 border border-slate-300 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-0 focus-visible:ring-0"
                      >
                        <ArrowLeftRight
                          className="h-4 w-4 mr-1.5 transition-transform duration-500 will-change-transform"
                          style={{ transform: `rotate(${swapRotation}deg)` }}
                        />
                        Swap Direction
                      </Button>
                    )}
                  </div>

                  {/* Destination Competency */}
                  {isLoading || !competencies || !competencies[1] ? (
                    <Card className="relative flex h-[280px] flex-col border-2 border-slate-200/50 bg-gradient-to-br from-slate-50/80 to-white shadow-lg overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-slate-300 to-slate-200 rounded-r-full" />
                      <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5">
                        <div className="h-6 w-24 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                        <div className="flex gap-2">
                          <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse" />
                          <div className="h-5 w-24 rounded-full bg-slate-200 animate-pulse" />
                        </div>
                        <div className="h-6 w-4/5 rounded-md bg-slate-200 animate-pulse mt-2" />
                        <div className="space-y-2 mt-2">
                          <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                          <div className="h-4 w-4/5 rounded bg-slate-100 animate-pulse" />
                          <div className="h-4 w-3/5 rounded bg-slate-100 animate-pulse" />
                        </div>
                      </CardHeader>
                    </Card>
                  ) : (
                    <Card
                      className={`relative flex h-[280px] flex-col border-2 border-[#9775fa]/30 bg-gradient-to-br from-purple-50/80 to-white shadow-lg transition-all duration-300 overflow-hidden ${isTransitioning || isCreating ? 'opacity-60 scale-[0.99]' : 'opacity-100 scale-100'}`}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
                        style={{
                          backgroundImage: `linear-gradient(to bottom, ${THEME_COLORS.destination.primary}, ${THEME_COLORS.destination.secondary})`,
                        }}
                      />
                      <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5 overflow-visible">
                        <div className="flex-shrink-0">
                          <Badge
                            className="w-fit text-white font-semibold text-xs px-3 py-1.5"
                            style={{
                              backgroundColor: THEME_COLORS.destination.primary,
                              borderColor: THEME_COLORS.destination.primary,
                            }}
                          >
                            Competency
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          {/* Placeholder badges; replace with competency metadata once available */}
                          <Tooltip side="top">
                            <TooltipTrigger asChild>
                              <Badge
                                tabIndex={0}
                                className="bg-slate-100 text-slate-700 border border-slate-300 cursor-help hover:bg-slate-200 transition-colors"
                              >
                                Apply
                                <Info className="h-3 w-3 ml-1.5" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Bloom&apos;s Taxonomy categorizes learning
                                objectives by cognitive level.
                              </p>
                              <p className="mt-1">
                                → Apply: use knowledge in practice (implement,
                                execute, solve).
                              </p>
                              <p className="mt-1 text-[11px] text-slate-200">
                                Levels: Remember • Understand • Apply • Analyze
                                • Evaluate • Create
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Badge className="bg-slate-100 text-slate-700 border border-slate-300">
                            Programming Fundamentals
                          </Badge>
                        </div>
                        <div className="flex-1 flex flex-col min-h-0 space-y-2">
                          <CardTitle className="text-lg font-bold text-slate-900 flex-shrink-0">
                            {competencies[1]!.title}
                          </CardTitle>
                          <div
                            className="flex-1 overflow-y-scroll pr-2 scrollbar-thin"
                            style={SCROLLBAR_STYLES}
                          >
                            <CardDescription className="text-base leading-relaxed text-slate-600">
                              {competencies[1]!.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              </div>

              {/* Combined Relationship Selection Section */}
              <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
                {/* Live Preview Sentence */}
                {competencies && competencies.length >= 2 && (
                  <div className="rounded-xl bg-gradient-to-r from-blue-50/90 via-purple-50/70 to-blue-50/90 border border-blue-200/50 py-4 px-5 text-center">
                    {hoveredRelation ? (
                      <p className="text-base text-slate-800 leading-relaxed font-bold animate-in fade-in duration-200">
                        <span
                          className={`font-bold ${RELATIONSHIP_TYPE_TEXT_COLORS[hoveredRelation]}`}
                        >
                          {
                            RELATIONSHIP_TYPES.find(
                              rt => rt.value === hoveredRelation
                            )?.label
                          }
                          :
                        </span>{' '}
                        {getRelationshipDescription(
                          hoveredRelation,
                          competencies[0]!.title,
                          competencies[1]!.title
                        )}
                      </p>
                    ) : relation ? (
                      <p className="text-base text-slate-800 leading-relaxed font-bold">
                        <span className="font-bold text-slate-900">
                          {competencies[0]!.title}
                        </span>{' '}
                        <span
                          className={`font-bold ${RELATIONSHIP_TYPE_TEXT_COLORS[relation] || 'text-slate-600'}`}
                        >
                          {relation === 'UNRELATED'
                            ? 'is unrelated to'
                            : RELATIONSHIP_TYPES.find(
                                rt => rt.value === relation
                              )?.label.toLowerCase() || ''}
                        </span>{' '}
                        <span className="font-bold text-slate-900">
                          {competencies[1]!.title}
                        </span>
                      </p>
                    ) : (
                      <p className="text-base text-slate-800 leading-relaxed font-bold">
                        Select a relationship type below or press{' '}
                        <Kbd className="bg-white text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          1
                        </Kbd>{' '}
                        <Kbd className="bg-white text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          2
                        </Kbd>{' '}
                        <Kbd className="bg-white text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          3
                        </Kbd>{' '}
                        <Kbd className="bg-white text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          4
                        </Kbd>
                      </p>
                    )}
                  </div>
                )}

                {/* Relationship Type Buttons */}
                {RELATIONSHIP_TYPES.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                    {RELATIONSHIP_TYPES.map(({ value, label }) => {
                      const isSelected = relation === value;
                      const shortcutIndex = RELATIONSHIP_TYPES.findIndex(
                        rt => rt.value === value
                      );
                      const shortcutKey =
                        shortcutIndex >= 0
                          ? (shortcutIndex + 1).toString()
                          : null;

                      // Color mapping for selected state
                      const selectedColors: Record<RelationshipType, string> = {
                        ASSUMES:
                          'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-blue-600',
                        EXTENDS:
                          'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border-purple-600',
                        MATCHES:
                          'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-600',
                        UNRELATED:
                          'bg-slate-600 text-white shadow-lg shadow-slate-500/25 border-slate-600',
                      };

                      // Color mapping for unselected state - subtle color hints
                      const unselectedColors: Record<RelationshipType, string> =
                        {
                          ASSUMES:
                            'bg-white text-slate-800 border-blue-300 hover:border-blue-500 hover:bg-blue-50',
                          EXTENDS:
                            'bg-white text-slate-800 border-purple-300 hover:border-purple-500 hover:bg-purple-50',
                          MATCHES:
                            'bg-white text-slate-800 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50',
                          UNRELATED:
                            'bg-white text-slate-800 border-slate-300 hover:border-slate-500 hover:bg-slate-50',
                        };

                      // Icon mapping for relationship types
                      const iconMap: Record<RelationshipType, React.ReactNode> =
                        {
                          ASSUMES: <Layers className="h-4 w-4" />,
                          EXTENDS: <TrendingUp className="h-4 w-4" />,
                          MATCHES: <Equal className="h-4 w-4" />,
                          UNRELATED: <Unlink className="h-4 w-4" />,
                        };

                      return (
                        <button
                          key={value}
                          type="button"
                          data-relationship-button
                          onClick={() => setRelation(isSelected ? null : value)}
                          onMouseEnter={() => handleMouseEnter(value)}
                          onMouseLeave={handleMouseLeave}
                          className={`
                            relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 w-full
                            font-medium text-sm transition-all duration-200 ease-out
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                            ${
                              isSelected
                                ? `${selectedColors[value]} scale-[1.02]`
                                : unselectedColors[value]
                            }
                          `}
                        >
                          {iconMap[value]}
                          <span>{label}</span>
                          {shortcutKey && (
                            <span
                              className={`
                                inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold
                                ${
                                  isSelected
                                    ? 'bg-white/25 text-white'
                                    : 'bg-slate-200/80 text-slate-500'
                                }
                              `}
                            >
                              {shortcutKey}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex justify-center p-4">
                    <div className="text-slate-400 text-base font-bold">
                      Loading relationship types...
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-200/40 mx-auto max-w-5xl">
                <div className="flex items-center justify-between">
                  {/* Left: Undo */}
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-1">
                      <span className="mr-1">Undo</span>
                      <Kbd className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-1.5 py-0.5">
                        ⇧
                      </Kbd>
                      <span className="text-slate-400 text-xs">+</span>
                      <Kbd className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-1.5 py-0.5">
                        Z
                      </Kbd>
                    </div>
                  </button>

                  {/* Right: Primary Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAction('skipped')}
                      disabled={isLoading || isCreating}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Skip
                      <Kbd className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-1.5 py-0.5">
                        Space
                      </Kbd>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction('completed')}
                      disabled={isLoading || isCreating || !userId || !relation}
                      className={`
                        relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white
                        min-w-[180px]
                        bg-gradient-to-r from-[#0a4da2] to-[#5538d1]
                        shadow-lg shadow-blue-500/20
                        transition-all duration-200 ease-out
                        hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]
                        active:scale-[0.98]
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        disabled:hover:shadow-lg disabled:hover:scale-100
                      `}
                    >
                      {isCreating ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        <>
                          Add Relation
                          <Kbd className="bg-white/20 text-white border border-white/30 text-xs px-1.5 py-0.5">
                            ⏎
                          </Kbd>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff]">
          <div className="text-slate-600">Loading session...</div>
        </div>
      }
    >
      <SessionPageContent />
    </Suspense>
  );
}
