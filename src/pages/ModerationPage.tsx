import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function InlineEdit({
  value,
  onSave,
  multiline = false,
  placeholder = '—',
  className = '',
}: {
  value: string | null;
  onSave: (next: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? '');
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const start = () => {
    setDraft(value ?? '');
    setEditing(true);
    setTimeout(() => ref.current?.focus(), 0);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== (value ?? '')) onSave(trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value ?? '');
    setEditing(false);
  };

  const baseInputClass = `w-full bg-transparent text-inherit font-inherit leading-inherit border-0 outline-none resize-none ${className}`;

  if (!editing) {
    return (
      <span
        onClick={start}
        className={`cursor-text hover:text-[#0a4da2] transition-colors ${className}`}
        title="Click to edit"
      >
        {value || (
          <span className="text-slate-300 italic text-xs">{placeholder}</span>
        )}
      </span>
    );
  }

  return multiline ? (
    <textarea
      ref={ref as React.RefObject<HTMLTextAreaElement>}
      value={draft}
      rows={2}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      }}
      className={baseInputClass}
    />
  ) : (
    <input
      ref={ref as React.RefObject<HTMLInputElement>}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      }}
      className={baseInputClass}
    />
  );
}

export function ModerationPage() {
  const [tab, setTab] = useState<Tab>('competencies');
  const [search, setSearch] = useState('');
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

  const updateCompetency = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; description?: string };
    }) => competenciesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
      toast.success('Saved');
    },
    onError: () => toast.error('Failed to save'),
  });

  const updateResource = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; url?: string };
    }) => learningResourcesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningResources'] });
      toast.success('Saved');
    },
    onError: () => toast.error('Failed to save'),
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

  const q = search.toLowerCase();
  const filteredCompetencies = (competenciesQuery.data ?? []).filter(
    c =>
      c.title.toLowerCase().includes(q) ||
      (c.description ?? '').toLowerCase().includes(q)
  );
  const filteredResources = (resourcesQuery.data ?? []).filter(
    r => r.title.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)
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
            Content Moderation
          </span>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Moderation
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click any title or description to edit it inline.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="h-10 w-56 rounded-full border border-slate-200/80 bg-white/80 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm backdrop-blur focus:outline-none focus:ring-2 focus:ring-[#0a4da2]/30 dark:border-slate-600/80 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60">
          <div className="flex gap-2 border-b border-slate-200/60 mb-6 dark:border-slate-700/50">
            {(['competencies', 'resources'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSearch('');
                }}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
                  tab === t
                    ? 'border-[#0a4da2] text-[#0a4da2] dark:border-[#6b9fff] dark:text-[#6b9fff]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {t === 'competencies'
                  ? `Competencies${competenciesQuery.data ? ` (${filteredCompetencies.length})` : ''}`
                  : `Learning Resources${resourcesQuery.data ? ` (${filteredResources.length})` : ''}`}
              </button>
            ))}
          </div>

          {tab === 'competencies' && (
            <CompetencyTable
              data={filteredCompetencies}
              isLoading={competenciesQuery.isLoading}
              onUpdate={(c, field, val) =>
                updateCompetency.mutate({ id: c.id, data: { [field]: val } })
              }
              onDelete={c =>
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
              data={filteredResources}
              isLoading={resourcesQuery.isLoading}
              onUpdate={(r, field, val) =>
                updateResource.mutate({ id: r.id, data: { [field]: val } })
              }
              onDelete={r =>
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
  onUpdate,
  onDelete,
}: {
  data: Competency[];
  isLoading: boolean;
  onUpdate: (
    c: Competency,
    field: 'title' | 'description',
    val: string
  ) => void;
  onDelete: (c: Competency) => void;
}) {
  if (isLoading)
    return (
      <p className="text-sm text-slate-500 dark:text-slate-500">Loading…</p>
    );
  if (data.length === 0)
    return (
      <p className="text-sm text-slate-400 italic dark:text-slate-500">
        No results.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700/50 dark:bg-slate-800/40">
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-52">
              Title
            </th>
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description
            </th>
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-36">
              Confidence
            </th>
            <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 w-16">
              Votes
            </th>
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell w-28">
              Created
            </th>
            <th className="pb-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {data.map(c => (
            <tr
              key={c.id}
              className="group align-top hover:bg-slate-50/60 transition-colors dark:hover:bg-slate-700/30"
            >
              <td className="py-3 pr-6 font-medium text-slate-900 dark:text-slate-100">
                <InlineEdit
                  value={c.title}
                  onSave={val => onUpdate(c, 'title', val)}
                />
              </td>
              <td className="py-3 pr-6 text-slate-500 dark:text-slate-400">
                <InlineEdit
                  value={c.description}
                  onSave={val => onUpdate(c, 'description', val)}
                  multiline
                  placeholder="No description"
                />
              </td>
              <td className="py-3 pr-6">
                {c.confidenceTier && c.confidenceScore !== undefined ? (
                  <ConfidenceBadge
                    score={c.confidenceScore}
                    tier={c.confidenceTier}
                  />
                ) : (
                  <span className="text-xs text-slate-300 dark:text-slate-600">
                    —
                  </span>
                )}
              </td>
              <td className="py-3 pr-6 text-center">
                <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {c.degree}
                </span>
              </td>
              <td className="py-3 pr-6 text-xs text-slate-400 hidden lg:table-cell whitespace-nowrap dark:text-slate-500">
                {formatDate(c.createdAt)}
              </td>
              <td className="py-3 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(c)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
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
  onUpdate,
  onDelete,
}: {
  data: LearningResource[];
  isLoading: boolean;
  onUpdate: (r: LearningResource, field: 'title' | 'url', val: string) => void;
  onDelete: (r: LearningResource) => void;
}) {
  if (isLoading)
    return (
      <p className="text-sm text-slate-500 dark:text-slate-500">Loading…</p>
    );
  if (data.length === 0)
    return (
      <p className="text-sm text-slate-400 italic dark:text-slate-500">
        No results.
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700/50 dark:bg-slate-800/40">
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 w-52">
              Title
            </th>
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              URL
            </th>
            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 hidden lg:table-cell w-28">
              Created
            </th>
            <th className="pb-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {data.map(r => (
            <tr
              key={r.id}
              className="group align-top hover:bg-slate-50/60 transition-colors dark:hover:bg-slate-700/30"
            >
              <td className="py-3 pr-6 font-medium text-slate-900 dark:text-slate-100">
                <InlineEdit
                  value={r.title}
                  onSave={val => onUpdate(r, 'title', val)}
                />
              </td>
              <td className="py-3 pr-6 text-slate-500 dark:text-slate-400">
                <InlineEdit
                  value={r.url}
                  onSave={val => onUpdate(r, 'url', val)}
                  placeholder="No URL"
                />
              </td>
              <td className="py-3 pr-6 text-xs text-slate-400 hidden lg:table-cell whitespace-nowrap dark:text-slate-500">
                {formatDate(r.createdAt)}
              </td>
              <td className="py-3 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(r)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
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
