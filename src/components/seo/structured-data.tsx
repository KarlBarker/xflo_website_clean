import { CaseStudy } from '@/lib/payload';
import { getMediaUrl } from '@/lib/payload';

interface CaseStudyStructuredDataProps {
  caseStudy: CaseStudy;
}

export function CaseStudyStructuredData({ caseStudy }: CaseStudyStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xflo.agency';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.seo?.description || `Case study: ${caseStudy.title}`,
    image: caseStudy.seo?.image 
      ? getMediaUrl(caseStudy.seo.image)
      : caseStudy.hero?.backgroundImage 
        ? getMediaUrl(caseStudy.hero.backgroundImage)
        : `${baseUrl}/og-default.jpg`,
    datePublished: caseStudy.createdAt,
    dateModified: caseStudy.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'XFlo Digital',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'XFlo Digital',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/xflo_logo.svg`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/case-studies/${caseStudy.slug}`,
    },
    articleSection: 'Case Study',
    keywords: [
      'digital marketing',
      'case study',
      caseStudy.client?.name,
      caseStudy.client?.industry,
      'XFlo Digital'
    ].filter(Boolean).join(', '),
    about: {
      '@type': 'Organization',
      name: caseStudy.client?.name || 'Client',
      description: caseStudy.client?.description,
      industry: caseStudy.client?.industry,
    },
    provider: {
      '@type': 'Organization',
      name: 'XFlo Digital',
      description: 'Digital marketing agency specializing in data-driven campaigns and performance optimization.',
      url: baseUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+44-1244-567560',
        contactType: 'customer service',
        email: 'studio@xflo.agency',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
}

interface OrganizationStructuredDataProps {
  className?: string;
}

export function OrganizationStructuredData({ className }: OrganizationStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xflo.agency';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XFlo Digital',
    alternateName: 'XFlo',
    description: 'Digital marketing agency specializing in data-driven campaigns, performance optimization, and strategic digital solutions.',
    url: baseUrl,
    logo: `${baseUrl}/xflo_logo.svg`,
    image: `${baseUrl}/xflo_logo.svg`,
    telephone: '+44-1244-567560',
    email: 'studio@xflo.agency',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    sameAs: [
      // Add social media URLs here when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-1244-567560',
      contactType: 'customer service',
      email: 'studio@xflo.agency',
      availableLanguage: 'English',
    },
    foundingDate: '2020', // Update with actual founding date
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '10-50', // Update with actual range
    },
    serviceArea: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Marketing Strategy',
            description: 'Comprehensive digital marketing strategy and planning',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Performance Marketing',
            description: 'Data-driven performance marketing campaigns',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Analytics & Optimization',
            description: 'Marketing analytics and conversion optimization',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      className={className}
    />
  );
}