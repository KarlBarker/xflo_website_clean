export interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
}

export interface CTAButton {
  text: string;
  href: string;
  variant: 'outline' | 'default' | 'ghost';
}

export interface NavigationSettings {
  showLogo: boolean;
  enableStickyNavigation: boolean;
  useMegaMenu?: boolean;
}

export interface MegaMenuLink {
  title: string;
  href: string;
  isActive?: boolean;
}

export interface MegaMenuSection {
  title: string;
  href: string;
  links: MegaMenuLink[];
}

export interface MegaMenuCTASection {
  primaryButton: {
    text: string;
    href: string;
  };
  phoneNumber: {
    display: string;
    href: string;
  };
}

export interface MegaMenuData {
  sections: MegaMenuSection[];
  ctaSection: MegaMenuCTASection;
}

export interface NavigationData {
  mainMenuItems: NavigationItem[];
  mobileMenuItems?: NavigationItem[];
  ctaButton: CTAButton;
  settings: NavigationSettings;
  megaMenuData?: MegaMenuData;
}

// Default navigation data for fallback
export const defaultNavigationData: NavigationData = {
  mainMenuItems: [
    {
      title: 'Growth Marketing',
      href: '/growth-marketing',
    },
    {
      title: 'RevOps',
      href: '/case-studies/category/revops',
    },
    {
      title: 'Technology',
      href: '/case-studies/category/technology',
    },
    {
      title: 'Results',
      href: '/results',
    },
    {
      title: 'Insights',
      href: '/insights',
    },
  ],
  ctaButton: {
    text: 'Get In Touch',
    href: '/contact',
    variant: 'outline',
  },
  settings: {
    showLogo: true,
    enableStickyNavigation: true,
    useMegaMenu: false,
  },
};

// Default mega menu data for fallback
export const defaultMegaMenuData: MegaMenuData = {
  sections: [
    {
      title: "Growth Marketing",
      href: "/growth-marketing",
      links: [
        { title: "Growth Strategy", href: "/growth-marketing/growth-strategy", isActive: true },
        { title: "Brand & Creative", href: "/growth-marketing/brand-and-creative" },
        { title: "Content Creation", href: "/growth-marketing/content-creation" },
        { title: "Google Ads & Shopping", href: "/growth-marketing/google-ads-shopping" },
        { title: "SEO", href: "/growth-marketing/seo" },
        { title: "Marketplace Success", href: "/growth-marketing/marketplace-success" },
        { title: "Analytics", href: "/growth-marketing/analytics" },
      ]
    },
    {
      title: "RevOps",
      href: "/revops",
      links: [
        { title: "Growth Consulting", href: "/revops/growth-consulting" },
        { title: "GTM Alignment", href: "/revops/gtm-alignment" },
        { title: "Prospect Intelligence", href: "/revops/prospect-intelligence" },
        { title: "Brand Visibility", href: "/revops/brand-visibility" },
        { title: "Demand Generation", href: "/revops/demand-generation" },
        { title: "Sales Enablement", href: "/revops/sales-enablement" },
        { title: "Lead Generation", href: "/revops/lead-generation" },
      ]
    },
    {
      title: "Technology",
      href: "/technology",
      links: [
        { title: "Digital Transformation", href: "/technology/digital-transformation" },
        { title: "UX/UI Design", href: "/technology/ux-ui-design" },
        { title: "eCommerce Development", href: "/technology/ecommerce-development" },
        { title: "Website Development", href: "/technology/website-development" },
        { title: "Web & Mobile Apps", href: "/technology/web-mobile-apps" },
        { title: "Complex Integrations", href: "/technology/complex-integrations" },
        { title: "AI Development", href: "/technology/ai-development" },
      ]
    },
    {
      title: "Company",
      href: "/company",
      links: [
        { title: "Results", href: "/company/results" },
        { title: "Insights", href: "/company/insights" },
        { title: "Careers", href: "/company/careers" },
      ]
    },
    {
      title: "Specialisms",
      href: "/specialisms",
      links: [
        { title: "B2B", href: "/specialisms/b2b" },
        { title: "D2C", href: "/specialisms/d2c" },
      ]
    },
    {
      title: "Partners",
      href: "/partners",
      links: [
        { title: "Platforms", href: "/partners/platforms" },
        { title: "Technologies", href: "/partners/technologies" },
      ]
    }
  ],
  ctaSection: {
    primaryButton: {
      text: "Get in touch",
      href: "/contact"
    },
    phoneNumber: {
      display: "+44 (0) 1244 567560",
      href: "tel:+441244567560"
    }
  }
};