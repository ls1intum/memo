import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  href?: string;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      href,
      asChild,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants: Record<string, string> = {
      default: 'bg-primary text-primary-foreground hover:brightness-90',
      outline:
        'border border-border bg-transparent hover:bg-muted/5 text-foreground',
      ghost: 'bg-transparent hover:bg-muted/5 text-foreground',
    };

    const sizes: Record<string, string> = {
      default: 'h-10 px-4',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-12 px-6',
      icon: 'h-10 w-10',
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (asChild && href) {
      return (
        <Link to={href} className={classes}>
          {children}
        </Link>
      );
    }

    if (href) {
      return (
        <Link to={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
