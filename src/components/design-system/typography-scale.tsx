"use client";

import React from 'react';

interface TypographyItem {
  name: string;
  class: string;
  description: string;
  figmaToken: string;
  example: string;
  category: string;
  desktopSize: string;
  mobileSize: string;
  weight: string;
  tailwindEquivalent?: string;
}

const typographyItems: TypographyItem[] = [
  // Title Classes (Display/Titles)
  {
    name: "Hero XXL",
    class: "title-9xl",
    description: "96px desktop, 72px mobile",
    figmaToken: "Hero XXL",
    example: "Hero XXL",
    category: "Display/Titles",
    desktopSize: "96px",
    mobileSize: "72px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-8xl md:text-9xl font-bold"
  },
  {
    name: "Hero XL",
    class: "title-8xl",
    description: "84px desktop, 64px mobile",
    figmaToken: "Hero XL",
    example: "Hero XL",
    category: "Display/Titles",
    desktopSize: "84px",
    mobileSize: "64px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-7xl md:text-8xl font-bold"
  },
  {
    name: "Title Large",
    class: "title-5xl",
    description: "48px desktop, 40px mobile",
    figmaToken: "Title Large",
    example: "Title Large",
    category: "Display/Titles",
    desktopSize: "48px",
    mobileSize: "40px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-4xl md:text-5xl font-bold"
  },
  {
    name: "Title Medium",
    class: "title-4xl",
    description: "40px desktop, 32px mobile",
    figmaToken: "Title Medium",
    example: "Title Medium",
    category: "Display/Titles",
    desktopSize: "40px",
    mobileSize: "32px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-3xl md:text-4xl font-bold"
  },
  {
    name: "Title Small",
    class: "title-3xl",
    description: "32px desktop, 28px mobile",
    figmaToken: "Title Small",
    example: "Title Small",
    category: "Display/Titles",
    desktopSize: "32px",
    mobileSize: "28px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-2xl md:text-3xl font-bold"
  },
  {
    name: "Title Tiny",
    class: "title-2xl",
    description: "28px desktop, 24px mobile",
    figmaToken: "Title Tiny",
    example: "Title Tiny",
    category: "Display/Titles",
    desktopSize: "28px",
    mobileSize: "24px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-xl md:text-2xl font-bold"
  },

  // Body Content Typography
  {
    name: "Intro",
    class: "text-intro",
    description: "30px desktop, 24px mobile",
    figmaToken: "Intro",
    example: "Introduction text for sections",
    category: "Body Content",
    desktopSize: "30px",
    mobileSize: "24px",
    weight: "Light (300)",
    tailwindEquivalent: "text-2xl md:text-3xl font-light"
  },
  {
    name: "Body XL",
    class: "text-body-xl",
    description: "20px desktop, 18px mobile",
    figmaToken: "Body XL",
    example: "Large body text for emphasis",
    category: "Body Content",
    desktopSize: "20px",
    mobileSize: "18px",
    weight: "Regular (400)",
    tailwindEquivalent: "text-lg md:text-xl font-normal"
  },
  {
    name: "Quote",
    class: "text-quote",
    description: "24px desktop, 20px mobile",
    figmaToken: "Quote",
    example: "Standard testimonial quotes",
    category: "Body Content",
    desktopSize: "24px",
    mobileSize: "20px",
    weight: "Medium (500)",
    tailwindEquivalent: "text-xl md:text-2xl font-medium"
  },
  {
    name: "Quote Featured",
    class: "text-quote-featured",
    description: "30px desktop, 24px mobile",
    figmaToken: "Quote Featured",
    example: "Featured testimonial quotes",
    category: "Body Content",
    desktopSize: "30px",
    mobileSize: "24px",
    weight: "Medium (500)",
    tailwindEquivalent: "text-2xl md:text-3xl font-medium"
  },

  // UI Elements
  {
    name: "Navigation",
    class: "text-navigation",
    description: "16px both mobile and desktop",
    figmaToken: "Navigation",
    example: "Navigation Link",
    category: "UI Elements",
    desktopSize: "16px",
    mobileSize: "16px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-base font-bold"
  },
  {
    name: "Navigation Small",
    class: "text-navigation-small",
    description: "12px both mobile and desktop",
    figmaToken: "Navigation Small",
    example: "Small Nav",
    category: "UI Elements",
    desktopSize: "12px",
    mobileSize: "12px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-xs font-bold"
  },
  {
    name: "Button Text",
    class: "text-button",
    description: "14px both mobile and desktop",
    figmaToken: "Button Text",
    example: "Button Text",
    category: "UI Elements",
    desktopSize: "14px",
    mobileSize: "14px",
    weight: "Bold (700)",
    tailwindEquivalent: "text-sm font-bold"
  },
  {
    name: "Field Text",
    class: "text-field",
    description: "14px both mobile and desktop",
    figmaToken: "Field Text",
    example: "Form Field Text",
    category: "UI Elements",
    desktopSize: "14px",
    mobileSize: "14px",
    weight: "Regular (400)",
    tailwindEquivalent: "text-sm font-normal"
  },
  {
    name: "Breadcrumb",
    class: "text-breadcrumb",
    description: "12px both mobile and desktop",
    figmaToken: "Breadcrumb",
    example: "Breadcrumb Text",
    category: "UI Elements",
    desktopSize: "12px",
    mobileSize: "12px",
    weight: "Regular (400)",
    tailwindEquivalent: "text-xs font-normal"
  },

  // Standard Text
  {
    name: "Paragraph Large",
    class: "text-lg",
    description: "18px desktop, 16px mobile",
    figmaToken: "Paragraph Large",
    example: "Large paragraph text",
    category: "Standard Text",
    desktopSize: "18px",
    mobileSize: "16px",
    weight: "Regular (400)",
    tailwindEquivalent: "text-lg font-normal"
  },
  {
    name: "Paragraph",
    class: "text-base",
    description: "14px both mobile and desktop",
    figmaToken: "Paragraph",
    example: "Standard paragraph text",
    category: "Standard Text",
    desktopSize: "14px",
    mobileSize: "14px",
    weight: "Regular (400)",
    tailwindEquivalent: "text-sm font-normal"
  },
  {
    name: "Paragraph Small",
    class: "text-sm",
    description: "12px both mobile and desktop",
    figmaToken: "Paragraph Small",
    example: "Small paragraph text",
    category: "Standard Text",
    desktopSize: "12px",
    mobileSize: "12px",
    weight: "Regular (400)",
    tailwindEquivalent: "text-xs font-normal"
  }
];

const categories = ["Display/Titles", "Body Content", "UI Elements", "Standard Text"];


function TypographyTable({ items, title }: { items: TypographyItem[]; title: string }) {
  return (
    <div className="mb-12">
      <h3 className="title-3xl font-semibold text-content-primary mb-6">
        {title}
      </h3>
      
      <div className="border border-stroke-primary rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-surface-tertiary border-b border-stroke-primary">
          <div className="grid grid-cols-12 gap-2 p-4 font-semibold text-content-primary text-sm">
            <div className="col-span-4">Example</div>
            <div className="col-span-2">CSS Class</div>
            <div className="col-span-2">Figma Token</div>
            <div className="col-span-2">Desktop/Mobile</div>
            <div className="col-span-2">Tailwind Equiv</div>
          </div>
        </div>
        
        {/* Rows */}
        <div className="bg-white">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-12 gap-2 p-4 border-b border-stroke-muted last:border-b-0 ${
                index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
              }`}
            >
              {/* Example */}
              <div className="col-span-4 flex items-center">
                <div className={`${item.class} text-content-primary leading-tight`}>
                  {item.example}
                </div>
              </div>
              
              {/* CSS Class */}
              <div className="col-span-2 flex items-center">
                <code className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded break-all">
                  {item.class}
                </code>
              </div>
              
              {/* Figma Token */}
              <div className="col-span-2 flex items-center">
                <code className="text-xs font-mono text-content-muted break-all">
                  {item.figmaToken}
                </code>
              </div>
              
              {/* Desktop/Mobile Sizes */}
              <div className="col-span-2 flex items-center">
                <div className="text-xs">
                  <div className="text-content-primary">{item.desktopSize}</div>
                  <div className="text-content-muted">{item.mobileSize}</div>
                </div>
              </div>
              
              {/* Tailwind Equivalent */}
              <div className="col-span-2 flex items-center">
                <code className="text-xs font-mono text-blue-600 break-all">
                  {item.tailwindEquivalent || 'See docs'}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TypographyScale() {
  return (
    <section className="mb-16">
      <div className="container-inner">
        <h2 className="title-4xl font-semibold text-content-primary mb-8">
          Typography System
        </h2>
        <p className="text-lg text-content-primary mb-12 max-w-3xl">
          Typography mappings between Figma and code following the exact specifications from our design tokens. 
          Use these exact names in Figma to ensure consistency and seamless design-to-code handoffs.
        </p>

        {/* Typography Guidelines */}
        <div className="bg-surface-tertiary rounded-lg p-6 mb-12">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Typography Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Default Body Text</h4>
              <p className="text-content-primary mb-1">14px with 26px line-height</p>
              <p className="text-content-primary">300 weight (light) for all body text</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Responsive Scaling</h4>
              <p className="text-content-primary mb-1">Single breakpoint at 768px</p>
              <p className="text-content-primary">All typography classes auto-scale</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Weight System</h4>
              <p className="text-content-primary mb-1">Weight is implicit in the style purpose</p>
              <p className="text-content-primary">No separate weight variants needed</p>
            </div>
          </div>
        </div>

        {categories.map((category, categoryIndex) => (
          <TypographyTable 
            key={categoryIndex}
            title={category}
            items={typographyItems.filter(item => item.category === category)}
          />
        ))}
      </div>
    </section>
  );
}