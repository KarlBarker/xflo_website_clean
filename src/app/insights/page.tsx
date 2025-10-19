import { Suspense } from 'react'
import { StickyNavigation } from '@/components/blocks/sticky-navigation'
import { CMSFooter } from '@/components/blocks/cms-footer'
import { InsightsContent } from '@/components/blocks/insights/InsightsContent'
import { getBlogPosts, getBlogCategories, formatBlogPost } from '@/lib/insights'
import { getNavigationData, getFooterData } from '@/lib/navigation'
import { BlogPost } from '@/components/insights'

export const metadata = {
  title: 'Insights | xFlo.ai',
  description: 'Stay ahead with the latest insights on AI transformation, business automation, and growth strategies from the xFlo team.',
}

// Mock data fallback for when CMS is not available
const mockInsights: BlogPost[] = [
  {
    id: 1,
    title: "Isora GRC: A UX Design Awards 2024 Nominee",
    category: "Design",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    author: {
      name: "Albert Flores",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      date: "10 Aug 2024"
    },
    readTime: "3 min read",
    excerpt: "Isora GRC has been recently nominated for a prestigious UX Design Awards. Support us in our journey to success",
    href: "/insights/isora-grc-ux-awards-2024",
    slug: "isora-grc-ux-awards-2024"
  },
  {
    id: 2,
    title: "Advanced Analytics Strategies for Modern Businesses",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    author: {
      name: "Devon Lane",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      date: "8 Aug 2024"
    },
    readTime: "5 min read",
    excerpt: "Explore cutting-edge analytics methodologies that drive business growth and informed decision-making in today's data-driven world",
    href: "/insights/advanced-analytics-strategies",
    slug: "advanced-analytics-strategies"
  },
  {
    id: 3,
    title: "Financial Technology Trends Shaping 2024",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
    author: {
      name: "Bessie Cooper",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      date: "5 Aug 2024"
    },
    readTime: "4 min read",
    excerpt: "Discover the latest fintech innovations and how they're revolutionizing the financial services industry",
    href: "/insights/fintech-trends-2024",
    slug: "fintech-trends-2024"
  },
  {
    id: 4,
    title: "Building Scalable Web Applications with Next.js",
    category: "Development",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=500&fit=crop",
    author: {
      name: "Darlene Robertson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      date: "2 Aug 2024"
    },
    readTime: "6 min read",
    excerpt: "Learn best practices for developing high-performance, scalable web applications using the Next.js framework",
    href: "/insights/nextjs-scalable-apps",
    slug: "nextjs-scalable-apps"
  },
  {
    id: 5,
    title: "The Future of User Experience Design",
    category: "Design",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=500&fit=crop",
    author: {
      name: "Jenny Wilson",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face",
      date: "28 Jul 2024"
    },
    readTime: "4 min read",
    excerpt: "Exploring emerging UX trends and methodologies that will define the next generation of digital experiences",
    href: "/insights/future-ux-design",
    slug: "future-ux-design"
  }
]

const defaultCategories = ['All', 'Analytics', 'Design', 'Finance', 'Development']

// Loading component
function InsightsLoading() {
  return (
    <div className="min-h-screen bg-surface-light">
      <StickyNavigation />
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
    </div>
  )
}

export default async function InsightsPage() {
  // Fetch data with error handling for build time
  try {
    const [cmsInsightsResult, cmsCategories, navigationData, footerData] = await Promise.all([
      getBlogPosts({ limit: 20 }).catch(() => ({ docs: [], totalDocs: 0 })),
      getBlogCategories().catch(() => []),
      getNavigationData().catch(() => null),
      getFooterData().catch(() => null)
    ])

    // Format CMS insights or use mock data
    const insights: BlogPost[] = cmsInsightsResult.docs.length > 0 
      ? cmsInsightsResult.docs.map(formatBlogPost)
      : mockInsights

    // Use CMS categories or default
    const categories = cmsCategories.length > 0 
      ? ['All', ...cmsCategories.map(cat => cat.name)]
      : defaultCategories

    return (
      <div className="min-h-screen bg-surface-light">
        <StickyNavigation navigationData={navigationData || undefined} />
        
        <main className="pt-32 pb-32 md:pb-48">
          <Suspense fallback={<InsightsLoading />}>
            <InsightsContent 
              initialPosts={insights}
              categories={categories}
            />
          </Suspense>
        </main>

        <CMSFooter footerData={footerData!} />
      </div>
    )
  } catch (error) {
    console.error('Error loading insights page:', error)
    
    // Fallback to mock data
    return (
      <div className="min-h-screen bg-surface-light">
        <StickyNavigation />
        
        <main className="pt-32 pb-32 md:pb-48">
          <InsightsContent 
            initialPosts={mockInsights}
            categories={defaultCategories}
          />
        </main>

        <CMSFooter footerData={{
          companyDescription: '',
          columns: [],
          socialLinks: {},
          copyrightText: ''
        }} />
      </div>
    )
  }
}