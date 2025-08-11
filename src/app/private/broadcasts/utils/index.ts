// Re-export broadcast utilities
export * from './broadcast-utils';

// Topic utilities for onboarding
import { Topic } from '../types';

const BACKGROUND_IMAGES = [
  '/broadcast-onboarding/generative-ai.jpg',
  '/broadcast-onboarding/mobile-dev.jpg', 
  '/broadcast-onboarding/design-system.jpg',
  '/broadcast-onboarding/data-visualisation.png'
];

export const poster = (query: string, w = 480, h = 270) => {
  return `/placeholder.svg?height=${h}&width=${w}&query=${encodeURIComponent(query)}`;
};

export const getTopicBackgroundImage = (topicId: string): string => {
  let hash = 0;
  for (let i = 0; i < topicId.length; i++) {
    const char = topicId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % BACKGROUND_IMAGES.length;
  return BACKGROUND_IMAGES[index];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomTopics = (topics: Topic[], count: number): Topic[] => {
  return shuffleArray(topics).slice(0, count);
};

export const filterTopicsByCategory = (topics: Topic[], category: string): Topic[] => {
  if (category === 'All') return topics;
  return topics.filter((topic) => topic.category === category);
};

export const getUniqueCategories = (topics: Topic[]): string[] => {
  const categories = new Set(['All']);
  topics.forEach((topic) => categories.add(topic.category));
  return Array.from(categories);
};
