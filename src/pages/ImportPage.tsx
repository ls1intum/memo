import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi, type CompetencyImportRow } from '@/lib/api/admin';
import type { ImportResult } from '@/lib/api/types';

type Mode = 'file' | 'json';
type Status = 'idle' | 'uploading' | 'success' | 'error';

const PLACEHOLDER = `[
  { "title": "Understand Big-O notation", "description": "Time and space complexity analysis" },
  { "title": "Apply sorting algorithms" }
]`;

export function ImportPage() {
  const [mode, setMode] = useState<Mode>('file');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
    setSelectedFile(null);
    setJsonText('');
    setJsonError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setJsonError('');
  };

  const handleSubmit = async () => {
    setStatus('uploading');
    setResult(null);
    setErrorMessage('');

    try {
      let importResult: ImportResult;

      if (mode === 'file') {
        if (!selectedFile) {
          setErrorMessage('Please select a file.');
          setStatus('error');
          return;
        }
        importResult = await adminApi.importCompetenciesFile(selectedFile);
      } else {
        let rows: CompetencyImportRow[];
        try {
          rows = JSON.parse(jsonText) as CompetencyImportRow[];
        } catch {
          setJsonError('Invalid JSON. Please check the format.');
          setStatus('idle');
          return;
        }
        importResult = await adminApi.importCompetenciesJson(rows);
      }

      setResult(importResult);
      setStatus('success');
    } catch {
      setErrorMessage('Import failed. Please check your file and try again.');
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 -top-24 h-144 w-xl -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-88 w-88 rounded-[40%] bg-linear-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 w-full max-w-2xl px-6 pb-24 lg:mt-24 lg:px-0">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/admin"
            className="flex items-center gap-1 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">
            Import Competencies
          </span>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Import
          </h1>
          <p className="text-base text-slate-600">
            Bulk-import competencies from a JSON or CSV file.
          </p>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/85 px-8 py-6 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl">
          {status === 'success' && result ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-2 font-semibold text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Import complete
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  <li className="text-green-700">
                    ✓ Imported: <strong>{result.imported}</strong>
                  </li>
                  {result.skipped > 0 && (
                    <li className="text-yellow-600">
                      ⚠ Skipped (duplicates): <strong>{result.skipped}</strong>
                    </li>
                  )}
                </ul>
                {result.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-600">Errors:</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-red-600">
                      {result.errors.map((e, i) => (
                        <li key={i}>• {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={reset}>
                Import another file
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex gap-2 border-b border-slate-200/60">
                {(['file', 'json'] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
                      mode === m
                        ? 'border-[#0a4da2] text-[#0a4da2]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {m === 'file' ? 'File Upload' : 'Paste JSON'}
                  </button>
                ))}
              </div>

              {mode === 'file' ? (
                <div className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 transition hover:border-[#0a4da2]/50 hover:bg-slate-50"
                  >
                    {selectedFile ? (
                      <>
                        <FileText className="h-8 w-8 text-[#0a4da2]" />
                        <p className="text-sm font-semibold text-slate-800">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-700">
                          Drop a file here or click to browse
                        </p>
                        <p className="text-xs text-slate-500">
                          Accepts .json or .csv (max 5 MB)
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      CSV format
                    </p>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600">
                      {`title,description\n"Understand Big-O notation","Time and space complexity"\n"Apply sorting algorithms",`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={jsonText}
                    onChange={handleJsonChange}
                    placeholder={PLACEHOLDER}
                    rows={12}
                    className="w-full rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a4da2]/30"
                  />
                  {jsonError && (
                    <p className="text-sm text-red-500">{jsonError}</p>
                  )}
                </div>
              )}

              {status === 'error' && errorMessage && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={status === 'uploading'}
                  className="rounded-full bg-linear-to-r from-[#0a4da2] to-[#7c6cff] px-7 text-white shadow-[0_18px_45px_-26px_rgba(7,30,84,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-30px_rgba(7,30,84,0.6)]"
                >
                  {status === 'uploading' ? 'Importing…' : 'Import'}
                </Button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
