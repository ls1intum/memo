import {
  Layers,
  TrendingUp,
  Equal,
  Unlink,
  X,
  Minus,
  ThumbsUp,
  Star,
} from 'lucide-react';

// Define enums locally for UI (matching what the session page uses)
export type RelationshipType = 'ASSUMES' | 'EXTENDS' | 'MATCHES' | 'UNRELATED';
export type ResourceMatchType =
  | 'UNRELATED'
  | 'WEAK'
  | 'GOOD_FIT'
  | 'PERFECT_MATCH';

// Blue-Purple theme colors for competency mapping
export const THEME_COLORS = {
  source: { primary: '#0a4da2', secondary: '#4263eb' },
  destination: { primary: '#7c3aed', secondary: '#9775fa' },
  resource: { primary: '#be185d', secondary: '#f472b6' },
} as const;

// Relationship type configuration
export type RelationshipTypeOption = {
  value: RelationshipType;
  label: string;
};

const RELATIONSHIP_TYPE_VALUES: RelationshipType[] = [
  'ASSUMES',
  'EXTENDS',
  'MATCHES',
  'UNRELATED',
];

export const RELATIONSHIP_TYPES: RelationshipTypeOption[] =
  RELATIONSHIP_TYPE_VALUES.map(type => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase(),
  }));

// Color mappings for relationship types
export const RELATIONSHIP_SELECTED_COLORS: Record<RelationshipType, string> = {
  ASSUMES:
    'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-blue-600',
  EXTENDS:
    'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border-purple-600',
  MATCHES:
    'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-600',
  UNRELATED:
    'bg-slate-600 text-white shadow-lg shadow-slate-500/25 border-slate-600',
};

export const RELATIONSHIP_UNSELECTED_COLORS: Record<RelationshipType, string> =
  {
    ASSUMES:
      'bg-white text-slate-800 border-blue-300 hover:border-blue-500 hover:bg-blue-50',
    EXTENDS:
      'bg-white text-slate-800 border-purple-300 hover:border-purple-500 hover:bg-purple-50',
    MATCHES:
      'bg-white text-slate-800 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50',
    UNRELATED:
      'bg-white text-slate-800 border-slate-300 hover:border-slate-500 hover:bg-slate-50',
  };

export const RELATIONSHIP_ICON_BG_COLORS: Record<
  RelationshipType,
  { selected: string; unselected: string }
> = {
  ASSUMES: { selected: 'bg-white/25', unselected: 'bg-blue-100 text-blue-600' },
  EXTENDS: {
    selected: 'bg-white/25',
    unselected: 'bg-purple-100 text-purple-600',
  },
  MATCHES: {
    selected: 'bg-white/25',
    unselected: 'bg-emerald-100 text-emerald-600',
  },
  UNRELATED: {
    selected: 'bg-white/25',
    unselected: 'bg-slate-100 text-slate-600',
  },
};

export const RELATIONSHIP_ICONS: Record<RelationshipType, typeof Layers> = {
  ASSUMES: Layers,
  EXTENDS: TrendingUp,
  MATCHES: Equal,
  UNRELATED: Unlink,
};

export const RELATIONSHIP_TYPE_TEXT_COLORS: Record<RelationshipType, string> = {
  ASSUMES: 'text-blue-600',
  EXTENDS: 'text-purple-600',
  MATCHES: 'text-emerald-600',
  UNRELATED: 'text-slate-600',
};

// Resource match type configuration
export type ResourceMatchTypeOption = {
  value: ResourceMatchType;
  label: string;
  description: string;
};

export const RESOURCE_MATCH_TYPES: ResourceMatchTypeOption[] = [
  { value: 'UNRELATED', label: 'Unrelated', description: 'no edge / no link' },
  {
    value: 'WEAK',
    label: 'Weak',
    description: 'small connection / minor overlap',
  },
  {
    value: 'GOOD_FIT',
    label: 'Good Fit',
    description: 'generally relevant, needs tailored exercise',
  },
  {
    value: 'PERFECT_MATCH',
    label: 'Perfect Match',
    description: 'directly aligned / ideal relationship',
  },
];

export const RESOURCE_SELECTED_COLORS: Record<ResourceMatchType, string> = {
  UNRELATED:
    'bg-slate-600 text-white shadow-lg shadow-slate-500/25 border-slate-600',
  WEAK: 'bg-amber-500 text-white shadow-lg shadow-amber-500/25 border-amber-500',
  GOOD_FIT:
    'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-blue-600',
  PERFECT_MATCH:
    'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-600',
};

export const RESOURCE_UNSELECTED_COLORS: Record<ResourceMatchType, string> = {
  UNRELATED:
    'bg-white text-slate-800 border-slate-300 hover:border-slate-500 hover:bg-slate-50',
  WEAK: 'bg-white text-slate-800 border-amber-300 hover:border-amber-500 hover:bg-amber-50',
  GOOD_FIT:
    'bg-white text-slate-800 border-blue-300 hover:border-blue-500 hover:bg-blue-50',
  PERFECT_MATCH:
    'bg-white text-slate-800 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50',
};

export const RESOURCE_ICON_BG_COLORS: Record<
  ResourceMatchType,
  { selected: string; unselected: string }
> = {
  UNRELATED: {
    selected: 'bg-white/25',
    unselected: 'bg-slate-100 text-slate-600',
  },
  WEAK: { selected: 'bg-white/25', unselected: 'bg-amber-100 text-amber-600' },
  GOOD_FIT: {
    selected: 'bg-white/25',
    unselected: 'bg-blue-100 text-blue-600',
  },
  PERFECT_MATCH: {
    selected: 'bg-white/25',
    unselected: 'bg-emerald-100 text-emerald-600',
  },
};

export const RESOURCE_ICONS: Record<ResourceMatchType, typeof X> = {
  UNRELATED: X,
  WEAK: Minus,
  GOOD_FIT: ThumbsUp,
  PERFECT_MATCH: Star,
};

export const RESOURCE_MATCH_TYPE_TEXT_COLORS: Record<
  ResourceMatchType,
  string
> = {
  UNRELATED: 'text-slate-600',
  WEAK: 'text-amber-600',
  GOOD_FIT: 'text-blue-600',
  PERFECT_MATCH: 'text-emerald-600',
};

// Shared scrollbar styles
export const SCROLLBAR_STYLES: {
  scrollbarWidth: 'thin';
  scrollbarColor: string;
} = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgb(203 213 225) transparent',
};
