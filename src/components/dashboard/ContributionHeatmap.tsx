import { useMemo, useRef, useEffect } from 'react';
import type { DailyCount } from '@/lib/api/contributor-stats';
import { heatmapColor } from '@/lib/heatmap-helpers';

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
const WEEKS_PER_COLUMN = 4;
const SQUARE_SIZE = 26;
const DEFAULT_HISTORY_DAYS = 365;
const MAX_HISTORY_DAYS = 3 * 366;
const LOCAL_DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type HeatmapWeek = {
  date: Date;
  count: number;
};

function formatDateKeyUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKeyUTC(dateKey: string): Date | null {
  if (!LOCAL_DATE_KEY_PATTERN.test(dateKey)) {
    return null;
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return formatDateKeyUTC(parsed) === dateKey ? parsed : null;
}

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

function addDaysUTC(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function startOfIsoWeekUTC(date: Date): Date {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  return addDaysUTC(date, -daysSinceMonday);
}

function endOfIsoWeekUTC(date: Date): Date {
  return addDaysUTC(startOfIsoWeekUTC(date), 6);
}

// calculate the grid data for the heatmap
function buildGrid(dailyCounts: DailyCount[]) {
  const countByDate = new Map<string, number>();
  let earliestDataDate: Date | null = null;
  const today = startOfTodayUTC();

  for (const dc of dailyCounts) {
    const parsedDate = parseDateKeyUTC(dc.date);
    if (!parsedDate || parsedDate > today) {
      continue;
    }

    const dateKey = formatDateKeyUTC(parsedDate);
    countByDate.set(dateKey, (countByDate.get(dateKey) ?? 0) + dc.count);
    if (!earliestDataDate || parsedDate < earliestDataDate) {
      earliestDataDate = parsedDate;
    }
  }

  const defaultRangeStart = addDaysUTC(today, -DEFAULT_HISTORY_DAYS);
  const oldestAllowedStart = addDaysUTC(today, -MAX_HISTORY_DAYS);
  const rawRangeStart =
    earliestDataDate && earliestDataDate < defaultRangeStart
      ? earliestDataDate
      : defaultRangeStart;
  const rangeStart =
    rawRangeStart < oldestAllowedStart ? oldestAllowedStart : rawRangeStart;
  const startDate = startOfIsoWeekUTC(rangeStart);
  const endDate = endOfIsoWeekUTC(today);

  const columns: HeatmapWeek[][] = [];
  let currentColumn: HeatmapWeek[] = [];

  for (
    let currentWeekStart = startDate;
    currentWeekStart <= endDate;
    currentWeekStart = addDaysUTC(currentWeekStart, 7)
  ) {
    let weeklyCount = 0;

    // add up all the days in the week
    for (let d = 0; d < 7; d++) {
      const day = addDaysUTC(currentWeekStart, d);
      const dateString = formatDateKeyUTC(day);
      weeklyCount += countByDate.get(dateString) ?? 0;
    }

    currentColumn.push({
      date: new Date(currentWeekStart),
      count: weeklyCount,
    });

    // group by 4 weeks into columns
    if (currentColumn.length === WEEKS_PER_COLUMN) {
      columns.push(currentColumn);
      currentColumn = [];
    }
  }

  // add whatever is left
  if (currentColumn.length > 0) {
    columns.push(currentColumn);
  }

  return columns;
}

// helper to figure out if we need to show a month label
function getColumnLabel(
  column: HeatmapWeek[],
  prevColumn: HeatmapWeek[] | undefined,
  colIndex: number
) {
  const currentMonth = column[0].date.getUTCMonth();
  const currentYear = column[0].date.getUTCFullYear();

  const prevMonth = prevColumn ? prevColumn[0].date.getUTCMonth() : -1;
  const isMonthChange = currentMonth !== prevMonth;

  // only show label every 3 months or on the very first column
  const isQuarterlyMonth = currentMonth % 3 === 0;
  const shouldShowLabel = isMonthChange && (isQuarterlyMonth || colIndex === 0);

  if (!shouldShowLabel) return null;

  // add year if its jan or the first column
  const includeYear = currentMonth === 0 || colIndex === 0;
  return includeYear
    ? `${MONTHS[currentMonth]} ${currentYear}`
    : MONTHS[currentMonth];
}

export function ContributionHeatmap({
  dailyCounts,
}: {
  dailyCounts: DailyCount[];
}) {
  const columns = useMemo(() => buildGrid(dailyCounts), [dailyCounts]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto scroll to the end
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [columns]);

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="flex min-w-0 overflow-x-auto pb-3 pt-2 pl-4 -ml-4"
        style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="min-w-max pr-4">
          {/* header row for labels */}
          <div className="flex mb-2 h-[16px]" style={{ gap: 4 }}>
            {columns.map((col, i) => {
              const label = getColumnLabel(
                col,
                i > 0 ? columns[i - 1] : undefined,
                i
              );

              const currentYear = col[0].date.getUTCFullYear();
              const prevYear =
                i > 0 ? columns[i - 1][0].date.getUTCFullYear() : currentYear;
              const isYearChange = currentYear !== prevYear;

              return (
                <div
                  key={i}
                  className={`shrink-0 relative overflow-visible ${isYearChange ? 'ml-3 mr-1' : ''}`}
                  style={{ width: SQUARE_SIZE }}
                >
                  {label && (
                    <span className="absolute bottom-0 left-0 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          { }
          <div className="flex" style={{ gap: 4 }}>
            {columns.map((col, colIndex) => {
              const currentYear = col[0].date.getUTCFullYear();
              const prevYear =
                colIndex > 0
                  ? columns[colIndex - 1][0].date.getUTCFullYear()
                  : currentYear;
              const isYearChange = currentYear !== prevYear;

              // adding margin and a dashed border when the year changes
              return (
                <div
                  key={colIndex}
                  className={`flex flex-col shrink-0 ${isYearChange
                      ? 'ml-3 mr-1 relative before:absolute before:-left-[10px] before:-top-[24px] before:-bottom-1 before:border-l-[2px] before:border-dashed before:border-slate-300 before:-z-10'
                      : ''
                    }`}
                  style={{ gap: 4 }}
                >
                  {col.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className={`rounded-[4px] transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-slate-400 hover:z-10 ${heatmapColor(week.count)}`}
                      style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }}
                      title={`Week of ${formatDateKeyUTC(week.date)}: ${week.count} mapping${week.count !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
