import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type TooltipProps = {
  children: React.ReactNode;
  className?: string;
  delayDuration?: number;
  side?: 'top' | 'bottom';
};

type TooltipContentProps = {
  children: React.ReactNode;
  className?: string;
};

type TooltipTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  side: 'top' | 'bottom';
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function Tooltip({
  children,
  className,
  delayDuration = 300,
  side = 'top',
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <TooltipContext.Provider
      value={{ open, setOpen, delayDuration, timerRef, side }}
    >
      <div className={cn('relative inline-flex', className)}>{children}</div>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  asChild,
  className,
}: TooltipTriggerProps) {
  const context = React.useContext(TooltipContext);

  if (!context) {
    throw new Error('TooltipTrigger must be used within a Tooltip');
  }

  const { setOpen, delayDuration, timerRef } = context;
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleOpen = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };

  const handleClose = () => {
    clearTimer();
    setOpen(false);
  };
  const triggerProps = {
    onMouseEnter: handleOpen,
    onMouseLeave: handleClose,
    onFocus: handleOpen,
    onBlur: handleClose,
  };

  const TriggerComponent = asChild ? Slot : 'span';

  return (
    <TriggerComponent
      {...triggerProps}
      className={cn('inline-flex focus:outline-none', className)}
    >
      {children}
    </TriggerComponent>
  );
}

export function TooltipContent({ children, className }: TooltipContentProps) {
  const context = React.useContext(TooltipContext);

  if (!context) {
    throw new Error('TooltipContent must be used within a Tooltip');
  }

  const { open, side } = context;
  const isTop = side === 'top';

  return (
    <div
      role="tooltip"
      className={cn(
        'pointer-events-none absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg transition duration-150',
        isTop ? 'bottom-[calc(100%+0.5rem)]' : 'top-[calc(100%+0.5rem)]',
        open
          ? 'opacity-100 translate-y-0'
          : isTop
            ? 'opacity-0 translate-y-1'
            : 'opacity-0 -translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}
