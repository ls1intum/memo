import { cn } from '../../domain_core/infrastructure/utils';

export const Card = ({
  className,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  className,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) => <div className={cn('mb-4', className)}>{children}</div>;

export const CardTitle = ({
  className,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <h3
    className={cn(
      'text-lg font-semibold bg-gradient-to-r from-yinmn-blue to-air-superiority-blue dark:from-air-superiority-blue dark:to-air-superiority-blue bg-clip-text text-transparent',
      className
    )}
  >
    {children}
  </h3>
);

export const CardContent = ({
  className,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </div>
);

export const CardDescription = ({
  className,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
);
