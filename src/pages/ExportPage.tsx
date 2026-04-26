'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { adminApi } from '@/lib/api/admin';
import type { ExportFormat, ExportDataset } from '@/lib/api/types';

const ALL_DATASETS: {
  id: ExportDataset;
  label: string;
  description: string;
}[] = [
  {
    id: 'competencies',
    label: 'Competencies',
    description: 'titles, descriptions, degree',
  },
  {
    id: 'relationships',
    label: 'Relationships',
    description: 'vote counts, entropy between competencies',
  },
  {
    id: 'resources',
    label: 'Resources',
    description: 'learning resource titles and URLs',
  },
  {
    id: 'links',
    label: 'Links',
    description: 'competency-to-resource match ratings',
  },
  {
    id: 'votes',
    label: 'Votes',
    description: 'individual user relationship votes',
  },
];

export function ExportPage() {
  const [format, setFormat] = useState<ExportFormat>('json');
  const [selected, setSelected] = useState<ExportDataset[]>(
    ALL_DATASETS.map(d => d.id)
  );
  const [downloadStarted, setDownloadStarted] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => adminApi.exportData({ format, include: selected }),
    onSuccess: () => {
      setDownloadStarted(true);
      setTimeout(() => setDownloadStarted(false), 3000);
    },
  });

  const allSelected = selected.length === ALL_DATASETS.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : ALL_DATASETS.map(d => d.id));
  };

  const toggleDataset = (id: ExportDataset) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? 'Export failed. Please try again.'
        : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900 dark:from-[#0f1729] dark:via-[#111b30] dark:to-[#0f1729] dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 -top-24 h-144 w-xl -translate-x-1/2 rounded-full bg-white/80 blur-[140px] dark:bg-slate-800/30" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px] dark:bg-[#7fb0ff]/10" />
        <div className="absolute right-[14%] top-[28%] h-88 w-88 rounded-[40%] bg-linear-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px] dark:from-[#ffdff3]/10 dark:via-[#fff3f8]/5" />
      </div>

      <main className="relative z-10 mx-auto mt-20 w-full max-w-2xl px-6 pb-24 lg:mt-24 lg:px-0">
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
            Export
          </span>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
            Export
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Export platform data for analysis or backup.
          </p>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60">
          {/* Format tabs */}
          <div className="mb-6 flex gap-2 border-b border-slate-200/60 dark:border-slate-700/50">
            {(['json', 'csv'] as ExportFormat[]).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
                  format === f
                    ? 'border-[#0a4da2] text-[#0a4da2] dark:border-[#6b9fff] dark:text-[#6b9fff]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            {format === 'json'
              ? 'Exports a single structured JSON object with all selected datasets as keys.'
              : 'Exports a multi-section CSV file with each dataset separated by a header row.'}
          </p>

          {/* Dataset checkboxes */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Datasets
              </p>
              <button
                onClick={toggleSelectAll}
                className="text-xs font-medium text-[#0a4da2] transition hover:underline dark:text-[#6b9fff]"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/60 dark:divide-slate-700/50 dark:border-slate-700/50">
              {ALL_DATASETS.map(({ id, label, description }) => (
                <label
                  key={id}
                  htmlFor={`dataset-${id}`}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-slate-50/80 dark:hover:bg-slate-700/30"
                >
                  <input
                    id={`dataset-${id}`}
                    type="checkbox"
                    checked={selected.includes(id)}
                    onChange={() => toggleDataset(id)}
                    className="h-4 w-4 rounded border-slate-300 accent-[#0a4da2] transition dark:border-slate-600 dark:accent-[#6b9fff]"
                  />
                  <Label
                    htmlFor={`dataset-${id}`}
                    className="flex flex-1 cursor-pointer items-baseline gap-2"
                  >
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {label}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {description}
                    </span>
                  </Label>
                </label>
              ))}
            </div>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Download started note */}
          {downloadStarted && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400">
              <Download className="h-4 w-4 shrink-0" />
              Download started — check your downloads folder.
            </div>
          )}

          {/* Export button */}
          <Button
            onClick={() => mutate()}
            disabled={isPending || selected.length === 0}
            className="rounded-full bg-linear-to-r from-[#0a4da2] to-[#7c6cff] px-7 text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-30px_rgba(7,30,84,0.6)] disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending ? 'Exporting...' : 'Export'}
          </Button>
        </section>
      </main>
    </div>
  );
}
