import React from 'react';
import { getBlogPosts, formatBlogPost } from '@/lib/insights';
import { BlogCarouselClient } from './blog-carousel-client';

interface BlogCarouselProps {
  title?: string;
  description?: string;
  limit?: number;
  category?: string;
  backgroundColor?: 'white' | 'light-gray' | 'primary';
  spacingTop?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  spacingBottom?: 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';
  className?: string;
}

// Async component to fetch blog posts
async function BlogCarouselContent({
  title = "Latest Insights",
  description = "Discover our latest thoughts, strategies, and insights on digital marketing, technology, and business growth.",
  limit = 6,
  category,
  backgroundColor = 'white',
  className,
}: Omit<BlogCarouselProps, 'spacingTop' | 'spacingBottom'>) {
  // Fetch blog posts from CMS
  const blogResponse = await getBlogPosts({ limit, category });
  const blogPosts = blogResponse.docs.map(formatBlogPost);

  // Show a placeholder message if no blog posts
  if (blogPosts.length === 0) {
    console.log('BlogCarousel: No blog posts found in CMS');
    return (
      <div className={`w-full py-16 ${backgroundColor === 'primary' ? 'bg-surface-primary text-content-inverse' : 'bg-surface-light text-content-primary'}`}>
        <div className="container-inner text-center">
          <h2 className="title-3xl mb-4">Blog content coming soon</h2>
          <p className="text-lg opacity-70">Check back later for insights and articles.</p>
        </div>
      </div>
    );
  }

  return (
    <BlogCarouselClient
      title={title}
      description={description}
      blogPosts={blogPosts}
      backgroundColor={backgroundColor}
      className={className}
    />
  );
}

// Main wrapper component for CMS integration
export function BlogCarousel(props: BlogCarouselProps) {
  return <BlogCarouselContent {...props} />;
}