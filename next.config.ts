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

  eslint: {
    // 🚫 Don't run ESLint during builds
    ignoreDuringBuilds: true
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@heroui/react', '@iconify/react', 'framer-motion']
  },

  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Tree shake framer-motion
    config.module.rules.push({
      test: /node_modules\/framer-motion/,
      sideEffects: false,
    });
    
    return config;
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
      },
      {
        protocol: 'https' as const,
        hostname: 'flagcdn.com'
      }
    ],
    // Performance optimizations for slow external images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Add timeout handling
    unoptimized: false,
    loader: 'default',
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    }
  }
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
