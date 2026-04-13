import { Link } from 'react-router-dom';
import { GitMerge, Shield, SquarePen, Upload, Users, Download } from 'lucide-react';

export function AdminPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 -top-24 h-144 w-xl -translate-x-1/2 rounded-full bg-white/80 blur-[140px]" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px]" />
        <div className="absolute right-[14%] top-[28%] h-88 w-88 rounded-[40%] bg-linear-to-br from-[#ffdff3]/55 via-[#fff3f8]/35 to-transparent blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto mt-20 w-full max-w-3xl px-6 pb-24 lg:mt-24 lg:px-0">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-[#0a4da2]" />
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Admin Panel
            </h1>
          </div>
          <p className="text-base text-slate-600">
            Manage platform content and data.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/admin/moderation"
            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_50px_-20px_rgba(7,30,84,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(7,30,84,0.4)]"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#7c6cff] to-[#0a4da2] shadow-md">
                <SquarePen className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Moderation</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review, edit and delete competencies and resources.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/import"
            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_50px_-20px_rgba(7,30,84,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(7,30,84,0.4)]"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0a4da2] to-[#7c6cff] shadow-md">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Import Competencies</h2>
              <p className="mt-1 text-sm text-slate-500">
                Bulk-import competencies from a JSON or CSV file.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/import/relationships"
            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_50px_-20px_rgba(7,30,84,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(7,30,84,0.4)]"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0a4da2] to-[#7c6cff] shadow-md">
                <GitMerge className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Import Relationships</h2>
              <p className="mt-1 text-sm text-slate-500">
                Bulk-import competency relationships from a JSON or CSV file.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/roles"
            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_50px_-20px_rgba(7,30,84,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(7,30,84,0.4)]"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0a4da2] to-[#7c6cff] shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Roles</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage user roles without exposing personal data.
              </p>
            </div>
          </Link>

          <Link
            to="/admin/export"
            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_16px_50px_-20px_rgba(7,30,84,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(7,30,84,0.4)]"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0a4da2] to-[#7c6cff] shadow-md">
                <Download className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Export</h2>
              <p className="mt-1 text-sm text-slate-500">
                Export platform data for analysis or backup.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
