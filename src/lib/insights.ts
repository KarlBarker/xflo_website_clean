// Insights integration functions for Payload CMS
import { getMediaUrl as payloadGetMediaUrl, Media } from '@/lib/payload';
import { API_CONFIG } from '@/config/constants';
import { PayloadMediaItem } from '@/types/image';
import { LexicalContent, LexicalNode } from '@/types/lexical';

// CMS Blog Post interface
export interface CMSBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description?: string; // Optional description field
  content: LexicalContent; // Rich text content
  featuredImage: PayloadMediaItem | null; // Media field
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: PayloadMediaItem | null; // Media field
  };
  publishedAt: string;
  status: 'draft' | 'published';
  readTime?: number; // Minutes
  tags?: string[];
}

// Blog Category interface
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Fetch all published blog posts
export async function getBlogPosts(options: {
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<{ docs: CMSBlogPost[]; totalDocs: number }> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      where: JSON.stringify({
        status: { equals: 'published' }
      }),
      limit: String(options.limit || 50),
      sort: '-published_at'
    });
    
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/blog-posts?${params}`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { docs: [], totalDocs: 0 };
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<CMSBlogPost | null> {
  try {
    const params = new URLSearchParams({
      where: JSON.stringify({
        slug: { equals: slug },
        status: { equals: 'published' }
      }),
      limit: '1'
    });
    
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/blog-posts?${params}`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.status}`);
    }
    
    const data = await response.json();
    return data.docs[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Fetch all blog categories
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/blog-categories?sort=name&limit=100`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blog categories: ${response.status}`);
    }
    
    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

// Convert CMS blog post to frontend format
export function formatBlogPost(cmsPost: CMSBlogPost): {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    date: string;
  };
  readTime: string;
  excerpt: string;
  href: string;
} {
  // Use the main getMediaUrl function for consistency
  const getMediaUrl = (media: PayloadMediaItem | null): string => {
    if (!media) return '/images/blog-placeholder.jpg';
    return payloadGetMediaUrl(media as Media) || '/images/blog-placeholder.jpg';
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const calculateReadTime = (content: LexicalContent): string => {
    if (cmsPost.readTime) {
      return `${cmsPost.readTime} min read`;
    }
    // Estimate based on content length (average 200 words per minute)
    const textContent = JSON.stringify(content);
    const wordCount = textContent.split(' ').length;
    const minutes = Math.ceil(wordCount / 200);
    return `${Math.max(1, minutes)} min read`;
  };
  
  return {
    id: cmsPost.id,
    title: cmsPost.title,
    slug: cmsPost.slug,
    category: cmsPost.category?.name || 'Uncategorized',
    image: getMediaUrl(cmsPost.featuredImage),
    author: {
      name: cmsPost.author?.name || 'XFlo Team',
      avatar: getMediaUrl(cmsPost.author?.avatar || null),
      date: formatDate(cmsPost.publishedAt),
    },
    readTime: calculateReadTime(cmsPost.content || { root: { children: [], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }),
    excerpt: cmsPost.excerpt || '',
    href: `/insights/${cmsPost.slug}`
  };
}

// Mock insights data for development/demo
const mockInsights: CMSBlogPost[] = [
  {
    id: '1',
    title: 'Isora GRC: A UX Design Awards 2024 Nominee',
    slug: 'isora-grc-ux-awards-2024',
    excerpt: 'Isora GRC has been recently nominated for a prestigious UX Design Awards. Support us in our journey to success',
    description: 'Learn about our journey to the UX Design Awards 2024 nomination',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ text: 'We are thrilled to announce that Isora GRC has been nominated for the prestigious UX Design Awards 2024. This recognition highlights our commitment to creating exceptional user experiences in the governance, risk, and compliance space.' }]
          } as LexicalNode,
          {
            type: 'paragraph',
            version: 1,
            children: [{ text: 'The UX Design Awards celebrate outstanding achievements in user experience design across various industries. Our nomination in the B2B category acknowledges the innovative approach we\'ve taken to simplify complex GRC processes through intuitive design.' }]
          } as LexicalNode
        ],
        direction: 'ltr' as const,
        format: '',
        indent: 0,
        type: 'root' as const,
        version: 1
      }
    },
    featuredImage: { id: '1', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop', filename: 'ux-awards.jpg', alt: 'UX Design Awards 2024' } as PayloadMediaItem,
    category: { id: '1', name: 'Design', slug: 'design' },
    author: { id: '1', name: 'Albert Flores', avatar: { id: '2', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', filename: 'albert-flores.jpg', alt: 'Albert Flores' } as PayloadMediaItem },
    publishedAt: '2024-08-10T00:00:00Z',
    status: 'published',
    readTime: 3
  },
  {
    id: '2',
    title: 'Advanced Analytics Strategies for Modern Businesses',
    slug: 'advanced-analytics-strategies',
    excerpt: 'Explore cutting-edge analytics methodologies that drive business growth and informed decision-making in today\'s data-driven world',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ text: 'In today\'s competitive landscape, data-driven decision making is not just an advantage—it\'s a necessity. Modern businesses must leverage advanced analytics strategies to stay ahead.' }]
          } as LexicalNode
        ],
        direction: 'ltr' as const,
        format: '',
        indent: 0,
        type: 'root' as const,
        version: 1
      }
    },
    featuredImage: { id: '3', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop', filename: 'analytics.jpg', alt: 'Advanced Analytics Dashboard' } as PayloadMediaItem,
    category: { id: '2', name: 'Analytics', slug: 'analytics' },
    author: { id: '2', name: 'Devon Lane', avatar: { id: '4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', filename: 'devon-lane.jpg', alt: 'Devon Lane' } as PayloadMediaItem },
    publishedAt: '2024-08-08T00:00:00Z',
    status: 'published',
    readTime: 5
  }
];

// Get single insight by slug
export async function getInsightBySlug(slug: string): Promise<CMSBlogPost | null> {
  try {
    const response = await fetch(`${API_CONFIG.PAYLOAD_URL}/blog-posts?where[slug][equals]=${slug}&limit=1`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch insight: ${response.status} ${response.statusText}`);
      // Return mock data if available
      const mockInsight = mockInsights.find(post => post.slug === slug);
      return mockInsight || null;
    }

    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      // Return mock data if available
      const mockInsight = mockInsights.find(post => post.slug === slug);
      return mockInsight || null;
    }

    return data.docs[0];
  } catch (error) {
    console.error('Error fetching insight by slug:', error);
    // Return mock data if available
    const mockInsight = mockInsights.find(post => post.slug === slug);
    return mockInsight || null;
  }
}

// Get insights for grid/listing (alias for getBlogPosts)
export async function getInsightsForGrid(limit = 10, category?: string) {
  return getBlogPosts({ limit, category });
}