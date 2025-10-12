// Payload CMS API integration
// This connects to Payload CMS running on port 3001
import type { LexicalContent } from '@/types/lexical';
import { API_CONFIG, CACHE_CONFIG } from '@/config/constants';
import { logAPIError } from '@/lib/error-logger';

export interface PayloadResponse<T = unknown> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadSingleResponse<T = unknown> {
  doc: T;
}

// Generic fetch function for Payload API
async function payloadFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.PAYLOAD_URL}${endpoint}`;
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: CACHE_CONFIG.DEFAULT_REVALIDATE },
      ...options,
    });

    const duration = performance.now() - startTime;

    if (!response.ok) {
      const error = new Error(`Payload API error: ${response.status} ${response.statusText}`);
      logAPIError(error, endpoint, {
        duration: `${duration.toFixed(2)}ms`,
        status: response.status,
        statusText: response.statusText,
        url
      });
      
      // Provide more specific empty structures based on endpoint
      if (endpoint.includes('/case-studies')) {
        return { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false, pagingCounter: 0, prevPage: null, nextPage: null } as T;
      }
      
      // Default empty structure
      return { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false } as T;
    }

    const data = await response.json();
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`CMS fetch completed: ${endpoint} (${duration.toFixed(2)}ms)`);
    }

    return data;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`Failed to fetch from Payload: ${url}`, {
      endpoint,
      duration: `${duration.toFixed(2)}ms`,
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Provide fallback data instead of empty structure for critical endpoints
    if (endpoint.includes('/case-studies')) {
      return { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false, pagingCounter: 0, prevPage: null, nextPage: null } as T;
    }
    
    // For navigation/footer data, provide reasonable defaults
    if (endpoint.includes('/globals/')) {
      return getDefaultGlobalData(endpoint) as T;
    }
    
    return { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false } as T;
  }
}

// Case Studies API
export interface CaseStudyQueryParams {
  limit?: number;
  page?: number;
  where?: Record<string, unknown>;
  depth?: number;
}

export async function getCaseStudies(params?: CaseStudyQueryParams): Promise<PayloadResponse<CaseStudy>> {
  const searchParams = new URLSearchParams();
  
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.depth) searchParams.set('depth', params.depth.toString());
  
  // Convert where object to Payload's bracket notation format
  if (params?.where) {
    Object.entries(params.where).forEach(([field, condition]) => {
      if (typeof condition === 'object' && condition !== null) {
        Object.entries(condition).forEach(([operator, value]) => {
          searchParams.set(`where[${field}][${operator}]`, String(value));
        });
      } else {
        searchParams.set(`where[${field}]`, String(condition));
      }
    });
  }
  
  const query = searchParams.toString();
  const endpoint = `/case-studies${query ? `?${query}` : ''}`;
  
  return payloadFetch<PayloadResponse<CaseStudy>>(endpoint);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    // Use proper Payload query format with bracket notation and depth for relations
    const response = await getCaseStudies({
      where: {
        slug: { equals: slug }
      },
      limit: 1,
      depth: 3 // Depth=3 required for nested blocks with media relationships
    });
    
    return response.docs[0] || null;
  } catch (error) {
    console.error(`Failed to fetch case study with slug: ${slug}`, error);
    return null;
  }
}

export async function getCaseStudiesForGallery(excludeId?: string, limit: number = 6): Promise<CaseStudy[]> {
  try {
    const where: Record<string, unknown> = {
      status: { equals: 'published' }
    };

    if (excludeId) {
      where.id = { not_equals: excludeId };
    }

    const response = await getCaseStudies({
      where,
      limit,
      depth: 3 // Depth=3 required for nested blocks with media relationships
    });
    
    return response.docs;
  } catch (error) {
    console.error('Failed to fetch case studies for gallery', error);
    return [];
  }
}

export async function getCaseStudiesForBento(limit?: number): Promise<CaseStudy[]> {
  try {
    const response = await getCaseStudies({
      where: {
        status: { equals: 'published' }
      },
      limit: limit || 100, // Default to large number if no limit
      depth: 3 // Depth=3 required for nested blocks with media relationships
    });
    
    return response.docs;
  } catch (error) {
    console.error('Failed to fetch case studies for bento grid', error);
    return [];
  }
}

// Categories API
export async function getCaseStudyCategories(): Promise<PayloadResponse<CaseStudyCategory>> {
  try {
    return await payloadFetch<PayloadResponse<CaseStudyCategory>>('/case-study-categories');
  } catch {
    console.warn('Case study categories collection not found, returning empty result');
    return { docs: [], totalDocs: 0, limit: 0, totalPages: 0, page: 1, pagingCounter: 0, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null };
  }
}

export async function getCategoryBySlug(slug: string): Promise<CaseStudyCategory | null> {
  try {
    const response = await payloadFetch<PayloadResponse<CaseStudyCategory>>(
      `/case-study-categories?where[slug][equals]=${slug}&limit=1`
    );
    
    return response.docs[0] || null;
  } catch (error) {
    console.error(`Failed to fetch category with slug: ${slug}`, error);
    return null;
  }
}

// Clients API
export async function getClients(): Promise<PayloadResponse<Client>> {
  return payloadFetch<PayloadResponse<Client>>('/clients');
}

// Results Gallery API
export async function getResultsGallery(): Promise<ResultsGallery | null> {
  try {
    const response = await payloadFetch<PayloadResponse<ResultsGallery>>('/results-gallery?limit=1');
    return response.docs[0] || null;
  } catch (err) {
    console.error('Failed to fetch results gallery', err);
    return null;
  }
}

// Fetch media by ID when relationship wasn't populated
export async function fetchMediaById(id: number | string): Promise<Media | null> {
  try {
    const response = await payloadFetch<Media>(`/media/${id}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch media with ID: ${id}`, error);
    return null;
  }
}

// Media API helpers
export function getMediaUrl(media: Media | string | number | null | undefined): string {
  // Handle null/undefined media
  if (!media) {
    return '/placeholder-image.jpg'; // Return placeholder instead of empty string
  }

  // Handle numeric ID - CMS didn't populate the relationship
  // We can't fetch it here (this is a sync function), so return placeholder
  // The dynamic-page component should handle this by fetching the media separately
  if (typeof media === 'number') {
    console.warn(`⚠️ Media relationship not populated, got ID: ${media}. Use fetchMediaById() to get the URL.`);
    return '/placeholder-image.jpg';
  }

  // Base URL without /api since media URLs include it
  const baseUrl = API_CONFIG.PAYLOAD_URL.replace('/api', '');

  if (typeof media === 'string') {
    // Clean any newlines from the URL
    const cleanUrl = media.replace(/\n/g, '').trim();
    return cleanUrl.startsWith('http') ? cleanUrl : `${baseUrl}${cleanUrl}`;
  }

  if (media?.url) {
    // Clean any newlines from the URL
    const cleanUrl = media.url.replace(/\n/g, '').trim();
    if (cleanUrl.startsWith('http')) {
      return cleanUrl;
    }
    // Media URLs from CMS start with /api/media/file/
    const finalUrl = `${baseUrl}${cleanUrl}`;
    return finalUrl;
  }

  return '/placeholder-image.jpg'; // Return placeholder instead of empty string
}

// Helper function to provide default global data for fallbacks
function getDefaultGlobalData(endpoint: string): unknown {
  if (endpoint.includes('navigation')) {
    return {
      mainNavigation: {
        links: [
          { label: 'Home', href: '/' },
          { label: 'Case Studies', href: '/case-studies' },
          { label: 'Results', href: '/results' }
        ]
      }
    };
  }
  
  if (endpoint.includes('footer')) {
    return {
      companyDescription: 'We create digital experiences that drive results.',
      columns: [],
      socialLinks: {},
      copyrightText: 'All rights reserved.'
    };
  }
  
  return {};
}

export function getResponsiveImageUrls(media: Media): {
  desktop: string;
  mobile?: string;
  alt: string;
} {
  const baseUrl = getMediaUrl(media);
  
  return {
    desktop: media.sizes?.desktop?.url || baseUrl,
    mobile: media.sizes?.mobile?.url,
    alt: media.alt || 'Image',
  };
}

// TypeScript interfaces for Payload collections
export interface Media {
  id: string;
  alt: string;
  caption?: string;
  credit?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  url: string;
  sizes?: {
    thumbnail?: { url: string; width: number; height: number; };
    mobile?: { url: string; width: number; height: number; };
    desktop?: { url: string; width: number; height: number; };
    hero?: { url: string; width: number; height: number; };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  logo: Media;
  industry?: string;
  description?: string;
  website?: string;
  primaryColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyCategory {
  id: string;
  name: string;
  slug: string;
  description?: LexicalContent;
  heroImage?: Media;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: Client;
  status: 'draft' | 'published';
  tenant_id: string;
  aspectRatio?: '16:9' | '1:1' | '4:3';
  showAsVideo?: boolean;
  resultsVideo?: Media;
  resultsImage?: Media;
  
  // Flexible layout blocks
  layout: Array<CaseStudyBlock>;
  
  // SEO
  seo?: {
    title?: string;
    description?: string;
    image?: Media;
  };
  
  // Legacy fields for backward compatibility
  hero?: {
    title: string;
    backgroundImage: Media;
  };
  introduction?: {
    beforeHighlight?: string;
    highlightedText: string;
    afterHighlight?: string;
    text?: string;
  };
  companyIntro?: LexicalContent;
  painPoints?: {
    title?: string;
    points: Array<{ point: string; id?: string; }>;
  };
  contentSections?: Array<{
    title: string;
    content: LexicalContent;
    backgroundColor: 'white' | 'tertiary';
    id?: string;
  }>;
  imageShowcases?: Array<{
    image: Media;
    mobileImage?: Media;
    caption?: string;
    displayType: 'split' | 'dual' | 'full';
    id?: string;
  }>;
  quotes?: Array<{
    text: string;
    author?: string;
    company?: string;
    type: 'standard' | 'featured';
    id?: string;
  }>;
  statistics?: {
    title?: string;
    stats: Array<{
      percentage: string;
      description: string;
      color: 'primary' | 'secondary';
      id?: string;
    }>;
  };
  featuredVideo?: Media;
  
  createdAt: string;
  updatedAt: string;
}

// Flexible block types for case studies
export interface CaseStudyBlock {
  blockType: string;
  id?: string;
  [key: string]: unknown;
}

export interface HeroBlock extends CaseStudyBlock {
  blockType: 'hero';
  title: string;
  subtitle?: string;
  backgroundImage?: Media;
  backgroundVideo?: Media;
  variant?: 'default' | 'homepage';
  backgroundColor?: 'primary' | 'tertiary' | 'custom';
  showClientLogo?: boolean;
  clientLogo?: Media;
}

export interface IntroductionBlock extends CaseStudyBlock {
  blockType: 'introduction';
  eyebrow?: string;
  text: string;
  backgroundColor?: string;
  textColor?: string; // CMS text color: 'auto', 'light', 'dark', 'brand'
  variant?: 'default' | 'large';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface BodyIntroBlock extends CaseStudyBlock {
  blockType: 'bodyIntro';
  content: string;
}

export interface PainPointsBlock extends CaseStudyBlock {
  blockType: 'painPoints';
  title?: string;
  points: Array<{ point: string; id?: string; }>;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface QuoteStandardBlock extends CaseStudyBlock {
  blockType: 'quoteStandard';
  text: string;
  backgroundColor: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface QuoteFeaturedBlock extends CaseStudyBlock {
  blockType: 'quoteFeatured';
  text: string;
  author: string;
  company?: string;
  backgroundColor: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface ImageShowcaseBlock extends CaseStudyBlock {
  blockType: 'imageShowcase';
  type: 'single' | 'dual' | 'split';
  images: Array<{
    desktop: Media;
    mobile?: Media;
    alt: string;
    caption?: string;
  }>;
  splitBackgroundTop?: string;
  splitBackgroundBottom?: string;
  splitPercentage?: string;
}

export interface VideoBlock extends CaseStudyBlock {
  blockType: 'video';
  videoSource?: 'upload' | 'url';
  videoFile?: Media;
  videoUrl?: string;
  title?: string;
  thumbnail?: Media;
  description?: string;
  aspectRatio?: string;
  autoplaySettings?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    pauseOnExit?: boolean;
  };
  // Background options
  backgroundType?: 'solid' | 'split';
  backgroundColor?: string;
  topBackgroundColor?: string;
  bottomBackgroundColor?: string;
  splitRatio?: string;
  // Spacing
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface BentoGridBlock extends CaseStudyBlock {
  blockType: 'bentoGrid';
  layout: 'default' | 'compact' | 'extended';
  items: Array<{
    id?: string;
    title: string;
    content: string;
    image?: Media;
    size: 'small' | 'medium' | 'large';
    backgroundColor?: string;
  }>;
}

export interface CTABlock extends CaseStudyBlock {
  blockType: 'cta';
  eyebrow?: string;
  title?: string;
  primaryCTA?: {
    text: string;
    href: string;
    type?: 'email' | 'phone' | 'link';
  };
  secondaryCTA?: {
    text: string;
    href: string;
    type?: 'email' | 'phone' | 'link';
  };
  backgroundColor?: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface StatsCardsBlock extends CaseStudyBlock {
  blockType: 'statsCards';
  title?: string;
  backgroundColor?: string;
  stats: Array<{
    percentage: string;
    description: string;
    cardColor: 'primary' | 'secondary';
    id?: string;
  }>;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface StatsChartsBlock extends CaseStudyBlock {
  blockType: 'statsCharts';
  title?: string;
  stats: Array<{
    percentage: string;
    description: string;
    id?: string;
  }>;
}

export interface BentoGridBlock extends CaseStudyBlock {
  blockType: 'bentoGrid';
  title?: string;
  limit?: number;
  backgroundColor?: 'light' | 'primary' | 'tertiary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface CaseStudyBodyTextBlock extends CaseStudyBlock {
  blockType: 'caseStudyBodyText';
  content: LexicalContent;
  backgroundColor: 'light' | 'tertiary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface BodyTextBlock extends CaseStudyBlock {
  blockType: 'bodyText';
  content: LexicalContent;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface LogoGridBlock extends CaseStudyBlock {
  blockType: 'logoGrid';
  logos: Array<{
    id: string;
    name: string;
    image: Media;
    url?: string;
    alt?: string;
  }>;
  columns?: 3 | 4 | 5 | 6;
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface ServicesSectionBlock extends CaseStudyBlock {
  blockType: 'servicesSection';
  eyebrow?: string;
  headline: string;
  categories: Array<{
    id: string;
    title: string;
    color?: 'brand' | 'primary';
    services: Array<{
      id: string;
      name: string;
      url?: string;
    }>;
  }>;
  badgeStyle?: 'extra-light-gray' | 'light-gray' | 'dark' | 'brand';
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface ServicesGridBlock extends CaseStudyBlock {
  blockType: 'servicesGrid';
  headerText?: string;
  services: Array<{
    id?: string;
    title: string;
    description?: string;
    icon?: string;
    iconImage?: Media;
    url?: string;
    linkText?: string;
  }>;
  backgroundColor?: 'light' | 'tertiary' | 'primary';
  columns?: 2 | 3 | 4;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface AwardsGridBlock extends CaseStudyBlock {
  blockType: 'awardsGrid';
  awards: Array<{
    id: string;
    organizationName: string;
    awardTitle: string;
    logo?: Media;
    url?: string;
  }>;
  columns?: 3 | 4 | 5 | 6;
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface BlogCarouselBlock extends CaseStudyBlock {
  blockType: 'blogCarousel';
  title?: string;
  description?: string;
  limit?: number;
  category?: string;
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface SingleImageBlock extends CaseStudyBlock {
  blockType: 'singleImage';
  mediaType: 'image' | 'video';
  // Image fields
  desktop?: Media;
  mobile?: Media;
  alt?: string;
  // Video fields
  video?: Media;
  videoThumbnail?: Media;
  videoAlt?: string;
  // Background options
  backgroundType?: 'solid' | 'split';
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  topBg?: string;
  bottomBg?: string;
  splitRatio?: number;
  // Common fields
  fullWidth?: boolean;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface ScrollHijackCarouselBlock extends CaseStudyBlock {
  blockType: 'scrollHijackCarousel';
  slides: Array<{
    id: string;
    category: string;
    title: string;
    backgroundColor: 'light' | 'extra-light' | 'tertiary' | 'secondary' | 'primary';
    buttonText?: string;
    buttonUrl?: string;
  }>;
}

export interface PageHeaderBlock extends CaseStudyBlock {
  blockType: 'pageHeader';
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large' | 'xxl';
  fontWeight?: 'light' | 'semibold' | 'extrabold';
  backgroundColor?: 'light' | 'primary' | 'tertiary';
  textAlign?: 'left' | 'center';
  navClearance?: boolean;
  heroSpacing?: boolean;
}

export interface CarouselBlock extends CaseStudyBlock {
  blockType: 'carousel';
  title?: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    client?: string;
    logo?: string;
  }>;
  backgroundColor?: 'light' | 'primary' | 'tertiary';
}

export interface TwoColumnTextBlock extends CaseStudyBlock {
  blockType: 'twoColumnText';
  leftText?: LexicalContent;
  rightText?: LexicalContent;
  backgroundColor?: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface AccordionBlockData extends CaseStudyBlock {
  blockType: 'accordion';
  title?: string;
  items: Array<{
    id?: string;
    title: string;
    content: LexicalContent;
  }>;
  backgroundColor?: string;
  defaultOpenIndex?: number;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}

export interface FAQSectionBlock extends CaseStudyBlock {
  blockType: 'faqSection';
  title?: string;
  subtitle?: string;
  categories: Array<{
    id?: string;
    category: string;
    items: Array<{
      id?: string;
      question: string;
      answer: string;
    }>;
  }>;
  backgroundColor?: string;
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
}


export interface ResultsGallery {
  id: string;
  title: string;
  description?: string;
  gridItems: Array<{
    blockType: 'case-study-block' | 'placeholder-block';
    caseStudy?: CaseStudy;
    gridPosition: 'featured' | 'standard' | 'full' | 'square';
    showAsVideo?: boolean;
    backgroundColor?: 'tertiary' | 'primary';
    id?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Page interfaces
export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  status?: 'draft' | 'published';
  backgroundColor?: 'light' | 'dark';
  meta_title?: string;
  meta_description?: string;
  meta_image?: Media;
  blocks?: CaseStudyBlock[];
  layout?: CaseStudyBlock[]; // CMS uses layout field
  updated_at: string;
  created_at: string;
  // Legacy support
  createdAt?: string;
  updatedAt?: string;
}

// API functions for pages
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    // Try multiple slug formats to handle different cases
    const slugsToTry = [
      slug,                                          // Original slug as provided
      slug.startsWith('/') ? slug : `/${slug}`,     // With leading slash
      slug.startsWith('/') ? slug.substring(1) : slug  // Without leading slash
    ];
    
    for (const slugToTry of slugsToTry) {
      const params = new URLSearchParams();
      params.append('where[slug][equals]', slugToTry);
      params.append('where[status][equals]', 'published');
      params.append('limit', '1');
      params.append('depth', '3'); // Depth=3 required for nested blocks: Page → layout[] → block → media
      
      const queryString = params.toString();
      console.log(`Fetching page with slug: ${slugToTry}`);
      console.log(`API URL: ${API_CONFIG.PAYLOAD_URL}`);
      console.log(`Full URL: ${API_CONFIG.PAYLOAD_URL}/pages?${queryString}`);
      
      const response = await payloadFetch<PayloadResponse<Page>>(`/pages?${queryString}`);
      console.log(`Response for slug ${slugToTry}:`, response.docs?.length || 0, 'docs found');
      
      if (response.docs?.[0]) {
        return response.docs[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    console.error(`PAYLOAD_API_URL: ${API_CONFIG.PAYLOAD_URL}`);
    return null;
  }
}

export async function getHomePage(): Promise<Page | null> {
  return getPageBySlug('home');
}