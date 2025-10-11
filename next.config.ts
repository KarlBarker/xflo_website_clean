import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle optimization
  compiler: {
    // Temporarily disabled to debug staging issues
    // removeConsole: process.env.NODE_ENV === 'production',
    removeConsole: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3001', 
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xflocms.vercel.app',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  eslint: {
    // Allow production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  async headers() {
    const adminOrigin = process.env.CMS_ADMIN_ORIGIN || 'http://localhost:3001';
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          // Edits to allow GTM and Live Preview in the CMS
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://consent.cookiebot.com https://consentcdn.cookiebot.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob: http://localhost:3001 https://www.googletagmanager.com https://www.google-analytics.com; media-src 'self' https: blob: http://localhost:3001; font-src 'self' data:; connect-src 'self' https: wss: http://localhost:3001 https://www.googletagmanager.com https://www.google-analytics.com https://consent.cookiebot.com https://consentcdn.cookiebot.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://staging-api.xflo.ai https://api.xflo.ai https://www.googletagmanager.com https://consentcdn.cookiebot.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' ${adminOrigin};`
              : `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://consent.cookiebot.com https://consentcdn.cookiebot.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob: https://www.googletagmanager.com https://www.google-analytics.com; media-src 'self' https: blob:; font-src 'self' data:; connect-src 'self' https: wss: https://www.googletagmanager.com https://www.google-analytics.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://staging-api.xflo.ai https://api.xflo.ai https://www.googletagmanager.com https://consentcdn.cookiebot.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' ${adminOrigin};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
