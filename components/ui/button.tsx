import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', href, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4';

    const variants: Record<string, string> = {
      default: 'bg-primary text-primary-foreground hover:brightness-90',
      outline:
        'border border-border bg-transparent hover:bg-muted/5 text-foreground',
      ghost: 'bg-transparent hover:bg-muted/5 text-foreground',
    };

    const classes = cn(base, variants[variant], className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {props.children}
        </Link>
      );
    }

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = 'Button';
