'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRandomCompetenciesAction } from '@/app/actions/competencies';
import {
  createCompetencyRelationshipAction,
  deleteCompetencyRelationshipAction,
} from '@/app/actions/competency_relationships';
import {
  createCompetencyResourceLinkAction,
  deleteCompetencyResourceLinkAction,
} from '@/app/actions/competency_resource_links';
import { getRandomLearningResourceAction } from '@/app/actions/learning_resources';
import { getOrCreateDemoUserAction } from '@/app/actions/users';
import type {
  Competency,
  LearningResource,
} from '@/domain_core/model/domain_model';
import {
  RelationshipType,
  ResourceMatchType,
} from '@/domain_core/model/domain_model';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Kbd } from '@/components/ui/kbd';
import { ArrowRight, ArrowLeftRight, Check, Link2 } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Session-specific components and constants
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

type SessionStats = {
  completed: number;
  skipped: number;
};

type MappingMode = 'competency' | 'resource';

// Helper to get dynamic description for relationship types
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
  const [competencies, setCompetencies] = useState<Competency[] | null>(null);
  const [learningResource, setLearningResource] =
    useState<LearningResource | null>(null);
  const [mappingMode, setMappingMode] = useState<MappingMode>('competency');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swapRotation, setSwapRotation] = useState(0);

  // Use custom hover hook for both types
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

  const loadMappingPair = useCallback(
    async (isInitialLoad = false) => {
      setError(null);

      if (isInitialLoad) {
        setCompetencies(null);
        setLearningResource(null);
      } else {
        setIsTransitioning(true);
      }

      setRelation(null);
      setResourceMatchType(null);

      if (mappingMode === 'competency') {
        const result = await getRandomCompetenciesAction(count);

        if (!result.success) {
          setError(
            result.error ??
            'An unexpected error occurred while fetching competencies.'
          );
          if (isInitialLoad) setCompetencies([]);
          setIsTransitioning(false);
          return;
        }

        if (!result.competencies || result.competencies.length === 0) {
          if (isInitialLoad) setCompetencies([]);
          setIsTransitioning(false);
          return;
        }

        if (
          result.competencies.length >= 2 &&
          result.competencies[0]!.id === result.competencies[1]!.id
        ) {
          await loadMappingPair(isInitialLoad);
          return;
        }

        setCompetencies(result.competencies);
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
    [count, mappingMode]
  );

  const prevModeRef = useRef<MappingMode | null>(null);

  useEffect(() => {
    const isInitialLoad = prevModeRef.current === null;
    prevModeRef.current = mappingMode;
    void loadMappingPair(isInitialLoad);
  }, [mappingMode, loadMappingPair]);

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

            const startTime = Date.now();
            const result = await createCompetencyRelationshipAction(formData);

            const elapsed = Date.now() - startTime;
            if (elapsed < 300) {
              await new Promise(resolve => setTimeout(resolve, 300 - elapsed));
            }

            if (!result.success) {
              setError(result.error ?? 'Failed to create relationship');
              setIsCreating(false);
              return;
            }

            setStats(prev => ({ ...prev, completed: prev.completed + 1 }));
            setHistory(prev => [
              ...prev,
              {
                type: 'completed',
                mode: 'competency',
                relationshipId: result.relationship?.id,
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

            setStats(prev => ({ ...prev, completed: prev.completed + 1 }));
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

        setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
        setHistory(prev => [
          ...prev,
          {
            type: 'skipped',
            mode: mappingMode,
            competencies: competencies ? [...competencies] : undefined,
            learningResource: learningResource ?? undefined,
          },
        ]);
        setRelation(null); // Reset relationship type selection
        try {
          await loadMappingPair();
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
    ]
  );

  const handleUndo = useCallback(() => {
    const lastItem = history[history.length - 1];
    if (!lastItem) return;

    // Execute state restoration immediately
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
            // Edge case: resource mode without a learningResource in history.
            setLearningResource(null);
            setMappingMode('competency');
          }
        } else if (last.mode) {
          setMappingMode(last.mode);
        }
      }
      return updated;
    });

    // Only delay the visual transition completion
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [history]);

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

  // Keyboard shortcuts
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

  // Helper to render keyboard shortcut hint
  const renderKeyboardHint = () => (
    <p className="text-base text-slate-800 leading-relaxed font-bold">
      Select a{' '}
      {mappingMode === 'competency' ? 'relationship type' : 'match quality'}{' '}
      below or press{' '}
      {['1', '2', '3', '4'].map(key => (
        <Kbd
          key={key}
          className="bg-white text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-1 mr-1"
        >
          {key}
        </Kbd>
      ))}
    </p>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 flex w-full max-w-6xl flex-col gap-6 px-6 pb-24 lg:mt-24 lg:px-0">
        <section className="space-y-6 rounded-[24px] border border-white/70 bg-white/85 px-10 py-6 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60">
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
            {/* Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => {
                  if (mappingMode !== 'competency') {
                    setMappingMode('competency');
                  }
                }}
                className={`
                  px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                  ${mappingMode === 'competency'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
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
                  px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                  ${mappingMode === 'resource'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                `}
              >
                Resources
              </button>
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
                {isLoading || !competencies?.length ? (
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500">
                      {mappingMode === 'competency'
                        ? 'How does'
                        : 'How well does'}
                    </span>
                    <div className="h-7 w-40 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500">
                      {mappingMode === 'competency' ? 'relate to' : 'fit'}
                    </span>
                    <div className="h-7 w-36 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    <span className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-500">
                      ?
                    </span>
                  </div>
                ) : mappingMode === 'competency' && competencies.length >= 2 ? (
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
                ) : mappingMode === 'resource' && learningResource ? (
                  <h1 className="text-[1.35rem] sm:text-[1.7rem] font-bold text-slate-800 leading-relaxed tracking-tight">
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

              {/* Cards Grid */}
              <div className="py-3">
                <div
                  className="relative grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]"
                  style={{ isolation: 'isolate' }}
                >
                  {/* Origin Competency Card */}
                  {isLoading || !competencies || !competencies[0] ? (
                    <SkeletonCard />
                  ) : (
                    <MappingCard
                      type="competency"
                      title={competencies[0]!.title}
                      description={competencies[0]!.description}
                      themeColors={THEME_COLORS.source}
                      borderColorClass="border-[#0a4da2]/30"
                      gradientFromClass="from-blue-50/80"
                      isTransitioning={isTransitioning || isCreating}
                    />
                  )}

                  {/* Arrow Connection with Swap Button */}
                  <div className="flex flex-col items-center justify-center z-10 px-3 gap-2">
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

                  {/* Destination Card */}
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
                      gradientFromClass="from-purple-50/80"
                      isTransitioning={isTransitioning || isCreating}
                    />
                  ) : mappingMode === 'resource' && learningResource ? (
                    <MappingCard
                      type="resource"
                      title={learningResource.title}
                      url={learningResource.url}
                      themeColors={THEME_COLORS.resource}
                      borderColorClass="border-pink-400/30"
                      gradientFromClass="from-pink-50/80"
                      isTransitioning={isTransitioning || isCreating}
                    />
                  ) : null}
                </div>
              </div>

              {/* Combined Selection Section */}
              <div className="mx-auto rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
                {/* Live Preview Sentence - Competency Mode */}
                {mappingMode === 'competency' &&
                  competencies &&
                  competencies.length >= 2 && (
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
                        renderKeyboardHint()
                      )}
                    </div>
                  )}

                {/* Live Preview Sentence - Resource Mode */}
                {mappingMode === 'resource' &&
                  competencies?.length &&
                  learningResource && (
                    <div className="rounded-xl bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-pink-50/90 border border-pink-200/50 py-4 px-5 text-center">
                      {hoveredResourceMatch ? (
                        <p className="text-base text-slate-800 leading-relaxed font-bold animate-in fade-in duration-200">
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
                        <p className="text-base text-slate-800 leading-relaxed font-bold">
                          <span className="font-bold text-slate-900">
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
                          <span className="font-bold text-slate-900">
                            {learningResource.title}
                          </span>
                        </p>
                      ) : (
                        renderKeyboardHint()
                      )}
                    </div>
                  )}

                {/* Relationship Type Buttons (Competency Mode) */}
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

                {/* Resource Match Quality Buttons (Resource Mode) */}
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

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-200/40 mx-auto max-w-5xl">
                <div className="flex items-center justify-between">
                  {/* Left: Undo */}
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 border border-slate-300 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
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
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 border border-slate-300 rounded-lg transition-all duration-200 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Skip
                      <Kbd className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-1.5 py-0.5">
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
                        ${mappingMode === 'resource'
                          ? 'bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30'
                          : 'bg-gradient-to-r from-[#0a4da2] to-[#5538d1] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
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
