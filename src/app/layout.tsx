import '../styles/globals.scss';
import '../styles/globals.css';

import React from 'react';

import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import RootProvider from '@/components/providers/root';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production' ? 'https://wingman.dev' : 'http://localhost:3000'
  ),
  title: {
    template: '%s | Wingman - Digital Talent Platform',
    default: 'Wingman - Find Vetted Digital Experts in 48 Hours | Benelux Freelancer Platform'
  },
  description:
    'Connect with 650+ pre-screened digital experts across the Benelux. From e-commerce specialists to marketing automation experts - find your perfect match in 48 hours with dedicated Success Manager support.',
  keywords: [
    'digital freelancers',
    'benelux talent',
    'e-commerce specialists',
    'marketing automation',
    'vetted experts',
    'freelancer platform',
    'digital talent',
    'netherlands freelancers',
    'belgium freelancers',
    'luxembourg freelancers',
    'success manager',
    'pre-screened talent'
  ],
  authors: [{ name: 'Wingman Team' }],
  creator: 'Wingman',
  publisher: 'Wingman',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://wingman.dev',
    languages: {
      en: 'https://wingman.dev/en',
      fr: 'https://wingman.dev/fr',
      nl: 'https://wingman.dev/nl'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['nl_NL', 'fr_FR'],
    url: 'https://wingman.dev',
    siteName: 'Wingman',
    title: 'Wingman - Find Vetted Digital Experts in 48 Hours',
    description:
      'Connect with 650+ pre-screened digital experts across the Benelux. Find your perfect freelancer match in 48 hours.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wingman - Digital Talent Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WingmanDev',
    creator: '@WingmanDev',
    title: 'Wingman - Find Vetted Digital Experts in 48 Hours',
    description: 'Connect with 650+ pre-screened digital experts across the Benelux.',
    images: ['/twitter-image.jpg']
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' }
    ],
    other: [
      { rel: 'icon', url: '/android-icon-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/android-icon-512x512.png', sizes: '512x512' }
    ]
  },
  manifest: '/site.webmanifest',
  category: 'business'
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

type TRootLayout = PropsWithChildren;

export default async function RootLayout({ children }: Readonly<TRootLayout>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Wingman',
              description:
                'Digital talent platform connecting businesses with vetted freelancers across the Benelux region.',
              url: 'https://wingman.dev',
              logo: 'https://wingman.dev/logo.png',
              foundingDate: '2023',
              founders: [
                {
                  '@type': 'Person',
                  name: 'Wingman Team'
                }
              ],
              areaServed: ['Netherlands', 'Belgium', 'Luxembourg'],
              serviceType: 'Digital Talent Matching',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NL',
                addressRegion: 'Netherlands'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English', 'Dutch', 'French']
              },
              sameAs: ['https://linkedin.com/company/wingman-dev', 'https://twitter.com/wingmandev']
            })
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RootProvider>{children}</RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
