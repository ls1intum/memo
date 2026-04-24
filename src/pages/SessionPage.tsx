import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

import {
  getRandomCompetenciesAction,
  getNextRelationshipTaskAction,
  submitCompetencyVoteAction,
  unvoteAction,
  createCompetencyResourceLinkAction,
  deleteCompetencyResourceLinkAction,
  getRandomLearningResourceAction,
  getCurrentUserAction,
} from '@/lib/api/session-helpers';
import { contributorStatsApi } from '@/lib/api/contributor-stats';
import { getNewlyEarnedMilestones } from '@/lib/milestones';
import type { Competency, LearningResource } from '@/lib/api/types';
import {
  RelationshipType,
  ResourceMatchType,
} from '@/components/session/session-constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { ArrowRight, ArrowLeftRight, Check, Link2, LogOut } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { TypeSelectionButton } from '@/components/session/TypeSelectionButton';
import { SkeletonCard } from '@/components/session/SkeletonCard';
import { MappingCard } from '@/components/session/MappingCard';
import { useHoverWithTimeout } from '@/hooks/useHoverWithTimeout';
import {
  THEME_COLORS,
  RELATIONSHIP_TYPES,
  RELATIONSHIP_SELECTED_COLORS,
  RELATIONSHIP_UNSELECTED_COLORS,
  RELATIONSHIP_ICON_BG_COLORS,
  RELATIONSHIP_ICONS,
  RELATIONSHIP_TYPE_TEXT_COLORS,
  RESOURCE_MATCH_TYPES,
  RESOURCE_SELECTED_COLORS,
  RESOURCE_UNSELECTED_COLORS,
  RESOURCE_ICON_BG_COLORS,
  RESOURCE_ICONS,
  RESOURCE_MATCH_TYPE_TEXT_COLORS,
} from '@/components/session/session-constants';
import { SessionSummary } from '@/components/session/SessionSummary';

type SessionStats = {
  completed: number;
  skipped: number;
};

type MappingMode = 'competency' | 'resource';

const getRelationshipDescription = (
  type: RelationshipType,
  titleA: string,
  titleB: string
) => {
  switch (type) {
    case 'ASSUMES':
      return (
        <>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleA}
          </span>{' '}
          requires{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleB}
          </span>{' '}
          as prerequisite
        </>
      );
    case 'EXTENDS':
      return (
        <>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleA}
          </span>{' '}
          builds on / is a subset or advanced form of{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleB}
          </span>
        </>
      );
    case 'MATCHES':
      return (
        <>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleA}
          </span>{' '}
          is equivalent / strongly overlaps with{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleB}
          </span>
        </>
      );
    case 'UNRELATED':
      return (
        <>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleA}
          </span>{' '}
          and{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {titleB}
          </span>{' '}
          have no meaningful relationship
        </>
      );
    default:
      return '';
  }
};

export function SessionPage() {
  const [relation, setRelation] = useState<RelationshipType | null>(null);
  const [resourceMatchType, setResourceMatchType] =
    useState<ResourceMatchType | null>(null);
  const [stats, setStats] = useState<SessionStats>({
    completed: 0,
    skipped: 0,
  });
  const [history, setHistory] = useState<
    Array<{
      type: 'completed' | 'skipped';
      mode: MappingMode;
      relationshipId?: string;
      resourceLinkId?: string;
      competencies?: Competency[];
      learningResource?: LearningResource;
    }>
  >([]);
  const historyRef = useRef(history);
  historyRef.current = history;
  const [competencies, setCompetencies] = useState<Competency[] | null>(null);
  const [learningResource, setLearningResource] =
    useState<LearningResource | null>(null);
  const [mappingMode, setMappingMode] = useState<MappingMode>('competency');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swapRotation, setSwapRotation] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [currentRelationshipId, setCurrentRelationshipId] = useState<
    string | null
  >(null);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [initialTotalVotes, setInitialTotalVotes] = useState<number | null>(
    null
  );

  const {
    hoveredValue: hoveredRelation,
    handleMouseEnter: handleRelationMouseEnter,
    handleMouseLeave: handleRelationMouseLeave,
  } = useHoverWithTimeout<RelationshipType>();

  const {
    hoveredValue: hoveredResourceMatch,
    handleMouseEnter: handleResourceMatchMouseEnter,
    handleMouseLeave: handleResourceMatchMouseLeave,
  } = useHoverWithTimeout<ResourceMatchType>();

  const [relationshipToDelete, setRelationshipToDelete] = useState<
    string | null
  >(null);
  const [resourceLinkToDelete, setResourceLinkToDelete] = useState<
    string | null
  >(null);

  // Track which milestones have been shown
  const shownMilestonesRef = useRef<Set<string>>(new Set());

  // Check for newly earned milestones and celebrate
  const checkMilestones = useCallback(
    (newCompletedCount: number) => {
      if (initialTotalVotes === null) return;
      const oldTotal = initialTotalVotes + newCompletedCount - 1;
      const newTotal = initialTotalVotes + newCompletedCount;
      const newMilestones = getNewlyEarnedMilestones(oldTotal, newTotal);

      newMilestones.forEach(milestone => {
        // Skip if already shown
        if (shownMilestonesRef.current.has(milestone.id)) return;
        shownMilestonesRef.current.add(milestone.id);

        // Show toast with milestone info
        const Icon = milestone.icon;
        toast.success(
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${milestone.gradient}`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-base font-bold">{milestone.name}</div>
              <div className="text-sm opacity-80">{milestone.description}</div>
            </div>
          </div>,
          { duration: 2500 }
        );
      });
    },
    [initialTotalVotes]
  );

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const result = await getCurrentUserAction();
        if (result.success && result.user) {
          setUserId(result.user.id);
          // Fetch initial stats for milestone tracking
          try {
            const userStats = await contributorStatsApi.getStats(
              result.user.id
            );
            setInitialTotalVotes(userStats.totalVotes);
          } catch {
            setInitialTotalVotes(0);
          }
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

    void loadCurrentUser();
  }, []);

  const loadMappingPair = useCallback(
    async (isInitialLoad = false, currentSkipId?: string) => {
      setError(null);

      if (isInitialLoad) {
        setCompetencies(null);
        setLearningResource(null);
      } else {
        setIsTransitioning(true);
      }

      setRelation(null);
      setResourceMatchType(null);
      setIsSwapped(false);

      if (mappingMode === 'competency') {
        if (!userId) {
          setIsTransitioning(false);
          return;
        }

        const skippedIds = historyRef.current
          .filter(
            h =>
              h.type === 'skipped' &&
              h.mode === 'competency' &&
              h.competencies &&
              h.competencies.length === 2
          )
          .map(h => {
            if (h.relationshipId) return h.relationshipId;
            return `${h.competencies![0]!.id}:${h.competencies![1]!.id}`;
          });

        // Include the current skip ID if provided (handles async state update)
        if (currentSkipId && !skippedIds.includes(currentSkipId)) {
          skippedIds.push(currentSkipId);
        }

        const result = await getNextRelationshipTaskAction(userId, skippedIds);

        if (!result.success) {
          setError(
            result.error ??
              'An unexpected error occurred while fetching the next task.'
          );
          if (isInitialLoad) setCompetencies([]);
          setIsTransitioning(false);
          return;
        }

        if (result.allDone) {
          setAllDone(true);
          setCompetencies([]);
          setCurrentRelationshipId(null);
          setIsTransitioning(false);
          return;
        }

        if (!result.task) {
          if (isInitialLoad) setCompetencies([]);
          setIsTransitioning(false);
          return;
        }

        setAllDone(false);
        setCurrentRelationshipId(result.task.relationshipId);
        setCompetencies([
          {
            id: result.task.origin.id,
            title: result.task.origin.title,
            description: result.task.origin.description,
          },
          {
            id: result.task.destination.id,
            title: result.task.destination.title,
            description: result.task.destination.description,
          },
        ] as Competency[]);
        setLearningResource(null);
      } else {
        const [compResult, resourceResult] = await Promise.all([
          getRandomCompetenciesAction(1),
          getRandomLearningResourceAction(),
        ]);

        if (!compResult.success || !compResult.competencies?.length) {
          setError(
            compResult.error ??
              'Failed to fetch competency for resource mapping.'
          );
          if (isInitialLoad) setCompetencies([]);
          setIsTransitioning(false);
          return;
        }

        if (!resourceResult.success || !resourceResult.resource) {
          setError(
            resourceResult.error ??
              'Failed to fetch learning resource. Make sure resources are seeded.'
          );
          setCompetencies(compResult.competencies);
          setLearningResource(null);
          setIsTransitioning(false);
          return;
        }

        setCompetencies(compResult.competencies);
        setLearningResource(resourceResult.resource);
      }

      setIsTransitioning(false);
    },
    [mappingMode, userId]
  );

  const prevModeRef = useRef<MappingMode | null>(null);

  useEffect(() => {
    const isInitialLoad = prevModeRef.current === null;
    prevModeRef.current = mappingMode;
    void loadMappingPair(isInitialLoad);
  }, [mappingMode, loadMappingPair]);

  const handleContinueSession = useCallback(() => {
    setShowSessionSummary(false);
    setStats({ completed: 0, skipped: 0 });
    setHistory([]);
    void loadMappingPair(true);
  }, [loadMappingPair]);

  const handleAction = useCallback(
    async (type: 'completed' | 'skipped') => {
      if (type === 'completed') {
        if (mappingMode === 'competency') {
          if (
            !competencies ||
            competencies.length < 2 ||
            !relation ||
            !userId
          ) {
            setError('Missing required data to submit vote');
            return;
          }

          setIsCreating(true);
          setError(null);

          try {
            const startTime = Date.now();
            const voteOpts = isSwapped
              ? {
                  originId: competencies[0]!.id,
                  destinationId: competencies[1]!.id,
                }
              : {
                  relationshipId: currentRelationshipId ?? undefined,
                  originId: competencies[0]!.id,
                  destinationId: competencies[1]!.id,
                };
            const result = await submitCompetencyVoteAction(
              userId,
              relation,
              voteOpts
            );

            const elapsed = Date.now() - startTime;
            if (elapsed < 300) {
              await new Promise(resolve => setTimeout(resolve, 300 - elapsed));
            }

            if (!result.success) {
              setError(result.error ?? 'Failed to submit vote');
              setIsCreating(false);
              return;
            }

            setStats(prev => {
              const newCompleted = prev.completed + 1;
              // Call checkMilestones after state update (outside updater to avoid React Strict Mode double-call)
              setTimeout(() => checkMilestones(newCompleted), 0);
              return { ...prev, completed: newCompleted };
            });
            setHistory(prev => [
              ...prev,
              {
                type: 'completed',
                mode: 'competency',
                relationshipId:
                  result.voteResponse?.relationshipId ??
                  currentRelationshipId ??
                  undefined,
                competencies: competencies ? [...competencies] : undefined,
              },
            ]);
            await loadMappingPair();
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'An unexpected error occurred'
            );
          } finally {
            setIsCreating(false);
          }
        } else {
          if (
            !competencies?.length ||
            !learningResource ||
            !resourceMatchType ||
            !userId
          ) {
            setError('Missing required data to create resource link');
            return;
          }

          setIsCreating(true);
          setError(null);

          try {
            const formData = new FormData();
            formData.set('competencyId', competencies[0]!.id);
            formData.set('resourceId', learningResource.id);
            formData.set('userId', userId);
            formData.set('matchType', resourceMatchType);

            const startTime = Date.now();
            const result = await createCompetencyResourceLinkAction(formData);

            const elapsed = Date.now() - startTime;
            if (elapsed < 300) {
              await new Promise(resolve => setTimeout(resolve, 300 - elapsed));
            }

            if (!result.success) {
              setError(result.error ?? 'Failed to create resource link');
              setIsCreating(false);
              return;
            }

            setStats(prev => {
              const newCompleted = prev.completed + 1;
              // Call checkMilestones after state update (outside updater to avoid React Strict Mode double-call)
              setTimeout(() => checkMilestones(newCompleted), 0);
              return { ...prev, completed: newCompleted };
            });
            setHistory(prev => [
              ...prev,
              {
                type: 'completed',
                mode: 'resource',
                resourceLinkId: result.link?.id,
                competencies: competencies ? [...competencies] : undefined,
                learningResource: learningResource ?? undefined,
              },
            ]);
            await loadMappingPair();
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'An unexpected error occurred'
            );
          } finally {
            setIsCreating(false);
          }
        }
      } else if (type === 'skipped') {
        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Build the skip ID before updating history
        const currentSkipId =
          mappingMode === 'competency' && competencies?.length === 2
            ? (currentRelationshipId ??
              `${competencies[0]!.id}:${competencies[1]!.id}`)
            : undefined;

        setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
        setHistory(prev => [
          ...prev,
          {
            type: 'skipped',
            mode: mappingMode,
            relationshipId: currentRelationshipId ?? undefined,
            competencies: competencies ? [...competencies] : undefined,
            learningResource: learningResource ?? undefined,
          },
        ]);
        setRelation(null);
        try {
          // Pass the current skip ID directly to avoid stale closure issue
          await loadMappingPair(false, currentSkipId);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : 'An unexpected error occurred while fetching new items.'
          );
          setIsTransitioning(false);
        }
      }
    },
    [
      competencies,
      learningResource,
      relation,
      resourceMatchType,
      userId,
      mappingMode,
      loadMappingPair,
      currentRelationshipId,
      isSwapped,
      checkMilestones,
    ]
  );

  const handleUndo = useCallback(() => {
    const lastItem = history[history.length - 1];
    if (!lastItem) return;

    setIsTransitioning(true);

    setHistory(prev => {
      const updated = [...prev];
      const last = updated.pop();
      if (last) {
        setStats(prevStats => ({
          ...prevStats,
          [last.type]: Math.max(0, prevStats[last.type] - 1),
        }));

        if (last.type === 'completed') {
          if (last.mode === 'competency' && last.relationshipId) {
            setRelationshipToDelete(last.relationshipId);
          } else if (last.mode === 'resource' && last.resourceLinkId) {
            setResourceLinkToDelete(last.resourceLinkId);
          }
        }

        if (last.competencies?.length) {
          setCompetencies(last.competencies);
        }
        if (last.mode === 'resource') {
          if (last.learningResource) {
            setLearningResource(last.learningResource);
            setMappingMode('resource');
          } else {
            setLearningResource(null);
            setMappingMode('competency');
          }
        } else if (last.mode) {
          setMappingMode(last.mode);
        }
      }
      return updated;
    });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [history]);

  useEffect(() => {
    if (relationshipToDelete && userId) {
      unvoteAction(userId, relationshipToDelete)
        .then(result => {
          if (!result.success) {
            setError(result.error ?? 'Failed to undo vote');
          }
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Failed to undo vote');
        })
        .finally(() => {
          setRelationshipToDelete(null);
        });
    }
  }, [relationshipToDelete, userId]);

  useEffect(() => {
    if (resourceLinkToDelete) {
      deleteCompetencyResourceLinkAction(resourceLinkToDelete)
        .then(result => {
          if (!result.success) {
            setError(result.error ?? 'Failed to delete resource link');
          }
        })
        .catch(err => {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to delete resource link'
          );
        })
        .finally(() => {
          setResourceLinkToDelete(null);
        });
    }
  }, [resourceLinkToDelete]);

  const isLoading = competencies === null && !error;
  const noCompetencies = competencies !== null && competencies.length === 0;
  const notEnough =
    !isTransitioning &&
    (mappingMode === 'competency'
      ? !!competencies && competencies.length > 0 && competencies.length < 2
      : !!competencies && competencies.length > 0 && !learningResource);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

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

      if (
        event.key === ' ' &&
        !isLoading &&
        !isCreating &&
        competencies?.length
      ) {
        event.preventDefault();
        handleAction('skipped');
        return;
      }

      if (
        ['1', '2', '3', '4'].includes(event.key) &&
        !isLoading &&
        !isCreating
      ) {
        event.preventDefault();
        event.stopPropagation();
        const index = parseInt(event.key) - 1;

        if (mappingMode === 'competency' && RELATIONSHIP_TYPES[index]) {
          const selectedValue = RELATIONSHIP_TYPES[index]!.value;
          setRelation(prev => (prev === selectedValue ? null : selectedValue));
        } else if (mappingMode === 'resource' && RESOURCE_MATCH_TYPES[index]) {
          const selectedValue = RESOURCE_MATCH_TYPES[index]!.value;
          setResourceMatchType(prev =>
            prev === selectedValue ? null : selectedValue
          );
        }
        return;
      }

      if (
        event.key === 'Enter' &&
        !isLoading &&
        !isCreating &&
        userId &&
        competencies?.length
      ) {
        const hasSelection =
          mappingMode === 'competency'
            ? relation !== null
            : resourceMatchType !== null;

        if (hasSelection) {
          event.preventDefault();
          event.stopPropagation();
          handleAction('completed');
          return;
        }
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
    resourceMatchType,
    mappingMode,
    competencies,
    history,
    handleAction,
    handleUndo,
  ]);

  const renderKeyboardHint = () => (
    <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bold">
      Select a{' '}
      {mappingMode === 'competency' ? 'relationship type' : 'match quality'}{' '}
      below or press{' '}
      {['1', '2', '3', '4'].map(key => (
        <Kbd
          key={key}
          className="mr-1 border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
        >
          {key}
        </Kbd>
      ))}
    </p>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900 dark:from-[#0f1729] dark:via-[#111b30] dark:to-[#0f1729] dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 dark:bg-slate-800/30 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 dark:bg-[#7fb0ff]/10 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent dark:from-[#ffdff3]/10 dark:via-[#fff3f8]/5 blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl flex-col gap-6 px-6 pb-24 lg:mt-24 lg:px-0">
        <section className="space-y-6 rounded-[24px] border border-white/70 bg-white/85 dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)] px-10 py-6 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/50">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] text-white border-0 font-semibold text-xs px-4 py-1.5 shadow-md">
                Mapping Session
              </Badge>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>
                    Completed:{' '}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {stats.completed}
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => {
                    if (mappingMode !== 'competency') {
                      setMappingMode('competency');
                    }
                  }}
                  className={`
                    h-full px-3 text-xs font-semibold rounded-md transition-all duration-200 flex items-center justify-center
                    ${
                      mappingMode === 'competency'
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }
                  `}
                >
                  Competencies
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (mappingMode !== 'resource') {
                      setMappingMode('resource');
                    }
                  }}
                  className={`
                    h-full px-3 text-xs font-semibold rounded-md transition-all duration-200 flex items-center justify-center
                    ${
                      mappingMode === 'resource'
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }
                  `}
                >
                  Resources
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowSessionSummary(true)}
                className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-800/50"
              >
                <LogOut className="h-3.5 w-3.5" />
                End Session
              </button>
            </div>
          </div>

          {error && (
            <Card className="border border-red-100 bg-red-50/80 dark:border-red-800/50 dark:bg-red-900/30">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-300">
                  Failed to load competencies
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-400">
                  {error}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {allDone && !error && (
            <Card className="border border-emerald-200 bg-emerald-50/80 dark:border-emerald-700/50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="text-emerald-800 dark:text-emerald-300">
                  🎉 All done!
                </CardTitle>
                <CardDescription className="text-emerald-700 dark:text-emerald-400">
                  You've voted on every available competency pair. Great work!
                  Check back later when more competencies have been added.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {noCompetencies && !allDone && !error && (
            <Card className="border border-red-100 bg-red-50/80 dark:border-red-800/50 dark:bg-red-900/30">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-300">
                  No competencies available
                </CardTitle>
                <CardDescription className="text-red-700 dark:text-red-400">
                  There are currently no competencies in the database. Please
                  run the seed script or create competencies manually before
                  starting a mapping session.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {notEnough && !error && (
            <Card className="border border-amber-100 bg-amber-50/80 dark:border-amber-800/50 dark:bg-amber-900/30">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-300">
                  Not enough competencies
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-400">
                  At least two competencies are required to start a mapping
                  session. Please add more competencies first.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!error && !allDone && !noCompetencies && !notEnough && (
            <>
              <div className="flex flex-col items-center justify-center text-center space-y-2 mx-auto w-full">
                {isLoading || !competencies?.length ? (
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500 dark:text-slate-400">
                      {mappingMode === 'competency'
                        ? 'How does'
                        : 'How well does'}
                    </span>
                    <div className="h-7 w-40 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" />
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500 dark:text-slate-400">
                      {mappingMode === 'competency' ? 'relate to' : 'fit'}
                    </span>
                    <div className="h-7 w-36 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" />
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500 dark:text-slate-400">
                      ?
                    </span>
                  </div>
                ) : mappingMode === 'competency' && competencies.length >= 2 ? (
                  <h1 className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-800 dark:text-slate-200 leading-relaxed tracking-tight">
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
                ) : mappingMode === 'resource' && learningResource ? (
                  <h1 className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-800 dark:text-slate-200 leading-relaxed tracking-tight">
                    How well does{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary})`,
                      }}
                    >
                      {competencies[0]!.title}
                    </span>{' '}
                    match{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${THEME_COLORS.resource.primary}, ${THEME_COLORS.resource.secondary})`,
                      }}
                    >
                      {learningResource.title}
                    </span>
                    ?
                  </h1>
                ) : null}
              </div>

              <div className="py-3">
                <div
                  className="relative grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]"
                  style={{ isolation: 'isolate' }}
                >
                  {isLoading || !competencies || !competencies[0] ? (
                    <SkeletonCard />
                  ) : (
                    <MappingCard
                      type="competency"
                      title={competencies[0]!.title}
                      description={competencies[0]!.description}
                      themeColors={THEME_COLORS.source}
                      borderColorClass="border-[#0a4da2]/30"
                      gradientFromClass="from-blue-50/80 dark:from-blue-950/30"
                      isTransitioning={isTransitioning || isCreating}
                    />
                  )}

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
                          backgroundImage: `linear-gradient(to bottom right, ${THEME_COLORS.source.primary}, ${THEME_COLORS.source.secondary}, ${mappingMode === 'resource' ? THEME_COLORS.resource.primary : THEME_COLORS.destination.primary})`,
                        }}
                      >
                        {mappingMode === 'resource' ? (
                          <Link2
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowRight
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div
                        className="h-0.5 w-12"
                        style={{
                          backgroundImage: `linear-gradient(to left, ${mappingMode === 'resource' ? THEME_COLORS.resource.primary : THEME_COLORS.destination.primary}, ${mappingMode === 'resource' ? THEME_COLORS.resource.secondary : THEME_COLORS.destination.secondary})`,
                        }}
                      />
                    </div>
                    {mappingMode === 'competency' &&
                      competencies &&
                      competencies.length >= 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSwapRotation(prev => prev + 180);
                            setIsSwapped(prev => !prev);
                            setIsTransitioning(true);
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
                          className="text-slate-700 border border-slate-300 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 dark:text-slate-300 dark:border-slate-600 dark:hover:text-slate-100 dark:hover:bg-slate-700 dark:hover:border-slate-500 focus:outline-none focus:ring-0 focus-visible:ring-0"
                        >
                          <ArrowLeftRight
                            className="h-4 w-4 mr-1.5 transition-transform duration-500 will-change-transform"
                            style={{ transform: `rotate(${swapRotation}deg)` }}
                          />
                          Swap Direction
                        </Button>
                      )}
                  </div>

                  {isLoading ? (
                    <SkeletonCard />
                  ) : mappingMode === 'competency' &&
                    competencies &&
                    competencies[1] ? (
                    <MappingCard
                      type="competency"
                      title={competencies[1]!.title}
                      description={competencies[1]!.description}
                      themeColors={THEME_COLORS.destination}
                      borderColorClass="border-[#9775fa]/30"
                      gradientFromClass="from-purple-50/80 dark:from-purple-950/30"
                      isTransitioning={isTransitioning || isCreating}
                    />
                  ) : mappingMode === 'resource' && learningResource ? (
                    <MappingCard
                      type="resource"
                      title={learningResource.title}
                      url={learningResource.url}
                      themeColors={THEME_COLORS.resource}
                      borderColorClass="border-pink-400/30"
                      gradientFromClass="from-pink-50/80 dark:from-pink-950/30"
                      isTransitioning={isTransitioning || isCreating}
                    />
                  ) : null}
                </div>
              </div>

              <div className="mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-700/50 p-5 shadow-sm space-y-5">
                {mappingMode === 'competency' &&
                  competencies &&
                  competencies.length >= 2 && (
                    <div className="rounded-xl bg-gradient-to-r from-blue-50/90 via-purple-50/70 to-blue-50/90 border border-blue-200/50 dark:from-blue-950/50 dark:via-purple-950/30 dark:to-blue-950/50 dark:border-blue-800/30 py-4 px-5 text-center">
                      {hoveredRelation ? (
                        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bold animate-in fade-in duration-200">
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
                        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bold">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {competencies[0]!.title}
                          </span>{' '}
                          <span
                            className={`font-bold ${RELATIONSHIP_TYPE_TEXT_COLORS[relation] || 'text-slate-600 dark:text-slate-400'}`}
                          >
                            {relation === 'UNRELATED'
                              ? 'is unrelated to'
                              : RELATIONSHIP_TYPES.find(
                                  rt => rt.value === relation
                                )?.label.toLowerCase() || ''}
                          </span>{' '}
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {competencies[1]!.title}
                          </span>
                        </p>
                      ) : (
                        renderKeyboardHint()
                      )}
                    </div>
                  )}

                {mappingMode === 'resource' &&
                  competencies?.length &&
                  learningResource && (
                    <div className="rounded-xl border border-pink-200/50 bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-pink-50/90 py-4 px-5 text-center dark:border-pink-800/30 dark:from-pink-950/50 dark:via-rose-950/30 dark:to-pink-950/50">
                      {hoveredResourceMatch ? (
                        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bold animate-in fade-in duration-200">
                          <span
                            className={`font-bold ${RESOURCE_MATCH_TYPE_TEXT_COLORS[hoveredResourceMatch]}`}
                          >
                            {
                              RESOURCE_MATCH_TYPES.find(
                                rt => rt.value === hoveredResourceMatch
                              )?.label
                            }
                            :
                          </span>{' '}
                          {
                            RESOURCE_MATCH_TYPES.find(
                              rt => rt.value === hoveredResourceMatch
                            )?.description
                          }
                        </p>
                      ) : resourceMatchType ? (
                        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bold">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {competencies[0]!.title}
                          </span>{' '}
                          <span
                            className={`font-bold ${RESOURCE_MATCH_TYPE_TEXT_COLORS[resourceMatchType]}`}
                          >
                            {resourceMatchType === 'UNRELATED'
                              ? 'is unrelated to'
                              : resourceMatchType === 'WEAK'
                                ? 'has weak relation to'
                                : resourceMatchType === 'GOOD_FIT'
                                  ? 'is a good fit for'
                                  : 'is a perfect match for'}
                          </span>{' '}
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {learningResource.title}
                          </span>
                        </p>
                      ) : (
                        renderKeyboardHint()
                      )}
                    </div>
                  )}

                {mappingMode === 'competency' &&
                  RELATIONSHIP_TYPES.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                      {RELATIONSHIP_TYPES.map(({ value, label }, index) => {
                        const isSelected = relation === value;
                        const IconComponent = RELATIONSHIP_ICONS[value];
                        const iconBgColors = RELATIONSHIP_ICON_BG_COLORS[value];

                        return (
                          <TypeSelectionButton
                            key={value}
                            value={value}
                            label={label}
                            isSelected={isSelected}
                            shortcutKey={(index + 1).toString()}
                            icon={<IconComponent className="h-4 w-4" />}
                            selectedClass={RELATIONSHIP_SELECTED_COLORS[value]}
                            unselectedClass={
                              RELATIONSHIP_UNSELECTED_COLORS[value]
                            }
                            iconBgClass={
                              isSelected
                                ? iconBgColors.selected
                                : iconBgColors.unselected
                            }
                            focusRingColor="focus-visible:ring-blue-500"
                            onSelect={setRelation}
                            onHoverEnter={handleRelationMouseEnter}
                            onHoverLeave={handleRelationMouseLeave}
                          />
                        );
                      })}
                    </div>
                  )}

                {mappingMode === 'resource' &&
                  RESOURCE_MATCH_TYPES.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                      {RESOURCE_MATCH_TYPES.map(({ value, label }, index) => {
                        const isSelected = resourceMatchType === value;
                        const IconComponent = RESOURCE_ICONS[value];
                        const iconBgColors = RESOURCE_ICON_BG_COLORS[value];

                        return (
                          <TypeSelectionButton
                            key={value}
                            value={value}
                            label={label}
                            isSelected={isSelected}
                            shortcutKey={(index + 1).toString()}
                            icon={<IconComponent className="h-4 w-4" />}
                            selectedClass={RESOURCE_SELECTED_COLORS[value]}
                            unselectedClass={RESOURCE_UNSELECTED_COLORS[value]}
                            iconBgClass={
                              isSelected
                                ? iconBgColors.selected
                                : iconBgColors.unselected
                            }
                            focusRingColor="focus-visible:ring-teal-500"
                            onSelect={setResourceMatchType}
                            onHoverEnter={handleResourceMatchMouseEnter}
                            onHoverLeave={handleResourceMatchMouseLeave}
                          />
                        );
                      })}
                    </div>
                  )}
              </div>

              <div className="mx-auto mt-8 max-w-5xl border-t border-slate-200/40 pt-6 dark:border-slate-700/40">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      <span className="mr-1">Undo</span>
                      <Kbd className="border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        ⇧
                      </Kbd>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        +
                      </span>
                      <Kbd className="border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Z
                      </Kbd>
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAction('skipped')}
                      disabled={isLoading || isCreating}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    >
                      Skip
                      <Kbd className="border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Space
                      </Kbd>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction('completed')}
                      disabled={
                        isLoading ||
                        isCreating ||
                        !userId ||
                        (mappingMode === 'competency'
                          ? !relation
                          : !resourceMatchType)
                      }
                      className={`
                        relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white
                        min-w-[180px]
                        ${
                          mappingMode === 'resource'
                            ? 'bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 dark:shadow-pink-950/40 dark:hover:shadow-pink-950/50'
                            : 'bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                        }
                        transition-all duration-200 ease-out
                        hover:scale-[1.02]
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
                          {mappingMode === 'resource'
                            ? 'Add Link'
                            : 'Add Relation'}
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

      {/* ─── Session Summary Overlay ─── */}
      {showSessionSummary && (
        <SessionSummary stats={stats} onContinue={handleContinueSession} />
      )}
    </div>
  );
}
