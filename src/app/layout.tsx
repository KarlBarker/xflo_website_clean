import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { OrganizationStructuredData } from "@/components/seo/structured-data";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { AiModeProvider } from "@/context/ai-mode-context";
import { AiModeContainer } from "@/components/ai-mode/ai-mode-container";
import { GoogleTagManager } from "@next/third-parties/google";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap', // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: '%s | XFlo Digital',
    default: 'XFlo Digital - Data-Driven Digital Marketing Agency',
  },
  description: "XFlo Digital is a performance-focused digital marketing agency specializing in data-driven campaigns, analytics, and strategic digital solutions.",
  keywords: ["digital marketing", "performance marketing", "analytics", "data-driven marketing", "digital agency"],
  authors: [{ name: "XFlo Digital" }],
  creator: "XFlo Digital",
  publisher: "XFlo Digital",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://xflo.agency',
    title: 'XFlo Digital - Data-Driven Digital Marketing Agency',
    description: 'Performance-focused digital marketing agency specializing in data-driven campaigns and strategic digital solutions.',
    siteName: 'XFlo Digital',
    images: [
      {
        url: '/og-default.webp',
        width: 1200,
        height: 630,
        alt: 'XFlo Digital - Digital Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XFlo Digital - Data-Driven Digital Marketing Agency',
    description: 'Performance-focused digital marketing agency specializing in data-driven campaigns and strategic digital solutions.',
    images: ['/og-default.webp'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationStructuredData />
        
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://xflocms.vercel.app" />
        
        {/* Font preloading handled automatically by Next.js Google Fonts */}
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .hero-title { 
              font-size: clamp(2rem, 8vw, 4rem);
              line-height: 1.1;
              font-weight: 700;
              color: white;
              text-rendering: optimizeLegibility;
              font-display: swap;
            }
            .hero-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            body {
              font-display: swap;
            }
          `
        }} />
        {/* WebP Support Detection - runs before any components */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (typeof window === 'undefined') return;
              if (document.documentElement.classList.contains('webp') ||
                  document.documentElement.classList.contains('no-webp')) {
                return;
              }
              const webp = new Image();
              webp.onload = webp.onerror = function() {
                if (webp.height === 2) {
                  document.documentElement.classList.add('webp');
                } else {
                  document.documentElement.classList.add('no-webp');
                }
              };
              webp.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
            })();
          `
        }} />
      </head>
      <body
        className={`${figtree.className} antialiased`}
      >
        <AiModeProvider>
          <CustomCursor />
          <ScrollToTop />
          {/* <AiModeContainer /> */}
          {children}
        </AiModeProvider>
        <GoogleTagManager gtmId="GTM-M4CBXHC4" />
      </body>
    </html>
  );
}
