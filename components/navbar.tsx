'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { Dropdown } from './ui/dropdown';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Left side - Memo */}
          <div className="flex-1">
            <Link href="/" className="group transition-transform hover:scale-105 inline-block">
              <span className="font-bold text-xl bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-air-superiority-blue dark:to-uranian-blue bg-clip-text text-transparent">
                Memo
              </span>
            </Link>
          </div>

          {/* Center - Navigation items */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-yinmn-blue to-air-superiority-blue text-white shadow-md scale-105'
                    : 'text-muted-foreground hover:bg-uranian-blue/20 dark:hover:bg-air-superiority-blue/20 hover:text-yinmn-blue dark:hover:text-air-superiority-blue hover:scale-105'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - TUM Logo & Menu */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <Link
              href="/"
              className="group transition-transform hover:scale-105 inline-block"
            >
              <Image
                src="/technical-university-of-munich-tum-logo-vector.svg"
                alt="TUM Logo"
                width={80}
                height={24}
                className="transition-opacity group-hover:opacity-80"
              />
            </Link>
            <Dropdown
              label={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              }
              items={[
                {
                  id: 'github',
                  label: (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </span>
                  ),
                  onClick: () => window.open('https://github.com', '_blank'),
                },
                {
                  id: 'tum',
                  label: (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      TUM Website
                    </span>
                  ),
                  onClick: () => window.open('https://www.tum.de', '_blank'),
                },
                {
                  id: 'docs',
                  label: (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documentation
                    </span>
                  ),
                  onClick: () => alert('Documentation coming soon!'),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
