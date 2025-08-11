export const BROADCAST_CONSTANTS = {
  MIN_TOPIC_SELECTION: 5,
  MAX_TOPIC_SELECTION: 10,
  DEFAULT_ANIMATION_DURATION: 220,
  DEFAULT_ROW_COUNT: 5,
  DEFAULT_CARD_HEIGHT: 135,
  DEFAULT_ASPECT_RATIO: 16 / 9,
  DEFAULT_GAP: 24,
  STORAGE_KEY: 'wingman_broadcast_preferences'
} as const;

export const TOPIC_CATEGORIES = [
  'AI',
  'Development', 
  'Cloud',
  'DevOps',
  'Data',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Freelance',
  'Business'
] as const;

export const DEFAULT_ROW_TITLES = [
  'AI & Agents',
  'Dev & Cloud', 
  'Marketing Growth',
  'Sales Playbook',
  'Freelance Ops'
] as const;