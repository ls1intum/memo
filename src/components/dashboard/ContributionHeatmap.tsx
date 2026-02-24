import { useMemo, useRef, useEffect } from 'react';
import type { DailyCount } from '@/lib/api/contributor-stats';
import { heatmapColor } from '@/lib/heatmap-helpers';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKS_PER_COLUMN = 4;
const SQUARE_SIZE = 26;

// calculate the grid data for the heatmap
function buildGrid(dailyCounts: DailyCount[]) {
  const countByDate = new Map<string, number>();
  for (const dc of dailyCounts) {
    countByDate.set(dc.date, dc.count);
  }

  const today = new Date();

  // end at sunday of this week
  const daysSinceMondayEnd = (today.getDay() + 6) % 7;
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - daysSinceMondayEnd));

  // start around april 1st 2024
  const april1st2024 = new Date(2024, 3, 1);
  const daysSinceMondayStart = (april1st2024.getDay() + 6) % 7;
  const startDate = new Date(april1st2024);
  startDate.setDate(april1st2024.getDate() - daysSinceMondayStart);

  const columns: { date: Date; count: number }[][] = [];
  let currentColumn: { date: Date; count: number }[] = [];

  let currentWeekStart = new Date(startDate);

  while (currentWeekStart <= endDate) {
    let weeklyCount = 0;

    // add up all the days in the week
    for (let d = 0; d < 7; d++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + d);
      const dateString = day.toISOString().split('T')[0];

      if (dateString && countByDate.has(dateString)) {
        weeklyCount += countByDate.get(dateString)!;
      }
    }

    currentColumn.push({ date: new Date(currentWeekStart), count: weeklyCount });

    // group by 4 weeks into columns
    if (currentColumn.length === WEEKS_PER_COLUMN) {
      columns.push(currentColumn);
      currentColumn = [];
    }

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  // add whatever is left
  if (currentColumn.length > 0) {
    columns.push(currentColumn);
  }

  return columns;
}

// helper to figure out if we need to show a month label
function getColumnLabel(column: { date: Date }[], prevColumn: { date: Date }[] | undefined, colIndex: number) {
  const currentMonth = column[0].date.getMonth();
  const currentYear = column[0].date.getFullYear();

  const prevMonth = prevColumn ? prevColumn[0].date.getMonth() : -1;
  const isMonthChange = currentMonth !== prevMonth;

  // only show label every 3 months or on the very first column
  const isQuarterlyMonth = currentMonth % 3 === 0;
  const shouldShowLabel = isMonthChange && (isQuarterlyMonth || colIndex === 0);

  if (!shouldShowLabel) return null;

  // add year if its jan or the first column
  const includeYear = currentMonth === 0 || colIndex === 0;
  return includeYear ? `${MONTHS[currentMonth]} ${currentYear}` : MONTHS[currentMonth];
}

export function ContributionHeatmap({ dailyCounts }: { dailyCounts: DailyCount[] }) {
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
              const label = getColumnLabel(col, i > 0 ? columns[i - 1] : undefined, i);

              const currentYear = col[0].date.getFullYear();
              const prevYear = i > 0 ? columns[i - 1][0].date.getFullYear() : currentYear;
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

          {/* grid body */}
          <div className="flex" style={{ gap: 4 }}>
            {columns.map((col, colIndex) => {
              const currentYear = col[0].date.getFullYear();
              const prevYear = colIndex > 0 ? columns[colIndex - 1][0].date.getFullYear() : currentYear;
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
                      title={`Week of ${week.date.toLocaleDateString()}: ${week.count} mapping${week.count !== 1 ? 's' : ''}`}
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
