import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

export function ExportPage() {
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
          <span className="font-medium text-slate-700">Export</span>
        </div>

        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Export
          </h1>
          <p className="text-sm text-slate-500">
            Export platform data for analysis or backup.
          </p>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/85 px-8 py-16 shadow-[0_20px_70px_-30px_rgba(7,30,84,0.35)] backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#0a4da2] to-[#7c6cff] shadow-md">
              <Download className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-400">Coming soon</p>
          </div>
        </section>
      </main>
    </div>
  );
}
