"use client";

import React from 'react';

interface ColorSwatch {
  name: string;
  class: string;
  description: string;
  figmaToken: string;
  hslValue: string;
  usage: string;
}

function getTailwindEquivalent(semanticClass: string): string {
  const equivalents: Record<string, string> = {
    'bg-surface-primary': 'bg-neutral-900',
    'bg-surface-secondary': 'bg-neutral-800',
    'bg-surface-tertiary': 'bg-neutral-200',
    'bg-surface-light': 'bg-white',
    'text-content-primary': 'text-neutral-900 (contextual)',
    'text-content-inverse': 'text-white (contextual)',
    'text-content-secondary': 'text-red-500',
    'text-content-muted': 'text-neutral-500',
    'border-stroke-primary': 'border-neutral-200 (contextual)',
    'border-stroke-secondary': 'border-red-500',
    'border-stroke-muted': 'border-neutral-200',
    'bg-interactive-primary': 'bg-red-500',
    'bg-interactive-primary-hover': 'bg-red-600',
    'bg-interactive-secondary': 'bg-neutral-800',
    'bg-interactive-secondary-hover': 'bg-neutral-700'
  };
  
  return equivalents[semanticClass] || 'See documentation';
}

const colorGroups = [
  {
    title: "Surface Colors",
    description: "Background colors for different surfaces and components",
    colors: [
      {
        name: "Primary",
        class: "bg-surface-primary",
        description: "Main dark backgrounds",
        figmaToken: "Surface/Primary",
        hslValue: "#171717",
        usage: "Main dark backgrounds"
      },
      {
        name: "Secondary", 
        class: "bg-surface-secondary",
        description: "Secondary surfaces",
        figmaToken: "Surface/Secondary",
        hslValue: "#262626",
        usage: "Secondary surfaces"
      },
      {
        name: "Tertiary",
        class: "bg-surface-tertiary", 
        description: "Light grey surfaces",
        figmaToken: "Surface/Tertiary",
        hslValue: "#E5E5E5",
        usage: "Light grey surfaces"
      },
      {
        name: "Light",
        class: "bg-surface-light",
        description: "White surfaces",
        figmaToken: "Surface/Light",
        hslValue: "#FFFFFF",
        usage: "White surfaces"
      }
    ]
  },
  {
    title: "Content Colors", 
    description: "Text and content colors",
    colors: [
      {
        name: "Primary",
        class: "text-content-primary",
        description: "Main text color",
        figmaToken: "Content/Primary",
        hslValue: "Contextual",
        usage: "Main text color"
      },
      {
        name: "Secondary",
        class: "text-content-secondary",
        description: "Red emphasis text",
        figmaToken: "Content/Secondary",
        hslValue: "#DC2626",
        usage: "Red emphasis text"
      },
      {
        name: "Inverse",
        class: "text-content-inverse", 
        description: "Opposite of primary",
        figmaToken: "Content/Inverse",
        hslValue: "Contextual",
        usage: "Opposite of primary"
      },
      {
        name: "Muted",
        class: "text-content-muted",
        description: "Muted grey text", 
        figmaToken: "Content/Muted",
        hslValue: "#737373",
        usage: "Muted grey text"
      }
    ]
  },
  {
    title: "Interactive Colors",
    description: "Colors for CTAs and interactive elements",
    colors: [
      {
        name: "Primary",
        class: "bg-interactive-primary",
        description: "Primary buttons/links",
        figmaToken: "Interactive/Primary",
        hslValue: "#DC2626",
        usage: "Primary buttons/links"
      },
      {
        name: "Secondary",
        class: "bg-interactive-secondary",
        description: "Secondary buttons", 
        figmaToken: "Interactive/Secondary",
        hslValue: "#262626",
        usage: "Secondary buttons"
      }
    ]
  },
  {
    title: "Stroke Colors",
    description: "Border and divider colors", 
    colors: [
      {
        name: "Primary",
        class: "border-stroke-primary",
        description: "Main borders",
        figmaToken: "Stroke/Primary",
        hslValue: "Contextual",
        usage: "Main borders"
      },
      {
        name: "Secondary",
        class: "border-stroke-secondary",
        description: "Red accent borders",
        figmaToken: "Stroke/Secondary",
        hslValue: "#DC2626",
        usage: "Red accent borders"
      }
    ]
  }
];

function ColorSwatch({ color, isText = false }: { color: ColorSwatch; isText?: boolean }) {
  return (
    <div className="border border-stroke-primary rounded-lg overflow-hidden">
      {/* Color Preview */}
      <div className={`h-20 ${isText ? 'bg-white flex items-center justify-center' : color.class}`}>
        {isText && (
          <span className={`${color.class} text-lg font-semibold`}>
            Text Preview
          </span>
        )}
      </div>
      
      {/* Details */}
      <div className="p-4 bg-white">
        <h4 className="text-content-primary font-semibold mb-1">{color.name}</h4>
        <p className="text-content-muted text-sm mb-3">{color.description}</p>
        
        <div className="space-y-2">
          <div>
            <span className="text-xs text-content-muted">Semantic Class:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {color.class}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Figma Token:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {color.figmaToken}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Value:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {color.hslValue}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Tailwind Equivalent:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {getTailwindEquivalent(color.class)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <section className="mb-16">
      <div className="container-inner">
        <h2 className="title-4xl font-semibold text-content-primary mb-8">
          Color System
        </h2>
        <p className="text-lg text-content-primary mb-12 max-w-3xl">
          Semantic color mappings between Figma and CSS following our design token specifications. 
          Each color serves specific purposes and automatically adapts to light/dark contexts where appropriate.
        </p>

        {/* Color System Architecture */}
        <div className="bg-surface-tertiary rounded-lg p-6 mb-12">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Color System Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-2">HSL Color Format</h4>
              <p className="text-content-primary mb-1">Better browser compatibility</p>
              <p className="text-content-primary">Simplified from previous OKLCH system</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Contextual Colors</h4>
              <p className="text-content-primary mb-1">Content/Stroke colors adapt to context</p>
              <p className="text-content-primary">Light/dark theme support built-in</p>
            </div>
          </div>
        </div>

        {colorGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-12">
            <h3 className="title-3xl font-semibold text-content-primary mb-2">
              {group.title}
            </h3>
            <p className="text-content-muted mb-6">{group.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.colors.map((color, index) => (
                <ColorSwatch 
                  key={index} 
                  color={color} 
                  isText={group.title === "Content Colors"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}