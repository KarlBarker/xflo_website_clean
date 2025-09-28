import { Suspense } from 'react'
import { StickyNavigation } from '@/components/blocks/sticky-navigation'
import { CMSFooter } from '@/components/blocks/cms-footer'
import { InsightsContent } from '@/components/blocks/insights/InsightsContent'
import { getBlogPosts, getBlogCategories, formatBlogPost } from '@/lib/insights'
import type { BlogPost } from '@/components/insights'
import { getNavigationData, getFooterData } from '@/lib/navigation'

export const metadata = {
  title: 'Insights | xFlo',
  description: 'Stay ahead with the latest insights on digital marketing, analytics, and business growth from the xFlo team.',
}

// Loading component
function InsightsLoading() {
  return (
    <div className="container-inner pt-32 pb-32">
      <div className="animate-pulse">
        <div className="h-12 bg-surface-tertiary rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-tertiary rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function InsightsPage() {
  // Fetch data with error handling for build time
  let navigationData = null;
  let footerData = null;
  let blogPosts: BlogPost[] = [];
  let categories = ['All', 'Analytics', 'Design', 'Finance', 'Development'];
  
  try {
    navigationData = await getNavigationData();
  } catch (error) {
    console.warn('Failed to fetch navigation during build:', error);
  }
  
  try {
    footerData = await getFooterData();
  } catch (error) {
    console.warn('Failed to fetch footer during build:', error);
  }
  
  try {
    const blogResponse = await getBlogPosts({ limit: 50 });
    if (blogResponse.docs.length > 0) {
      blogPosts = blogResponse.docs.map(formatBlogPost);
    }
  } catch (error) {
    console.warn('Failed to fetch blog posts during build:', error);
  }
  
  try {
    const categoriesResponse = await getBlogCategories();
    if (categoriesResponse.length > 0) {
      categories = ['All', ...categoriesResponse.map(cat => cat.name)];
    }
  } catch (error) {
    console.warn('Failed to fetch blog categories during build:', error);
  }
  
  return (
    <div className="min-h-screen bg-surface-light">
      <StickyNavigation navigationData={navigationData || undefined} />
      
      <main className="pt-32 pb-32 md:pb-48">
        <Suspense fallback={<InsightsLoading />}>
          <InsightsContent 
            initialPosts={blogPosts}
            categories={categories}
          />
        </Suspense>
      </main>

      <CMSFooter footerData={footerData!} />
    </div>
  )
}