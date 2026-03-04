import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  contributorStatsApi,
  type ContributorStats,
} from '@/lib/api/contributor-stats';
import {
  Flame,
  Trophy,
  Zap,
  Mountain,
  Target,
  Award,
  Star,
} from 'lucide-react';
import { ContributionHeatmap } from '@/components/dashboard/ContributionHeatmap';
import { heatmapColor } from '@/lib/heatmap-helpers';
import { useAuth } from '@/contexts/AuthContext';

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'first-steps',
    name: 'The First Node',
    description: '1+ mapping',
    icon: Star,
    gradient: 'from-emerald-400 to-teal-500',
    glowColor: 'rgba(16,185,129,0.35)',
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: '10+ mappings',
    icon: Target,
    gradient: 'from-blue-400 to-indigo-500',
    glowColor: 'rgba(99,102,241,0.35)',
  },
  {
    id: 'half-century',
    name: 'Half Century',
    description: '50+ mappings',
    icon: Award,
    gradient: 'from-violet-400 to-purple-600',
    glowColor: 'rgba(139,92,246,0.35)',
  },
  {
    id: 'century',
    name: 'Century',
    description: '100+ mappings',
    icon: Trophy,
    gradient: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'streak-3',
    name: 'On Fire',
    description: '3-day streak',
    icon: Flame,
    gradient: 'from-orange-400 to-red-500',
    glowColor: 'rgba(239,68,68,0.35)',
  },
  {
    id: 'streak-7',
    name: 'Dedicated',
    description: '7-day streak',
    icon: Zap,
    gradient: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'streak-30',
    name: 'Monthly Mapper',
    description: '30-day streak',
    icon: Mountain,
    gradient: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6,182,212,0.35)',
  },
];

function BadgeCard({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  const Icon = badge.icon;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300 ${
        earned
          ? 'border-white/80 bg-white/90 shadow-[0_16px_50px_-16px_rgba(7,30,84,0.4)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(7,30,84,0.5)]'
          : 'border-slate-200/80 bg-slate-50/50 opacity-50 grayscale'
      }`}
    >
      {earned && (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-[50px]"
          style={{ background: badge.glowColor }}
        />
      )}
      <div className="relative z-10 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badge.gradient} shadow-md`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{badge.name}</h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{badge.description}</p>
        </div>
      </div>
      {earned && (
        <div className="absolute right-3 top-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accentColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_50px_-20px_rgba(7,30,84,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(7,30,84,0.4)]">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-[40px]"
        style={{ background: accentColor }}
      />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 text-slate-500">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wider">
            {label}
          </span>
        </div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { userId } = useAuth();
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    async function loadStats() {
      try {
        setLoading(true);
        const data = await contributorStatsApi.getStats(userId!);
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load stats. Is the server running?'
        );
      } finally {
        setLoading(false);
      }
    }
    void loadStats();
  }, [userId]);

  const earnedSet = useMemo(
    () => new Set(stats?.earnedBadges ?? []),
    [stats?.earnedBadges]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-col gap-8 px-6 pb-24 lg:mt-24 lg:px-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Your Dashboard
            </h1>
            <p className="text-base text-slate-600">
              Track your contributions and unlock milestones.
            </p>
          </div>
          <Button
            className="h-12 rounded-full bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] px-7 text-base font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-30px_rgba(7,30,84,0.6)]"
            asChild
          >
            <Link to="/session">Start Mapping Session</Link>
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-6 py-5 text-red-800 shadow-sm">
            <p className="font-semibold">Failed to load statistics</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-white/60"
              />
            ))}
          </div>
        )}

        {stats && !loading && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <StatCard
                  label="Total Mappings"
                  value={stats.totalVotes}
                  icon={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                  accentColor="rgba(99,102,241,0.3)"
                />
                <StatCard
                  label="Streak · Current / Longest"
                  value={`🔥 ${stats.currentStreak > 0 ? `${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}` : '—'} / ${stats.longestStreak > 0 ? `${stats.longestStreak} day${stats.longestStreak !== 1 ? 's' : ''}` : '—'}`}
                  icon={<Flame className="h-4 w-4" />}
                  accentColor="rgba(239,68,68,0.25)"
                />
              </div>

              <section className="flex flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/85 px-8 py-4 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">
                    Contribution Activity
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Less</span>
                    {[0, 2, 5, 10, 15].map(level => (
                      <div
                        key={level}
                        className={`rounded-[3px] ${heatmapColor(level)}`}
                        style={{ width: 12, height: 12 }}
                      />
                    ))}
                    <span className="text-xs text-slate-400">More</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center min-h-0">
                  <ContributionHeatmap dailyCounts={stats.dailyCounts} />
                </div>
              </section>
            </div>

            <section className="rounded-[24px] border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  Milestone Badges
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {earnedSet.size} / {BADGE_DEFS.length} earned
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {BADGE_DEFS.map(badge => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={earnedSet.has(badge.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
