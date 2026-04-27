import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { ConfidenceBreakdownTooltip } from '@/components/ConfidenceBreakdownTooltip';
import { confidenceApi } from '@/lib/api/confidence';
import type { ConfidenceTier } from '@/lib/api/types';

type TierFilter = 'ALL' | ConfidenceTier;

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ConfidencePage() {
  const [tierFilter, setTierFilter] = useState<TierFilter>('ALL');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['confidence'],
    queryFn: confidenceApi.getAll,
  });

  const recomputeAll = useMutation({
    mutationFn: confidenceApi.recomputeAll,
    onSuccess: result => {
      toast.success(result.message || 'Recompute complete');
      queryClient.invalidateQueries({ queryKey: ['confidence'] });
    },
    onError: () => toast.error('Failed to recompute confidence ratings'),
  });

  const tierFilters: TierFilter[] = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

  const filtered = (data ?? []).filter(
    r => tierFilter === 'ALL' || r.confidenceTier === tierFilter
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900 dark:from-[#0f1729] dark:via-[#111b30] dark:to-[#0f1729] dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 -top-24 h-144 w-xl -translate-x-1/2 rounded-full bg-white/80 blur-[140px] dark:bg-slate-800/30" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px] dark:bg-[#7fb0ff]/10" />
        <div className="absolute right-[14%] top-[28%] h-88 w-88 rounded-[40%] bg-linear-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px] dark:from-[#ffdff3]/10 dark:via-[#fff3f8]/5" />
      </div>

      <main className="relative z-10 mx-auto mt-20 w-full max-w-5xl px-6 pb-24 lg:mt-24 lg:px-0">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/admin"
            className="flex items-center gap-1 transition hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Confidence Ratings
          </span>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Confidence Ratings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Reliability scores for competency entries.
            </p>
          </div>
          <Button
            onClick={() => recomputeAll.mutate()}
            disabled={recomputeAll.isPending}
            className="flex items-center gap-2 rounded-full bg-[#0a4da2] px-5 text-white shadow-md hover:bg-[#083d80]"
          >
            <RefreshCw
              className={`h-4 w-4 ${recomputeAll.isPending ? 'animate-spin' : ''}`}
            />
            {recomputeAll.isPending ? 'Recomputing…' : 'Recompute All'}
          </Button>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60">
          <div className="mb-6 flex flex-wrap gap-2">
            {tierFilters.map(f => (
              <button
                key={f}
                onClick={() => setTierFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  tierFilter === f
                    ? 'bg-[#0a4da2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading && (
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Loading…
            </p>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-sm italic text-slate-400 dark:text-slate-500">
              No results.
            </p>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-64">
                      Title
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-44">
                      Confidence (%)
                    </th>
                    <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
                      Votes
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell w-28">
                      Computed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filtered.map(r => (
                    <tr
                      key={r.competencyId}
                      className="group align-middle hover:bg-slate-50/60 transition-colors dark:hover:bg-slate-700/30"
                    >
                      <td className="py-3 pr-6 font-medium text-slate-900 dark:text-slate-100">
                        {r.competencyTitle}
                      </td>
                      <td className="py-3 pr-6">
                        <ConfidenceBreakdownTooltip
                          voteSignal={r.voteSignal}
                          consensusSignal={r.consensusSignal}
                          resourceSignal={r.resourceSignal}
                          metadataSignal={r.metadataSignal}
                        >
                          <ConfidenceBadge
                            score={r.confidenceScore}
                            tier={r.confidenceTier}
                          />
                        </ConfidenceBreakdownTooltip>
                      </td>
                      <td className="py-3 pr-6 text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          {r.totalVotes}
                        </span>
                      </td>
                      <td className="py-3 pr-6 text-xs text-slate-400 hidden lg:table-cell whitespace-nowrap dark:text-slate-500">
                        {formatDate(r.computedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
