import type { ReactNode } from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface SignalRowProps {
  label: string;
  value: number;
}

function SignalRow({ label, value }: SignalRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-700/40 dark:bg-slate-600/40">
        <div
          className="h-full rounded-full bg-slate-300 dark:bg-slate-400"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="w-10 text-right tabular-nums text-slate-300 dark:text-slate-400">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

interface ConfidenceBreakdownTooltipProps {
  children: ReactNode;
  voteSignal: number;
  consensusSignal: number;
  resourceSignal: number;
  metadataSignal: number;
}

export function ConfidenceBreakdownTooltip({
  children,
  voteSignal,
  consensusSignal,
  resourceSignal,
  metadataSignal,
}: ConfidenceBreakdownTooltipProps) {
  return (
    <Tooltip delayDuration={200} side="top">
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="w-56 space-y-2 p-3">
        <p className="mb-2 text-xs font-semibold text-white">
          Signal Breakdown
        </p>
        <SignalRow label="Votes" value={voteSignal} />
        <SignalRow label="Consensus" value={consensusSignal} />
        <SignalRow label="Resources" value={resourceSignal} />
        <SignalRow label="Metadata" value={metadataSignal} />
      </TooltipContent>
    </Tooltip>
  );
}
