/**
 * Centralized application constants
 * Single source of truth for all configuration values
 */

// API Configuration
export const API_CONFIG = {
  PAYLOAD_URL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://xflocms.vercel.app/api',
  XFLO_URL: process.env.NEXT_PUBLIC_XFLO_API_URL || 'https://api.xflo.ai',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://xflo.agency',
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET || ''
} as const;

// Development Configuration
export const DEV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  DEFAULT_DEV_PORT: 3002,
  DEFAULT_CMS_PORT: 3001
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_REVALIDATE: 60, // 1 minute
  PAGE_REVALIDATE: 3600,  // 1 hour
  CASE_STUDY_REVALIDATE: 1800, // 30 minutes
  NAVIGATION_REVALIDATE: 300    // 5 minutes
} as const;

// UI Configuration
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  CONTAINER_MAX_WIDTH: 1500,
  INNER_MAX_WIDTH: 1180,
  DEFAULT_SPACING: {
    SECTION: 96,    // py-24
    COMPONENT: 48,  // gap-12
    ELEMENT: 24,    // gap-6
    TIGHT: 8        // gap-2
  }
} as const;