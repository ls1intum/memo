export function heatmapColor(count: number): string {
  if (count === 0) return 'bg-slate-200 dark:bg-slate-700';
  if (count <= 2) return 'bg-blue-400';
  if (count <= 5) return 'bg-blue-500';
  if (count <= 10) return 'bg-indigo-600';
  return 'bg-indigo-800';
}
