export type Locale = (typeof locales)[number];

export type Language = 'en' | 'nl' | 'fr';
export const locales = ['en', 'fr', 'nl'] as const;

export const defaultLocale: Locale = 'en';
