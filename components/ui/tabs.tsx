"use client";
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function Tabs({
  items,
  className,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  return (
    <div className={cn('w-full', className)}>
      <nav className="flex gap-2 mb-6 justify-center">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              active === it.id
                ? 'bg-gradient-to-r from-yinmn-blue to-air-superiority-blue text-white shadow-lg scale-105'
                : 'bg-uranian-blue/30 dark:bg-air-superiority-blue/20 text-yinmn-blue dark:text-air-superiority-blue hover:bg-uranian-blue/50 dark:hover:bg-air-superiority-blue/30 hover:scale-105'
            )}
          >
            {it.title}
          </button>
        ))}
      </nav>
      <div>
        {items.map((it) => (
          <div key={it.id} hidden={active !== it.id}>
            {it.content}
          </div>
        ))}
      </div>
    </div>
  );
}
