export const translations = {
  en: {
    greeting: 'Hello',
    farewell: 'Goodbye',
    thankYou: 'Thank you'
  },
  fr: {
    greeting: 'Bonjour',
    farewell: 'Au revoir',
    thankYou: 'Merci'
  },
  nl: {
    greeting: 'Hallo',
    farewell: 'Vaarwel',
    thankYou: 'Dank je'
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
