import { Card, CardHeader } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="relative flex h-[280px] flex-col border-2 border-slate-200/50 bg-gradient-to-br from-slate-50/80 to-white shadow-lg overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-slate-300 to-slate-200 rounded-r-full" />
      <CardHeader className="flex h-full flex-col space-y-3 pb-3 pl-5">
        <div className="h-6 w-24 rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse" />
        </div>
        <div className="h-6 w-3/4 rounded-md bg-slate-200 animate-pulse mt-2" />
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-slate-100 animate-pulse" />
        </div>
      </CardHeader>
    </Card>
  );
}
