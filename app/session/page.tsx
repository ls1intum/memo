'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { competenciesApi } from '@/lib/api/competencies';
import { competencyRelationshipsApi } from '@/lib/api/competency-relationships';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { Competency } from '@/lib/api/types';
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

type RelationshipType = 'ASSUMES' | 'EXTENDS' | 'MATCHES';

type SessionStats = {
  completed: number;
  skipped: number;
};

type RelationshipTypeOption = {
  value: RelationshipType;
  label: string;
};

const RELATIONSHIP_TYPES: RelationshipTypeOption[] = [
  { value: 'ASSUMES', label: 'Assumes' },
  { value: 'EXTENDS', label: 'Extends' },
  { value: 'MATCHES', label: 'Matches' },
];

function SessionPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const countParam = searchParams.get('count');
  const parsedCount = countParam ? Number(countParam) : NaN;
  const count =
    Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 2;

  const [relation, setRelation] = useState<RelationshipType>(
    RELATIONSHIP_TYPES[0]!.value
  );
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
  const [error, setError] = useState<string | null>(null);

  // Fetch random competencies
  const {
    data: competencies,
    isLoading,
    refetch: loadCompetencies,
  } = useQuery({
    queryKey: ['random-competencies', count],
    queryFn: () => competenciesApi.getRandom(count),
    retry: 1,
  });

  // Create relationship mutation
  const createRelationshipMutation = useMutation({
    mutationFn: competencyRelationshipsApi.create,
    onSuccess: (data) => {
      setStats((prev) => ({ ...prev, completed: prev.completed + 1 }));
      setHistory((prev) => [
        ...prev,
        {
          type: 'completed',
          relationshipId: data.id,
          competencies: competencies ? [...competencies] : undefined,
        },
      ]);
      loadCompetencies();
      setError(null);
    },
    onError: (error: Error) => {
      setError(
        error.message || 'Failed to create relationship'
      );
    },
  });

  // Delete relationship mutation  
  const deleteRelationshipMutation = useMutation({
    mutationFn: competencyRelationshipsApi.delete,
    onSuccess: () => {
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to delete relationship');
    },
  });

  const handleAction = useCallback(
    (type: 'completed' | 'skipped') => {
      if (type === 'completed' && user && competencies && competencies.length === 2) {
        createRelationshipMutation.mutate({
          relationshipType: relation,
          originId: competencies[0]!.id,
          destinationId: competencies[1]!.id,
          userId: user.preferred_username || 'guest',
        });
      } else if (type === 'skipped') {
        setStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
        setHistory((prev) => [
          ...prev,
          { type: 'skipped', competencies: competencies ? [...competencies] : undefined },
        ]);
        loadCompetencies();
      }
    },
    [relation, competencies, user, createRelationshipMutation, loadCompetencies]
  );

  const handleUndo = useCallback(() => {
    const lastAction = history[history.length - 1];
    if (!lastAction) return;

    if (lastAction.type === 'completed' && lastAction.relationshipId) {
      deleteRelationshipMutation.mutate(lastAction.relationshipId, {
        onSuccess: () => {
          setHistory((prev) => prev.slice(0, -1));
          setStats((prev) => ({
            ...prev,
            completed: Math.max(0, prev.completed - 1),
          }));
        },
      });
    } else if (lastAction.type === 'skipped') {
      setHistory((prev) => prev.slice(0, -1));
      setStats((prev) => ({ ...prev, skipped: Math.max(0, prev.skipped - 1) }));
    }
  }, [history, deleteRelationshipMutation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !isLoading) {
        e.preventDefault();
        handleAction('skipped');
      } else if (e.key === 'Enter' && !isLoading && !createRelationshipMutation.isPending) {
        e.preventDefault();
        handleAction('completed');
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, handleUndo, isLoading, createRelationshipMutation.isPending]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 z-[-10] opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-[20rem] w-[20rem] rounded-full bg-[rgba(127,176,255,0.35)] blur-[140px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[rgba(255,223,243,0.55)] to-[rgba(255,243,248,0.35)] blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-20 pt-32 lg:px-0">
        <section className="flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-40px_rgba(7,30,84,0.45)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2 w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900">
                Mapping Session
              </Badge>
              <h1 className="text-2xl font-semibold text-slate-900">
                Competency Relations
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {stats.completed} completed · {stats.skipped} skipped
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
          ) : !competencies || competencies.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-center">
              <p className="text-sm font-medium text-amber-800">
                No competencies available. Please try again later.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label className="text-sm font-medium text-slate-700">
                    Relationship Type
                  </Label>
                  <RadioGroup
                    value={relation}
                    onValueChange={(value) =>
                      setRelation(value as RelationshipType)
                    }
                  >
                    {RELATIONSHIP_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                        />
                        <Label
                          htmlFor={type.value}
                          className="cursor-pointer text-sm font-normal text-slate-700"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-2">
                  {competencies[0] && (
                    <Card className="flex-1 rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                      <CardHeader className="p-0">
                        <div className="space-y-2">
                          <Badge variant="outline" className="w-fit rounded-md border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Origin
                          </Badge>
                          <CardTitle className="text-base font-semibold text-slate-900">
                            {competencies[0]!.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-600">
                            {competencies[0]!.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  )}

                  <Tooltip>
                    <TooltipTrigger>
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>From origin to destination</p>
                    </TooltipContent>
                  </Tooltip>

                  {competencies[1] && (
                    <Card className="flex-1 rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                      <CardHeader className="p-0">
                        <div className="space-y-2">
                          <Badge variant="outline" className="w-fit rounded-md border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                            Destination
                          </Badge>
                          <CardTitle className="text-base font-semibold text-slate-900">
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
                  className="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                >
                  Undo{' '}
                  <Kbd className="ml-2 rounded border border-slate-300 bg-slate-200 px-1.5 py-0.5 text-xs text-slate-700">
                    ⌘
                  </Kbd>
                  <Kbd className="ml-1 rounded border border-slate-300 bg-slate-200 px-1.5 py-0.5 text-xs text-slate-700">
                    ⇧
                  </Kbd>
                  <Kbd className="ml-1 rounded border border-slate-300 bg-slate-200 px-1.5 py-0.5 text-xs text-slate-700">
                    Z
                  </Kbd>
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  className="rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  onClick={() => handleAction('skipped')}
                  disabled={isLoading}
                >
                  Skip{' '}
                  <Kbd className="ml-2 rounded border border-slate-300 bg-slate-200 px-1.5 py-0.5 text-xs text-slate-700">
                    Space
                  </Kbd>
                </Button>
                <Button
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700"
                  onClick={() => handleAction('completed')}
                  disabled={
                    isLoading ||
                    createRelationshipMutation.isPending ||
                    !user ||
                    !relation
                  }
                >
                  {createRelationshipMutation.isPending
                    ? 'Creating...'
                    : 'Add Relation'}{' '}
                  <Kbd className="ml-2 rounded border border-blue-400 bg-blue-500 px-1.5 py-0.5 text-xs text-white">
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

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff]">
          <div className="text-slate-500">Loading session...</div>
        </div>
      }
    >
      <SessionPageContent />
    </Suspense>
  );
}
