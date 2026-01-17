import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-slate-200/70 bg-white/80 text-sm text-slate-500 shadow-[0_-15px_60px_-45px_rgba(7,30,84,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-0">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="text-sm font-semibold">Memo Benchmark Platform</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
          <Link className="transition hover:text-slate-900" to="/#overview">
            Overview
          </Link>
          <Link className="transition hover:text-slate-900" to="/#challenges">
            Challenges
          </Link>
        </div>
        <div className="text-slate-400">© {new Date().getFullYear()} Memo</div>
      </div>
    </footer>
  );
}
