import { MetadataRoute } from 'next';
import { getCaseStudies } from '@/lib/payload';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://r3.agency';
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Get dynamic case study routes
  try {
    const caseStudies = await getCaseStudies({ 
      limit: 100,
      where: { status: { equals: 'published' } }
    });
    
    const caseStudyUrls: MetadataRoute.Sitemap = caseStudies.docs.map((study) => ({
      url: `${baseUrl}/case-studies/${study.slug}`,
      lastModified: new Date(study.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...caseStudyUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static routes if dynamic fetching fails
    return staticRoutes;
  }
}