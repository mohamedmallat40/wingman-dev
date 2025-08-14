// Basic SEO types to replace next-seo dependency
interface OpenGraphMedia {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

interface OpenGraph {
  type?: string;
  locale?: string;
  url?: string;
  siteName?: string;
  title?: string;
  description?: string;
  images?: OpenGraphMedia[];
}

interface Twitter {
  handle?: string;
  site?: string;
  cardType?: string;
}

interface AdditionalMetaTag {
  name?: string;
  httpEquiv?: string;
  content: string;
}

interface AdditionalLinkTag {
  rel: string;
  href: string;
  sizes?: string;
}

interface DefaultSeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: OpenGraph;
  twitter?: Twitter;
  additionalMetaTags?: AdditionalMetaTag[];
  additionalLinkTags?: AdditionalLinkTag[];
}

export const defaultSEO: DefaultSeoProps = {
  title: 'Wingman by ExtraExpertise - Vetted Digital Experts in 48h',
  description:
    'Connect with 650+ pre-screened digital experts across the Benelux. From e-commerce specialists to marketing automation experts - find your perfect match in 48 hours with dedicated Success Manager support.',
  canonical: 'https://wingman.dev',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wingman.dev',
    siteName: 'Wingman',
    title: 'Wingman - Find Vetted Digital Experts in 48 Hours',
    description:
      'Connect with 650+ pre-screened digital experts across the Benelux. Find your perfect freelancer match in 48 hours.',
    images: [
      {
        url: 'https://wingman.dev/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wingman - Digital Talent Platform',
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    handle: '@WingmanDev',
    site: '@WingmanDev',
    cardType: 'summary_large_image'
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      name: 'robots',
      content: 'index,follow'
    },
    {
      name: 'googlebot',
      content: 'index,follow'
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico'
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '76x76'
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest'
    }
  ]
};

// Locale-specific SEO configurations
export const getLocaleSEO = (locale: string): Partial<DefaultSeoProps> => {
  const localeConfigs = {
    en: {
      title: 'Wingman by ExtraExpertise - Vetted Digital Experts in 48h',
      description:
        'Connect with 650+ pre-screened digital experts across the Benelux. From e-commerce specialists to marketing automation experts - find your perfect match in 48 hours.',
      openGraph: {
        locale: 'en_US'
      }
    },
    nl: {
      title: 'Wingman by ExtraExpertise - Geverifieerde Digitale Experts in 48u',
      description:
        'Verbind met 650+ vooraf gescreende digitale experts in de Benelux. Van e-commerce specialisten tot marketing automation experts - vind je perfecte match in 48 uur.',
      openGraph: {
        locale: 'nl_NL'
      }
    },
    fr: {
      title: 'Wingman by ExtraExpertise - Experts Numériques Vérifiés en 48h',
      description:
        'Connectez-vous avec plus de 650 experts numériques présélectionnés dans le Benelux. Des spécialistes e-commerce aux experts en automatisation marketing - trouvez votre match parfait en 48 heures.',
      openGraph: {
        locale: 'fr_FR'
      }
    }
  };

  return localeConfigs[locale as keyof typeof localeConfigs] || localeConfigs.en;
};

// Structured Data Schemas
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Wingman by ExtraExpertise',
  description:
    'Digital talent platform connecting businesses with vetted freelancers across the Benelux region.',
  url: 'https://wingman.dev',
  logo: 'https://wingman.dev/logo.png',
  foundingDate: '2023',
  founders: [
    {
      '@type': 'Person',
      name: 'ExtraExpertise Team'
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
});

export const getProductSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Wingman Digital Talent Matching',
  description:
    'Professional digital talent matching service connecting businesses with pre-screened freelancers.',
  brand: {
    '@type': 'Brand',
    name: 'Wingman'
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter Plan',
      description: 'Perfect for small businesses getting started',
      price: '99',
      priceCurrency: 'EUR',
      billingDuration: 'P1M',
      availability: 'https://schema.org/InStock'
    },
    {
      '@type': 'Offer',
      name: 'Professional Plan',
      description: 'Ideal for growing companies with regular projects',
      price: '199',
      priceCurrency: 'EUR',
      billingDuration: 'P1M',
      availability: 'https://schema.org/InStock'
    },
    {
      '@type': 'Offer',
      name: 'Enterprise Plan',
      description: 'Custom solutions for large organizations',
      price: 'Contact for pricing',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock'
    }
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '250',
    bestRating: '5'
  }
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});
