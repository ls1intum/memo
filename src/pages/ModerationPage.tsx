import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { competenciesApi } from '@/lib/api/competencies';
import { learningResourcesApi } from '@/lib/api/learning-resources';
import type { Competency, LearningResource } from '@/lib/api/types';

type Tab = 'competencies' | 'resources';

export function ModerationPage() {
  const [tab, setTab] = useState<Tab>('competencies');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    type: Tab;
  } | null>(null);

  const queryClient = useQueryClient();

  const competenciesQuery = useQuery({
    queryKey: ['competencies'],
    queryFn: competenciesApi.getAll,
  });

  const resourcesQuery = useQuery({
    queryKey: ['learningResources'],
    queryFn: learningResourcesApi.getAll,
  });

  const deleteCompetency = useMutation({
    mutationFn: (id: string) => competenciesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
      toast.success('Competency deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete competency'),
  });

  const deleteResource = useMutation({
    mutationFn: (id: string) => learningResourcesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningResources'] });
      toast.success('Learning resource deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete learning resource'),
  });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'competencies') {
      deleteCompetency.mutate(deleteTarget.id);
    } else {
      deleteResource.mutate(deleteTarget.id);
    }
  };

  const isDeleting = deleteCompetency.isPending || deleteResource.isPending;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-[22rem] w-[22rem] rounded-[40%] bg-gradient-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 w-full max-w-4xl px-6 pb-24 lg:mt-24 lg:px-0">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/admin"
            className="flex items-center gap-1 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">Content Moderation</span>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Content Moderation
          </h1>
          <p className="text-base text-slate-600">
            Review and delete competencies and learning resources.
          </p>
        </div>

        <section className="rounded-[24px] border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl">
          <div className="flex gap-2 border-b border-slate-200/60 mb-6">
            {(['competencies', 'resources'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
                  tab === t
                    ? 'border-[#0a4da2] text-[#0a4da2]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t === 'competencies' ? 'Competencies' : 'Learning Resources'}
              </button>
            ))}
          </div>

          {tab === 'competencies' && (
            <CompetencyTable
              data={competenciesQuery.data ?? []}
              isLoading={competenciesQuery.isLoading}
              onDelete={(c: Competency) =>
                setDeleteTarget({
                  id: c.id,
                  title: c.title,
                  type: 'competencies',
                })
              }
            />
          )}

          {tab === 'resources' && (
            <ResourceTable
              data={resourcesQuery.data ?? []}
              isLoading={resourcesQuery.isLoading}
              onDelete={(r: LearningResource) =>
                setDeleteTarget({ id: r.id, title: r.title, type: 'resources' })
              }
            />
          )}
        </section>
      </main>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete item?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium">
                &ldquo;{deleteTarget?.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CompetencyTable({
  data,
  isLoading,
  onDelete,
}: {
  data: Competency[];
  isLoading: boolean;
  onDelete: (c: Competency) => void;
}) {
  if (isLoading)
    return <p className="text-sm text-slate-500">Loading…</p>;
  if (data.length === 0)
    return <p className="text-sm text-slate-500">No competencies found.</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Title
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
              Description
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map(c => (
            <tr
              key={c.id}
              className="transition hover:bg-slate-50/60"
            >
              <td className="px-4 py-3 font-medium text-slate-900">
                {c.title}
              </td>
              <td className="hidden max-w-xs truncate px-4 py-3 text-slate-500 md:table-cell">
                {c.description ?? '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(c)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResourceTable({
  data,
  isLoading,
  onDelete,
}: {
  data: LearningResource[];
  isLoading: boolean;
  onDelete: (r: LearningResource) => void;
}) {
  if (isLoading)
    return <p className="text-sm text-slate-500">Loading…</p>;
  if (data.length === 0)
    return (
      <p className="text-sm text-slate-500">No learning resources found.</p>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Title
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
              URL
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map(r => (
            <tr
              key={r.id}
              className="transition hover:bg-slate-50/60"
            >
              <td className="px-4 py-3 font-medium text-slate-900">{r.title}</td>
              <td className="hidden max-w-xs truncate px-4 py-3 md:table-cell">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0a4da2] hover:underline"
                >
                  {r.url}
                </a>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(r)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
