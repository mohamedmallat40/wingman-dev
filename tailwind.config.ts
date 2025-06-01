import type { Config } from 'tailwindcss';

import { heroui } from '@heroui/theme';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/components/**/*.{js,ts,jsx,tsx}'
  ],
  plugins: [heroui({
    themes:{
      light:{
        colors:{
          primary: {
            50:  '#fff5f5',
            100: '#ffe3e3',
            200: '#ffc9c9',
            300: '#ffa8a8',
            400: '#ff8787',
            500: '#ff6b6b',
            600: '#fa5252', 
            700: '#f03e3e',
            800: '#e03131',
            900: '#c92a2a',
            foreground: '#ffffff',
            DEFAULT: '#fa5252',
          }
        }
      },
      dark:{
        colors:{
          primary: {
            50:  '#fff5f5',
            100: '#ffe3e3',
            200: '#ffc9c9',
            300: '#ffa8a8',
            400: '#ff8787',
            500: '#ff6b6b',
            600: '#fa5252', 
            700: '#f03e3e',
            800: '#e03131',
            900: '#c92a2a',
            foreground: '#ffffff',
            DEFAULT: '#fa5252',
          }
        }
      }
    }
  })]
} satisfies Config;
