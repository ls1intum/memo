import * as React from 'react';
import { createPortal } from 'react-dom';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/domain_core/infrastructure/utils';

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
  triggerElement: HTMLElement | null;
  setTriggerElement: (element: HTMLElement | null) => void;
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
  const [triggerElement, setTriggerElement] =
    React.useState<HTMLElement | null>(null);

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        delayDuration,
        timerRef,
        side,
        triggerElement,
        setTriggerElement,
      }}
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
  const triggerRef = React.useRef<HTMLElement | null>(null);

  if (!context) {
    throw new Error('TooltipTrigger must be used within a Tooltip');
  }

  const { setOpen, delayDuration, timerRef, setTriggerElement } = context;

  // Unified ref callback that handles both triggerRef and setTriggerElement
  const handleRef = React.useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      setTriggerElement(node);
    },
    [setTriggerElement]
  );

  React.useEffect(() => {
    return () => {
      setTriggerElement(null);
    };
  }, []);

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
      ref={handleRef}
      className={cn('inline-flex focus:outline-none', className)}
    >
      {children}
    </TriggerComponent>
  );
}

export function TooltipContent({ children, className }: TooltipContentProps) {
  const context = React.useContext(TooltipContext);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  if (!context) {
    throw new Error('TooltipContent must be used within a Tooltip');
  }

  const { open, side, triggerElement } = context;
  const isTop = side === 'top';

  React.useEffect(() => {
    if (!open || !triggerElement) {
      setIsVisible(false);
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerElement) return;

      const rect = triggerElement.getBoundingClientRect();
      const TOOLTIP_SPACING = 8;

      setPosition({
        top: isTop ? rect.top - TOOLTIP_SPACING : rect.bottom + TOOLTIP_SPACING,
        left: rect.left + rect.width / 2,
      });
      setIsVisible(true);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(updatePosition);

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open, triggerElement, isTop]);

  if (!open || !position) return null;

  const content = (
    <div
      role="tooltip"
      className={cn(
        'pointer-events-none fixed z-[9999] w-64 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg transition-opacity duration-150',
        isTop ? '-translate-y-full' : '',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
}
