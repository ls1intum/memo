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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90 shadow-sm"
      style={{ maxHeight: '3.75rem' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="relative flex items-center justify-between h-[3.75rem]"
        >
          {/* Left side - App name & Version */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group transition-transform hover:scale-105 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
              aria-label="Memo - Home"
            >
              <span className="font-bold text-xl text-white">Memo</span>
            </Link>
            <span
              className="text-xs text-white/70 font-mono"
              aria-label={`Version ${APP_VERSION}`}
            >
              v{APP_VERSION}
            </span>
          </div>

          {/* Center - Navigation items */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
                  pathname === item.href
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Dark mode toggle & Login (per guidelines order) */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
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
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-primary hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              aria-label="Sign in to your account"
            >
              Sign In
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
