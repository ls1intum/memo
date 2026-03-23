import {
  Star,
  Target,
  Award,
  Trophy,
  Flame,
  Zap,
  Mountain,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MilestoneDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
  /** Total mappings threshold (for count-based milestones) */
  threshold?: number;
  /** Streak days threshold (for streak-based milestones) */
  streakDays?: number;
}

export const MILESTONES: MilestoneDef[] = [
  {
    id: 'first-steps',
    name: 'The First Node',
    description: '1+ mapping',
    icon: Star,
    gradient: 'from-emerald-400 to-teal-500',
    glowColor: 'rgba(16,185,129,0.35)',
    threshold: 1,
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: '10+ mappings',
    icon: Target,
    gradient: 'from-blue-400 to-indigo-500',
    glowColor: 'rgba(99,102,241,0.35)',
    threshold: 10,
  },
  {
    id: 'half-century',
    name: 'Half Century',
    description: '50+ mappings',
    icon: Award,
    gradient: 'from-violet-400 to-purple-600',
    glowColor: 'rgba(139,92,246,0.35)',
    threshold: 50,
  },
  {
    id: 'century',
    name: 'Century',
    description: '100+ mappings',
    icon: Trophy,
    gradient: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(245,158,11,0.35)',
    threshold: 100,
  },
  {
    id: 'streak-3',
    name: 'On Fire',
    description: '3-day streak',
    icon: Flame,
    gradient: 'from-orange-400 to-red-500',
    glowColor: 'rgba(239,68,68,0.35)',
    streakDays: 3,
  },
  {
    id: 'streak-7',
    name: 'Dedicated',
    description: '7-day streak',
    icon: Zap,
    gradient: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(245,158,11,0.35)',
    streakDays: 7,
  },
  {
    id: 'streak-30',
    name: 'Monthly Mapper',
    description: '30-day streak',
    icon: Mountain,
    gradient: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6,182,212,0.35)',
    streakDays: 30,
  },
];

/** Returns milestones that were just crossed going from oldTotal to newTotal */
export function getNewlyEarnedMilestones(
  oldTotal: number,
  newTotal: number
): MilestoneDef[] {
  return MILESTONES.filter(
    m => m.threshold && newTotal >= m.threshold && oldTotal < m.threshold
  );
}
