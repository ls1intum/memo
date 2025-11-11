'use client';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export const AccordionItem = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-air-superiority-blue/30 dark:border-air-superiority-blue/30 last:border-b-0 py-5 hover:bg-uranian-blue/30 dark:hover:bg-yinmn-blue/20 transition-colors rounded-lg px-2">
      <button
        onClick={() => setOpen(s => !s)}
        className="w-full text-left flex justify-between items-center gap-4 font-semibold text-foreground hover:text-yinmn-blue dark:hover:text-air-superiority-blue transition-colors"
      >
        <span className="text-lg">{title}</span>
        <span className="text-2xl text-air-superiority-blue dark:text-air-superiority-blue font-bold min-w-[28px] text-center flex-shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="pt-4 text-base text-foreground/90 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-xl border-2 border-air-superiority-blue/30 dark:border-air-superiority-blue/40 bg-gradient-to-br from-card to-uranian-blue/20 dark:to-yinmn-blue/10 shadow-lg p-8',
      className
    )}
  >
    {children}
  </div>
);
