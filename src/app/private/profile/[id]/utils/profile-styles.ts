import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Language proficiency levels using HeroUI colors
 */
export const LANGUAGE_LEVELS = {
  NATIVE: { color: 'success' as const, percentage: 100 },
  FLUENT: { color: 'success' as const, percentage: 95 },
  PROFESSIONAL: { color: 'primary' as const, percentage: 85 },
  CONVERSATIONAL: { color: 'secondary' as const, percentage: 70 },
  INTERMEDIATE: { color: 'warning' as const, percentage: 55 },
  BEGINNER: { color: 'default' as const, percentage: 35 },
  ELEMENTARY: { color: 'default' as const, percentage: 20 },
} as const;

/**
 * Skill levels using HeroUI colors
 */
export const SKILL_LEVELS = {
  EXPERT: { color: 'success' as const, percentage: 95 },
  ADVANCED: { color: 'primary' as const, percentage: 80 },
  INTERMEDIATE: { color: 'warning' as const, percentage: 60 },
  BEGINNER: { color: 'default' as const, percentage: 35 },
} as const;

/**
 * Type definitions for better TypeScript support
 */
export type HeroUIColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type HeroUISize = 'sm' | 'md' | 'lg';
export type HeroUIVariant = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';