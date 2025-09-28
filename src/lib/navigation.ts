import { NavigationData, defaultNavigationData, defaultMegaMenuData } from '@/types/navigation';

// Footer types and defaults
export interface FooterData {
  logo?: {
    url: string;
    alt?: string;
  };
  companyDescription: string;
  columns: {
    title: string;
    links: {
      label: string;
      href: string;
    }[];
  }[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  copyrightText: string;
}

const defaultFooterData: FooterData = {
  companyDescription: 'Digital changes fast. We help businesses stay ahead with smarter strategies, better systems, and clear priorities.',
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Insights', href: '/insights' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Digital Marketing', href: '/solutions/digital-marketing' },
        { label: 'RevOps', href: '/solutions/revops' },
        { label: 'Technology', href: '/solutions/technology' },
        { label: 'Results', href: '/solutions/results' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ],
  socialLinks: {
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  },
  copyrightText: 'XFlo Digital. All rights reserved.',
};

import { API_CONFIG } from '@/config/constants';

/**
 * Fetch navigation data from Payload CMS
 * Falls back to default navigation if fetch fails
 */
export async function getNavigationData(): Promise<NavigationData> {
  // For now, return default data until Payload CMS navigation is set up
  // This ensures the navigation displays immediately
  try {
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/globals/navigation`, {
      next: process.env.NODE_ENV === 'development' ? { 
        revalidate: 0 // No cache in development for immediate updates
      } : { 
        revalidate: 3600, // Cache for 1 hour in production
        tags: ['navigation'] 
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.warn('Failed to fetch navigation data from CMS, using defaults');
      return {
        ...defaultNavigationData,
        megaMenuData: defaultMegaMenuData,
      };
    }

    const data = await response.json();
    
    // Validate the data structure
    if (!data) {
      console.warn('Invalid navigation data structure from CMS, using defaults');
      return {
        ...defaultNavigationData,
        megaMenuData: defaultMegaMenuData,
      };
    }

    // Map CMS field names to frontend structure
    const mainMenuItems = (data.mainNavigation || []).map((item: {
      label?: string;
      title?: string;
      href: string;
      description?: string;
      children?: unknown[];
    }) => ({
      title: item.label || item.title || '',
      href: item.href,
      description: item.description,
      children: item.children
    }));

    // Map mobile navigation separately
    const mobileMenuItems = (data.mobileNavigation || []).map((item: {
      label?: string;
      title?: string;
      href: string;
      description?: string;
      children?: unknown[];
    }) => ({
      title: item.label || item.title || '',
      href: item.href,
      description: item.description,
      children: item.children
    }));

    const ctaButton = data.cta ? {
      text: data.cta.label,
      href: data.cta.href,
      variant: data.cta.style || 'outline'
    } : defaultNavigationData.ctaButton;

    const megaMenuData = data.useMegaMenu && data.megaMenuSections ? {
      sections: (data.megaMenuSections || []).map((section: {
        title: string;
        href: string;
        links?: {
          label?: string;
          title?: string;
          href: string;
          isActive?: boolean;
        }[];
      }) => ({
        title: section.title,
        href: section.href,
        links: (section.links || []).map((link) => ({
          title: link.label || link.title || '',
          href: link.href.startsWith('/') ? link.href : `/${link.href}`,
          isActive: link.isActive || false
        }))
      })),
      ctaSection: data.megaMenuCTA ? {
        primaryButton: {
          text: data.megaMenuCTA.buttonText,
          href: data.megaMenuCTA.buttonUrl
        },
        phoneNumber: {
          display: data.megaMenuCTA.phoneDisplay,
          href: data.megaMenuCTA.phoneUrl
        }
      } : defaultMegaMenuData.ctaSection
    } : defaultMegaMenuData;

    return {
      mainMenuItems,
      mobileMenuItems,
      ctaButton,
      settings: {
        showLogo: data.showLogo ?? defaultNavigationData.settings.showLogo,
        enableStickyNavigation: data.enableStickyNavigation ?? defaultNavigationData.settings.enableStickyNavigation,
        useMegaMenu: data.useMegaMenu ?? defaultNavigationData.settings.useMegaMenu,
      },
      megaMenuData,
    };
  } catch (error) {
    console.warn('Error fetching navigation data, using defaults:', error instanceof Error ? error.message : 'Unknown error');
    return {
      ...defaultNavigationData,
      mobileMenuItems: defaultNavigationData.mainMenuItems,
      megaMenuData: defaultMegaMenuData,
    };
  }
}

/**
 * Fetch footer data from Payload CMS
 * Falls back to default footer if fetch fails
 */
export async function getFooterData(): Promise<FooterData> {
  try {
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/globals/footer`, {
      next: { 
        revalidate: 3600, // Cache for 1 hour
        tags: ['footer'] 
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.warn('Failed to fetch footer data from CMS, using defaults');
      return defaultFooterData;
    }

    const data = await response.json();
    
    // Validate the data structure
    if (!data) {
      console.warn('Invalid footer data structure from CMS, using defaults');
      return defaultFooterData;
    }

    return {
      logo: data.logo ? {
        url: data.logo.url || '/xflo_logo_strapline.svg',
        alt: data.logo.alt || 'XFlo Digital Logo'
      } : undefined,
      companyDescription: data.companyDescription || defaultFooterData.companyDescription,
      columns: data.columns || defaultFooterData.columns,
      socialLinks: data.socialLinks || defaultFooterData.socialLinks,
      copyrightText: data.copyrightText || defaultFooterData.copyrightText,
    };
  } catch (error) {
    console.warn('Error fetching footer data, using defaults:', error instanceof Error ? error.message : 'Unknown error');
    return defaultFooterData;
  }
}

/**
 * Revalidate navigation cache (useful for webhook integration)
 */
export async function revalidateNavigation() {
  try {
    await fetch('/api/revalidate?tag=navigation', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error revalidating navigation cache:', error);
  }
}

/**
 * Force refresh navigation data (bypass cache)
 */
export async function getNavigationDataFresh(): Promise<NavigationData> {
  try {
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/globals/navigation`, {
      cache: 'no-store', // Force fresh data
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.warn('Failed to fetch fresh navigation data from CMS, using defaults');
      return {
        ...defaultNavigationData,
        megaMenuData: defaultMegaMenuData,
      };
    }

    const data = await response.json();
    
    if (!data) {
      console.warn('Invalid fresh navigation data structure from CMS, using defaults');
      return {
        ...defaultNavigationData,
        megaMenuData: defaultMegaMenuData,
      };
    }

    // Map CMS field names to frontend structure (same logic as cached version)
    const mainMenuItems = (data.mainNavigation || []).map((item: {
      label?: string;
      title?: string;
      href: string;
      description?: string;
      children?: unknown[];
    }) => ({
      title: item.label || item.title || '',
      href: item.href,
      description: item.description,
      children: item.children
    }));

    // Map mobile navigation separately
    const mobileMenuItems = (data.mobileNavigation || []).map((item: {
      label?: string;
      title?: string;
      href: string;
      description?: string;
      children?: unknown[];
    }) => ({
      title: item.label || item.title || '',
      href: item.href,
      description: item.description,
      children: item.children
    }));

    const ctaButton = data.cta ? {
      text: data.cta.label,
      href: data.cta.href,
      variant: data.cta.style || 'outline'
    } : defaultNavigationData.ctaButton;

    const megaMenuData = data.useMegaMenu && data.megaMenuSections ? {
      sections: (data.megaMenuSections || []).map((section: {
        title: string;
        href: string;
        links?: {
          label?: string;
          title?: string;
          href: string;
          isActive?: boolean;
        }[];
      }) => ({
        title: section.title,
        href: section.href,
        links: (section.links || []).map((link) => ({
          title: link.label || link.title || '',
          href: link.href.startsWith('/') ? link.href : `/${link.href}`,
          isActive: link.isActive || false
        }))
      })),
      ctaSection: data.megaMenuCTA ? {
        primaryButton: {
          text: data.megaMenuCTA.buttonText,
          href: data.megaMenuCTA.buttonUrl
        },
        phoneNumber: {
          display: data.megaMenuCTA.phoneDisplay,
          href: data.megaMenuCTA.phoneUrl
        }
      } : defaultMegaMenuData.ctaSection
    } : defaultMegaMenuData;

    return {
      mainMenuItems,
      mobileMenuItems,
      ctaButton,
      settings: {
        showLogo: data.showLogo ?? defaultNavigationData.settings.showLogo,
        enableStickyNavigation: data.enableStickyNavigation ?? defaultNavigationData.settings.enableStickyNavigation,
        useMegaMenu: data.useMegaMenu ?? defaultNavigationData.settings.useMegaMenu,
      },
      megaMenuData,
    };
  } catch (error) {
    console.warn('Error fetching fresh navigation data, using defaults:', error instanceof Error ? error.message : 'Unknown error');
    return {
      ...defaultNavigationData,
      mobileMenuItems: defaultNavigationData.mainMenuItems,
      megaMenuData: defaultMegaMenuData,
    };
  }
}

/**
 * Revalidate footer cache (useful for webhook integration)
 */
export async function revalidateFooter() {
  try {
    await fetch('/api/revalidate?tag=footer', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error revalidating footer cache:', error);
  }
}