/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import './src/env.js';

import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'app.extraexpertise.be',
        pathname: '/api/upload/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'dev.extraexpertise.be',
        pathname: '/api/upload/**'
      },
      {
        protocol: 'https' as const,
        hostname: 'i.pravatar.cc'
      },
      {
        protocol: 'https' as const,
        hostname: 'nextuipro.nyc3.cdn.digitaloceanspaces.com'
      },
      {
        protocol: 'https' as const,
        hostname: 'eu2.contabostorage.com',
        pathname: '/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/**'
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
