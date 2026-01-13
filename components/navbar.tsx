'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '../domain_core/infrastructure/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

const APP_VERSION = '0.1.0';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeIndex = navItems.findIndex(item => item.href === pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        'sticky top-0 z-50 border-b border-white/30 bg-white/15 backdrop-blur-xl dark:border-slate-800/30 dark:bg-slate-900/15 supports-[backdrop-filter]:bg-white/12 transition-shadow duration-200',
        scrolled
          ? 'shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)]'
          : 'shadow-none'
      )}
      style={{ maxHeight: '5rem' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="relative flex items-center h-[4.25rem]"
        >
          {/* Left side - App name & Version */}
          <div className="relative z-10 flex items-center gap-2 py-0.5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-slate-900 transition hover:text-[#0a4da2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4da2] focus-visible:ring-offset-2 dark:text-white dark:hover:text-[#b3c8ff]"
              aria-label="Memo - Home"
            >
              <span className="font-bold text-lg">Memo</span>
            </Link>
            <span
              className="rounded-full border border-slate-200/80 bg-white/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-300"
              aria-label={`Version ${APP_VERSION}`}
            >
              v{APP_VERSION}
            </span>
          </div>

          {/* Center - Sliding nav */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="pointer-events-auto relative flex w-[16rem] max-w-full items-center justify-between rounded-full border border-slate-200/80 bg-white/70 px-[0px] py-[8px] shadow-inner backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
              {activeIndex >= 0 && (
                <div
                  className="absolute inset-y-1 rounded-full bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] shadow-md transition-all duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 1rem)',
                    left: activeIndex === 1 ? 'calc(50% + 0.5rem)' : '0.5rem',
                  }}
                  aria-hidden="true"
                />
              )}
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative z-10 flex flex-1 items-center justify-center px-4 py-1.5 text-center text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4da2] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                    pathname === item.href
                      ? 'text-white'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Dark mode toggle & Login (per guidelines order) */}
          <div className="relative z-10 ml-auto flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4da2] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800/70 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:focus-visible:ring-offset-slate-900"
              aria-label={
                mounted
                  ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
                  : 'Toggle theme'
              }
            >
              {mounted ? (
                theme === 'dark' ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )
              ) : (
                <span className="w-5 h-5 block" />
              )}
            </button>

            {/* Login button - last element per guidelines */}
            <Link
              href="/session"
              className="hidden rounded-full bg-gradient-to-r from-[#0a4da2] to-[#7c6cff] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(10,77,162,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(10,77,162,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-[#0a4da2] dark:focus-visible:ring-offset-slate-900 sm:inline-flex"
              aria-label="Start Contributing"
            >
              Start Contributing
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
