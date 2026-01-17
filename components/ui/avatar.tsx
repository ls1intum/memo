import { cn } from '../../domain_core/infrastructure/utils';

export const Avatar = ({
  initials,
  alt = 'Avatar',
  size = 48,
  className,
}: {
  initials?: string;
  alt?: string;
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-air-superiority-blue/60 to-air-superiority-blue/40 dark:from-air-superiority-blue/50 dark:to-yinmn-blue/60 text-yinmn-blue dark:text-air-superiority-blue font-semibold shadow-md',
        className
      )}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
      title={alt}
    >
      {initials || '?'}
    </div>
  );
};
