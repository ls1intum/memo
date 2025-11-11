'use client';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export const Dropdown = ({
  label,
  items,
  className,
}: {
  label: React.ReactNode;
  items: { id: string; label: React.ReactNode; onClick?: () => void }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setOpen(s => !s)}
        className="px-3 py-1 rounded-md bg-muted/10 text-sm"
        aria-expanded={open}
      >
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-card shadow-sm z-50">
          <ul className="p-2">
            {items.map(it => (
              <li key={it.id}>
                <button
                  onClick={() => {
                    it.onClick?.();
                    setOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-muted/5 text-sm"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
