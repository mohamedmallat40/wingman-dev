import type { Config } from 'tailwindcss';

import { heroui } from '@heroui/theme';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        strong: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      ringColor: {
        DEFAULT: '#3b82f6',
        dark: '#2563eb'
      }
    }
  },
  plugins: [
    heroui({
      addCommonColors: true,
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      layout: {
        fontSize: {
          tiny: '0.75rem',
          small: '0.875rem',
          medium: '1rem',
          large: '1.125rem'
        },
        lineHeight: {
          tiny: '1rem',
          small: '1.25rem',
          medium: '1.5rem',
          large: '1.75rem'
        },
        radius: {
          small: '6px',
          medium: '10px',
          large: '14px'
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px'
        },
        boxShadow: {
          small: '0 1px 2px 0 rgba(0, 0, 0, 0.04)'
        }
      },
      themes: {
        light: {
          layout: {
            hoverOpacity: 0.8,
            boxShadow: {
              small: '0 2px 12px 0 rgba(0, 0, 0, 0.08)',
              medium: '0 4px 20px 0 rgba(0, 0, 0, 0.12)',
              large: '0 8px 30px 0 rgba(0, 0, 0, 0.15)'
            }
          },
          colors: {
            background: {
              DEFAULT: '#ffffff',
              50: '#fafafa',
              100: '#f5f5f5',
              200: '#e5e5e5'
            },
            foreground: {
              50: '#f8f9fa',
              100: '#f1f3f4',
              200: '#e8eaed',
              300: '#dadce0',
              400: '#bdc1c6',
              500: '#9aa0a6',
              600: '#80868b',
              700: '#5f6368',
              800: '#3c4043',
              900: '#202124',
              DEFAULT: '#202124'
            },
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              DEFAULT: '#3b82f6',
              foreground: '#ffffff'
            },
            secondary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
              DEFAULT: '#0ea5e9',
              foreground: '#ffffff'
            },
            success: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
              DEFAULT: '#22c55e',
              foreground: '#ffffff'
            },
            warning: {
              50: '#fffbeb',
              100: '#fef3c7',
              200: '#fde68a',
              300: '#fcd34d',
              400: '#fbbf24',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
              900: '#78350f',
              DEFAULT: '#f59e0b',
              foreground: '#ffffff'
            },
            danger: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
              DEFAULT: '#ef4444',
              foreground: '#ffffff'
            },
            default: {
              50: '#fafafa',
              100: '#f4f4f5',
              200: '#e4e4e7',
              300: '#d4d4d8',
              400: '#a1a1aa',
              500: '#71717a',
              600: '#52525b',
              700: '#3f3f46',
              800: '#27272a',
              900: '#18181b',
              DEFAULT: '#71717a',
              foreground: '#ffffff'
            }
          }
        },
        dark: {
          layout: {
            hoverOpacity: 0.9,
            boxShadow: {
              small: '0 2px 12px 0 rgba(0, 0, 0, 0.25)',
              medium: '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
              large: '0 8px 30px 0 rgba(0, 0, 0, 0.45)'
            }
          },
          colors: {
            background: {
              DEFAULT: '#18181b',
              50: '#1f1f23',
              100: '#27272a',
              200: '#3f3f46'
            },
            foreground: {
              50: '#1f1f23',
              100: '#27272a',
              200: '#3f3f46',
              300: '#52525b',
              400: '#71717a',
              500: '#a1a1aa',
              600: '#d4d4d8',
              700: '#e4e4e7',
              800: '#f4f4f5',
              900: '#fafafa',
              DEFAULT: '#e4e4e7'
            },
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
              DEFAULT: '#3b82f6',
              foreground: '#ffffff'
            },
            secondary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
              DEFAULT: '#0ea5e9',
              foreground: '#ffffff'
            },
            success: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
              DEFAULT: '#22c55e',
              foreground: '#000000'
            },
            warning: {
              50: '#fffbeb',
              100: '#fef3c7',
              200: '#fde68a',
              300: '#fcd34d',
              400: '#fbbf24',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
              900: '#78350f',
              DEFAULT: '#f59e0b',
              foreground: '#000000'
            },
            danger: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
              DEFAULT: '#ef4444',
              foreground: '#ffffff'
            },
            default: {
              50: '#1f1f23',
              100: '#27272a',
              200: '#3f3f46',
              300: '#52525b',
              400: '#71717a',
              500: '#a1a1aa',
              600: '#d4d4d8',
              700: '#e4e4e7',
              800: '#f4f4f5',
              900: '#fafafa',
              DEFAULT: '#3f3f46',
              foreground: '#fafafa'
            }
          }
        }
      }
    })
  ]
} satisfies Config;
