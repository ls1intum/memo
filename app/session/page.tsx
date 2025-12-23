'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRandomCompetenciesAction } from '@/app/actions/competencies';
import {
  getRelationshipTypesAction,
  createCompetencyRelationshipAction,
  deleteCompetencyRelationshipAction,
} from '@/app/actions/competency_relationships';
import { getOrCreateDemoUserAction } from '@/app/actions/users';
import type { Competency } from '@/lib/domain/domain_core';
import type { RelationshipType } from '@/lib/domain/domain_core';
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
  ArrowDown,
  Info,
  ArrowLeftRight,
  Check,
  Layers,
  TrendingUp,
  Equal,
  Plus,
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

// Configuration mapping relationship types to their theme classes
const RELATIONSHIP_TYPE_THEMES: Record<
  RelationshipType,
  {
    colorClasses: {
      selected: string;
      unselected: string;
    };
    iconBgClasses: {
      selected: string;
      unselected: string;
    };
    iconColorClass: string;
  }
> = {
  ASSUMES: {
    colorClasses: {
      selected:
        'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30',
      unselected:
        'bg-white border-blue-500/30 text-slate-700 hover:border-blue-500 hover:bg-blue-50',
    },
    iconBgClasses: {
      selected: 'bg-white/20',
      unselected: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    },
    iconColorClass: 'text-blue-500',
  },
  EXTENDS: {
    colorClasses: {
      selected:
        'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30',
      unselected:
        'bg-white border-purple-500/30 text-slate-700 hover:border-purple-500 hover:bg-purple-50',
    },
    iconBgClasses: {
      selected: 'bg-white/20',
      unselected: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    },
    iconColorClass: 'text-purple-500',
  },
  MATCHES: {
    colorClasses: {
      selected:
        'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/30',
      unselected:
        'bg-white border-emerald-500/30 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50',
    },
    iconBgClasses: {
      selected: 'bg-white/20',
      unselected: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    },
    iconColorClass: 'text-emerald-500',
  },
};

// Descriptions for relationship types (used in tooltips)
const RELATIONSHIP_TYPE_DESCRIPTIONS: Record<RelationshipType, string> = {
  ASSUMES: 'A requires B as prerequisite',
  EXTENDS: 'A builds on / is a subset or advanced form of B',
  MATCHES: 'A is equivalent / strongly overlaps with B',
};

// Utility functions for relationship type styling
function getColorClasses(
  relationshipType: RelationshipType,
  selected: boolean
): string {
  const theme = RELATIONSHIP_TYPE_THEMES[relationshipType];
  if (!theme) {
    return 'bg-white border-slate-300 text-slate-700';
  }
  return selected ? theme.colorClasses.selected : theme.colorClasses.unselected;
}

function getIconBgClasses(
  relationshipType: RelationshipType,
  selected: boolean
): string {
  const theme = RELATIONSHIP_TYPE_THEMES[relationshipType];
  if (!theme) {
    return 'bg-slate-500/10';
  }
  return selected
    ? theme.iconBgClasses.selected
    : theme.iconBgClasses.unselected;
}

function getIconColorClasses(
  relationshipType: RelationshipType,
  selected: boolean
): string {
  if (selected) return 'text-white';
  const theme = RELATIONSHIP_TYPE_THEMES[relationshipType];
  if (!theme) {
    return 'text-slate-500';
  }
  return theme.iconColorClass;
}

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

  const [relationshipTypes, setRelationshipTypes] = useState<
    RelationshipTypeOption[]
  >([]);
  const [relation, setRelation] = useState<RelationshipType | ''>('');
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
  const [relationshipToDelete, setRelationshipToDelete] = useState<
    string | null
  >(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    async function loadRelationshipTypes() {
      try {
        const result = await getRelationshipTypesAction();
        if (result.success && result.types && result.types.length > 0) {
          setRelationshipTypes(result.types);
        } else {
          setError(
            result.error ??
              'Failed to load relationship types. Please try again later.'
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading relationship types.'
        );
      }
    }

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

    loadRelationshipTypes();
    loadDemoUser();
  }, []);

  const loadCompetencies = useCallback(async () => {
    setError(null);
    setCompetencies(null);

    const result = await getRandomCompetenciesAction(count);
    if (!result.success) {
      setError(
        result.error ??
          'An unexpected error occurred while fetching competencies.'
      );
      setCompetencies([]);
      return;
    }

    // Clear any previous errors on success
    setError(null);

    if (!result.competencies || result.competencies.length === 0) {
      setCompetencies([]);
      return;
    }

    setCompetencies(result.competencies);
  }, [count]);

  useEffect(() => {
    loadCompetencies();
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
          setRelation(''); // Clear selection after adding relation
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
        setRelation(''); // Reset relationship type selection
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
    isMountedRef.current = true;

    function handleKeyDown(event: KeyboardEvent) {
      // Don't execute if component is unmounted
      if (!isMountedRef.current) return;

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

      // 1, 2, 3 for relationship types (only if relationship types are loaded)
      // Check this BEFORE Enter to prevent conflicts
      if (
        ['1', '2', '3'].includes(event.key) &&
        relationshipTypes.length > 0 &&
        !isLoading &&
        !isCreating
      ) {
        event.preventDefault();
        event.stopPropagation();
        const index = parseInt(event.key) - 1;
        if (relationshipTypes[index]) {
          const selectedValue = relationshipTypes[index]!.value;
          setRelation(relation === selectedValue ? '' : selectedValue);
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
      isMountedRef.current = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isLoading,
    isCreating,
    userId,
    relation,
    competencies,
    history,
    relationshipTypes,
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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] text-white border-0 font-semibold text-xs px-4 py-1.5 shadow-md">
                Mapping Session
              </Badge>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Completed: <span className="font-semibold text-slate-900">{stats.completed}</span></span>
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
              <div className="space-y-4">
                <div>
                  {isLoading || !competencies || competencies.length < 2 ? (
                    <h1 className="text-xl font-bold text-slate-900 leading-tight">
                      Loading competencies for this mapping session...
                    </h1>
                  ) : (
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                      How does{' '}
                      <span className="text-[#0a4da2]">{competencies[0]!.title}</span>{' '}
                      relate to{' '}
                      <span className="text-[#7c3aed]">{competencies[1]!.title}</span>?
                    </h1>
                  )}
                </div>
              </div>

              {/* Competencies Side by Side for Comparison */}
              <div className="py-4">
                <div
                  className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr]"
                  style={{ isolation: 'isolate' }}
                >
                {/* Origin Competency */}
                {isLoading || !competencies || !competencies[0] ? (
                  <Card className="border border-slate-200 bg-slate-50/50">
                    <CardHeader>
                      <CardTitle className="text-slate-400">
                        Loading...
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card className="relative flex h-[300px] flex-col border-2 border-[#0a4da2]/30 bg-gradient-to-br from-blue-50/80 to-white shadow-lg transition-all hover:border-[#0a4da2]/50 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#0a4da2] to-[#4263eb] rounded-r-full" />
                    <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5 overflow-visible">
                      <div className="flex-shrink-0">
                        <Badge className="w-fit bg-[#0a4da2] text-white border-[#0a4da2] font-semibold text-xs px-3 py-1.5">
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
                              Levels: Remember • Understand • Apply • Analyze •
                              Evaluate • Create
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
                    <div className="h-0.5 w-12 bg-gradient-to-r from-[#0a4da2] to-[#4263eb]" />
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a4da2] via-[#4263eb] to-[#9775fa] shadow-xl ring-3 ring-white">
                      <ArrowRight
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="h-0.5 w-12 bg-gradient-to-l from-[#9775fa] to-[#5538d1]" />
                  </div>
                  {competencies && competencies.length >= 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        if (competencies && competencies.length >= 2) {
                          setCompetencies([competencies[1]!, competencies[0]!]);
                        }
                        // Remove focus after click
                        (e.currentTarget as HTMLButtonElement).blur();
                      }}
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                    >
                      <ArrowLeftRight className="h-4 w-4 mr-1.5" />
                      Swap Direction
                    </Button>
                  )}
                </div>

                {/* Destination Competency */}
                {isLoading || !competencies || !competencies[1] ? (
                  <Card className="border border-slate-200 bg-slate-50/50">
                    <CardHeader>
                      <CardTitle className="text-slate-400">
                        Loading...
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card className="relative flex h-[300px] flex-col border-2 border-[#9775fa]/30 bg-gradient-to-br from-purple-50/80 to-white shadow-lg transition-all hover:border-[#9775fa]/50 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#9775fa] to-[#5538d1] rounded-r-full" />
                    <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5 overflow-visible">
                      <div className="flex-shrink-0">
                        <Badge className="w-fit bg-[#7c3aed] text-white border-[#7c3aed] font-semibold text-xs px-3 py-1.5">
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
                              Levels: Remember • Understand • Apply • Analyze •
                              Evaluate • Create
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

              {/* Relationship Selector */}
              <div className="space-y-4 pt-3">
                {/* Live Preview Sentence */}
                {competencies && competencies.length >= 2 && (
                  <div className="rounded-lg bg-gradient-to-r from-blue-50/80 via-purple-50/60 to-blue-50/80 border-2 border-blue-200/50 py-3 px-4 shadow-sm">
                    {relation ? (
                      <p className="text-base text-center text-slate-800 leading-relaxed">
                        <span className="font-bold text-slate-900">
                          {competencies[0]!.title}
                        </span>{' '}
                        <span className="text-[#0a4da2] font-bold">
                          {relationshipTypes
                            .find(rt => rt.value === relation)
                            ?.label.toLowerCase() || ''}
                        </span>{' '}
                        <span className="font-bold text-slate-900">
                          {competencies[1]!.title}
                        </span>
                      </p>
                    ) : (
                      <p className="text-base text-center text-slate-800 leading-relaxed font-bold">
                        Select a relationship type below or press{' '}
                        <Kbd className="bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          1
                        </Kbd>{' '}
                        <Kbd className="bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          2
                        </Kbd>{' '}
                        <Kbd className="bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                          3
                        </Kbd>
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  {relationshipTypes.length > 0 ? (
                    relationshipTypes.map(({ value, label }) => {
                      const isSelected = relation === value;
                      const iconMap = {
                        ASSUMES: Layers,
                        EXTENDS: TrendingUp,
                        MATCHES: Equal,
                      };
                      const Icon = iconMap[value] || ArrowDown;
                      const shortcutIndex = relationshipTypes.findIndex(
                        rt => rt.value === value
                      );
                      const shortcutKey =
                        shortcutIndex >= 0
                          ? (shortcutIndex + 1).toString()
                          : null;

                      const description =
                        RELATIONSHIP_TYPE_DESCRIPTIONS[value] || '';

                      return (
                        <button
                          key={value}
                          type="button"
                          data-relationship-button
                          onClick={() => setRelation(isSelected ? '' : value)}
                          className={`group relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all duration-200 w-full ${
                            isSelected ? 'scale-[1.02]' : ''
                          } ${getColorClasses(value, isSelected)}`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${getIconBgClasses(value, isSelected)}`}
                          >
                            <Icon
                              className={`h-5 w-5 ${getIconColorClasses(value, isSelected)}`}
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold flex items-center gap-2">
                              {label}
                              <Tooltip side="top">
                                <TooltipTrigger asChild>
                                  <Info
                                    className={`h-3.5 w-3.5 cursor-help ${
                                      isSelected
                                        ? 'text-white/70'
                                        : 'text-slate-500'
                                    }`}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isSelected && (
                              <span className="text-xs opacity-90">
                                Selected
                              </span>
                            )}
                            {shortcutKey && (
                              <Kbd
                                className={`${isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-slate-100 text-slate-700 border border-slate-300'} text-xs font-semibold px-2 py-1`}
                              >
                                {shortcutKey}
                              </Kbd>
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-3 rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-400">
                      Loading relationship types...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 mt-10 pt-6 border-t border-slate-200/60">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Secondary Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={history.length === 0}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none"
                    >
                      Undo
                      <Kbd className="shrink-0 bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1 flex items-center gap-1">
                        <span>⇧</span>
                        <Plus className="h-3 w-3" />
                        <span>Z</span>
                      </Kbd>
                    </button>
                  </div>
                  
                  {/* Primary Actions */}
                  <div className="flex-1" />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAction('skipped')}
                      disabled={isLoading || isCreating}
                      className="flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none"
                    >
                      Skip
                      <Kbd className="shrink-0 bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1">
                        Space
                      </Kbd>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('completed')}
                      disabled={isLoading || isCreating || !userId || !relation}
                      className="flex items-center gap-2 rounded-lg border-2 border-[#0a4da2] bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:from-[#0d56b5] hover:to-[#8a7aff] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0a4da2] disabled:hover:to-[#7c6cff] disabled:hover:shadow-lg"
                    >
                      {isCreating ? (
                        <>Creating...</>
                      ) : (
                        <>
                          Add Relation
                          <Kbd className="shrink-0 bg-white/20 text-white border border-white/30 text-xs font-semibold px-2 py-1">
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
