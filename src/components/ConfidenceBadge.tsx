import type { ConfidenceTier } from '@/lib/api/types';

const tierStyles: Record<ConfidenceTier, string> = {
  HIGH: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  MEDIUM:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  LOW: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface ConfidenceBadgeProps {
  score: number;
  tier: ConfidenceTier;
}

export function ConfidenceBadge({ score, tier }: ConfidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tierStyles[tier]}`}
    >
      {tier} · {score.toFixed(2)}
    </span>
  );
}
