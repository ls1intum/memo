import { useMemo, useRef, useEffect } from 'react';
import type { DailyCount } from '@/lib/api/contributor-stats';
import { heatmapColor } from '@/lib/heatmap-helpers';

/* ───────────────────────── Helpers ───────────────────────── */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_LABELS = ['Mon', '', '', 'Thu', '', '', 'Sun'];

function buildGrid(dailyCounts: DailyCount[]) {
  const map = new Map<string, number>();
  for (const dc of dailyCounts) map.set(dc.date, dc.count);

  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const totalDays = 52 * 7 + todayIdx + 1;
  const start = new Date(today);
  start.setDate(start.getDate() - totalDays + 1);

  const weeks: { date: Date; count: number }[][] = [];
  let week: { date: Date; count: number }[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    week.push({ date: d, count: map.get(d.toISOString().split('T')[0]!) ?? 0 });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
}

/* ───────────────────────── Component ───────────────────────── */

export function ContributionHeatmap({
  dailyCounts,
}: {
  dailyCounts: DailyCount[];
}) {
  const weeks = useMemo(() => buildGrid(dailyCounts), [dailyCounts]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  return (
    <div className="flex gap-2 w-full">
      <div className="flex flex-col pt-[22px] shrink-0" style={{ gap: 3 }}>
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            className="flex items-center justify-end"
            style={{ height: 18 }}
          >
            <span className="text-[9px] font-semibold text-slate-400 leading-none">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 min-w-0 overflow-x-auto pb-1">
        <div className="min-w-max">
          <div className="flex mb-1 h-[14px]" style={{ gap: 3 }}>
            {weeks.map((week, i) => {
              const m = week[0].date.getMonth();
              const prev = i > 0 ? weeks[i - 1][0].date.getMonth() : -1;
              return (
                <div
                  key={i}
                  className="shrink-0 relative overflow-visible"
                  style={{ width: 18 }}
                >
                  {m !== prev && (
                    <span className="absolute bottom-0 left-0 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                      {MONTHS[m]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex" style={{ gap: 3 }}>
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="flex flex-col shrink-0"
                style={{ gap: 3 }}
              >
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`rounded-[2px] transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-slate-400 hover:z-10 ${heatmapColor(day.count)}`}
                    style={{ width: 18, height: 18 }}
                    title={`${day.date.toLocaleDateString()}: ${day.count} mapping${day.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
