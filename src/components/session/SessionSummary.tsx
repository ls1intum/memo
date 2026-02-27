import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SessionStats {
  completed: number;
  skipped: number;
}

interface SessionSummaryProps {
  stats: SessionStats;
  onContinue: () => void;
}

export function SessionSummary({ stats, onContinue }: SessionSummaryProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-summary-heading"
        tabIndex={-1}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl p-8 animate-in zoom-in-95 duration-300 focus:outline-none"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#7c6cff]/20 blur-[60px]" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-[#0a4da2]/15 blur-[50px]" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl">🧠</div>
            <h2
              id="session-summary-heading"
              className="text-2xl font-bold text-slate-900"
            >
              Session Complete
            </h2>
            <p className="text-sm text-slate-500">
              Great work! Here's what you accomplished.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">
                {stats.completed}
              </p>
              <p className="text-xs font-semibold text-emerald-600 mt-1">
                Mappings
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-2xl font-bold text-slate-700">
                {stats.skipped}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Skipped
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="h-12 w-full rounded-full bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] text-base font-semibold text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:-translate-y-0.5"
              asChild
            >
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <button
              type="button"
              onClick={onContinue}
              className="h-12 w-full rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Continue Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
