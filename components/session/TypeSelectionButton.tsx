import React from 'react';

interface TypeSelectionButtonProps<T extends string> {
  value: T;
  label: string;
  isSelected: boolean;
  shortcutKey: string | null;
  icon: React.ReactNode;
  selectedClass: string;
  unselectedClass: string;
  iconBgClass: string;
  focusRingColor?: string;
  onSelect: (value: T | null) => void;
  onHoverEnter: (value: T) => void;
  onHoverLeave: () => void;
}

export function TypeSelectionButton<T extends string>({
  value,
  label,
  isSelected,
  shortcutKey,
  icon,
  selectedClass,
  unselectedClass,
  iconBgClass,
  focusRingColor = 'focus-visible:ring-blue-500',
  onSelect,
  onHoverEnter,
  onHoverLeave,
}: TypeSelectionButtonProps<T>) {
  return (
    <button
      type="button"
      data-relationship-button
      onClick={() => onSelect(isSelected ? null : value)}
      onMouseEnter={() => onHoverEnter(value)}
      onMouseLeave={onHoverLeave}
      className={`
        relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 w-full
        font-bold text-sm transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 ${focusRingColor} focus-visible:ring-offset-2
        ${isSelected ? `${selectedClass} scale-[1.02]` : unselectedClass}
      `}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${iconBgClass}`}
      >
        {icon}
      </span>
      <span>{label}</span>
      {shortcutKey && (
        <span
          className={`
            inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold
            ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-500'}
          `}
        >
          {shortcutKey}
        </span>
      )}
    </button>
  );
}
