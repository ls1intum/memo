'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { ArrowRight } from 'lucide-react';
import {
  Card,
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

type RelationshipTypeOption = {
  value: RelationshipType;
  label: string;
};

export default function SessionPage() {
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

  useEffect(() => {
    async function loadRelationshipTypes() {
      const result = await getRelationshipTypesAction();
      if (result.success && result.types && result.types.length > 0) {
        setRelationshipTypes(result.types);
        // Set initial relation state if not already set
        setRelation(prev => (prev === '' ? result.types[0]!.value : prev));
      }
    }

    async function loadDemoUser() {
      const result = await getOrCreateDemoUserAction();
      if (result.success && result.user) {
        setUserId(result.user.id);
      }
    }

    void loadRelationshipTypes();
    void loadDemoUser();
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

    if (!result.competencies || result.competencies.length === 0) {
      setCompetencies([]);
      return;
    }

    setCompetencies(result.competencies);
  }, [count]);

  useEffect(() => {
    void loadCompetencies();
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
        void loadCompetencies();
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

      // ⌘+Shift+Z or Ctrl+Shift+Z for Undo (only if there's history to undo)
      // Using Shift+Z to avoid browser's default undo behavior
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === 'z' &&
        event.shiftKey &&
        history.length > 0
      ) {
        event.preventDefault();
        event.stopPropagation();
        handleUndo();
        return;
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
    <div
      suppressHydrationWarning
      className="relative overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900"
    >
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-24 flex w-full max-w-6xl flex-col gap-8 px-6 pb-60 lg:mt-32 lg:px-0">
        <section className="space-y-8 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            <span>Mapping Session</span>
            <span className="text-slate-300">•</span>
            <span>Completed: {stats.completed}</span>
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
              <h2 className="text-2xl font-semibold text-slate-900">
                {isLoading || !competencies || competencies.length < 2
                  ? 'Loading competencies for this mapping session...'
                  : `How does "${competencies[0]!.title}" relate to "${
                      competencies[1]!.title
                    }"?`}
              </h2>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
                <div className="col-span-1">
                  {isLoading || !competencies || !competencies[0] ? (
                    <Card className="border border-white/70 bg-white/60">
                      <CardHeader>
                        <CardTitle className="text-slate-400">
                          Loading first competency...
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ) : (
                    <Card className="border border-white/70 bg-white/85 shadow-[0_28px_80px_-42px_rgba(7,30,84,0.55)] backdrop-blur-lg">
                      <CardHeader className="space-y-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                tabIndex={0}
                                className="bg-slate-100 text-slate-700 border-slate-200"
                              >
                                Apply
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
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                            Control Flow
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-lg text-slate-900">
                            {competencies[0]!.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-600">
                            {competencies[0]!.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </div>

                <div className="col-span-1 flex flex-col items-center justify-center gap-6 text-center md:col-start-2">
                  <div className="flex items-center justify-center gap-4 text-slate-500">
                    <div className="h-px w-12 bg-slate-300" />
                    <ArrowRight className="h-8 w-8" aria-hidden="true" />
                    <div className="h-px w-12 bg-slate-300" />
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    Select Relation Type
                  </div>
                  <div className="w-full max-w-[260px] md:ml-40">
                    <RadioGroup
                      value={relation}
                      onValueChange={value =>
                        setRelation(value as RelationshipType)
                      }
                      className="gap-4 items-start"
                    >
                      {relationshipTypes.length > 0 ? (
                        relationshipTypes.map(({ value, label }) => (
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
                        ))
                      ) : (
                        <div className="text-sm text-slate-400">
                          Loading relationship types...
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                </div>

                <div className="col-span-1">
                  {isLoading || !competencies || !competencies[1] ? (
                    <Card className="border border-white/70 bg-white/60">
                      <CardHeader>
                        <CardTitle className="text-slate-400">
                          Loading second competency...
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ) : (
                    <Card className="border border-white/70 bg-white/85 shadow-[0_28px_80px_-42px_rgba(7,30,84,0.55)] backdrop-blur-lg">
                      <CardHeader className="space-y-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                tabIndex={0}
                                className="bg-slate-100 text-slate-700 border-slate-200"
                              >
                                Apply
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
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                            Programming Fundamentals
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-lg text-slate-900">
                            {competencies[1]!.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-600">
                            {competencies[1]!.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                >
                  Undo{' '}
                  <Kbd className="ml-2 bg-slate-200 text-slate-700 border border-slate-300">
                    ⌘
                  </Kbd>
                  <Kbd className="ml-1 bg-slate-200 text-slate-700 border border-slate-300">
                    ⇧
                  </Kbd>
                  <Kbd className="ml-1 bg-slate-200 text-slate-700 border border-slate-300">
                    Z
                  </Kbd>
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300"
                  onClick={() => handleAction('skipped')}
                  disabled={isLoading}
                >
                  Skip{' '}
                  <Kbd className="ml-2 bg-slate-200 text-slate-700 border border-slate-300">
                    Space
                  </Kbd>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#0a4da2] text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] hover:bg-[#0d56b5]"
                  onClick={() => handleAction('completed')}
                  disabled={isLoading || isCreating || !userId || !relation}
                >
                  {isCreating ? 'Creating...' : 'Add Relation'}{' '}
                  <Kbd className="ml-2 bg-slate-200 text-slate-700 border border-slate-300">
                    ⏎
                  </Kbd>
                </Button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
