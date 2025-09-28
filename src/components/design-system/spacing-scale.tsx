"use client";

import React from 'react';

interface SpacingItem {
  name: string;
  class: string;
  value: string;
  description: string;
  figmaToken: string;
  useCase: string;
  tailwindEquivalent: string;
}

const spacingScale: SpacingItem[] = [
  {
    name: "Section",
    class: "spacing-section",
    value: "96px",
    description: "Between major sections",
    figmaToken: "Section",
    useCase: "Between major sections",
    tailwindEquivalent: "24 (py-24, gap-24)"
  },
  {
    name: "Component", 
    class: "spacing-component",
    value: "48px",
    description: "Between components",
    figmaToken: "Component", 
    useCase: "Between components",
    tailwindEquivalent: "12 (gap-12, py-12)"
  },
  {
    name: "Card",
    class: "spacing-card",
    value: "32px",
    description: "Internal card padding",
    figmaToken: "Card",
    useCase: "Internal card padding",
    tailwindEquivalent: "8 (p-8, gap-8)"
  },
  {
    name: "Element",
    class: "spacing-element", 
    value: "24px",
    description: "Between related elements",
    figmaToken: "Element",
    useCase: "Between related elements",
    tailwindEquivalent: "6 (gap-6, py-6)"
  },
  {
    name: "Compact",
    class: "spacing-compact",
    value: "16px", 
    description: "Compact layouts",
    figmaToken: "Compact",
    useCase: "Compact layouts",
    tailwindEquivalent: "4 (gap-4, p-4)"
  },
  {
    name: "Tight",
    class: "spacing-tight",
    value: "8px",
    description: "Minimal spacing",
    figmaToken: "Tight", 
    useCase: "Minimal spacing",
    tailwindEquivalent: "2 (gap-2, py-2)"
  }
];

const spacingUtilities = [
  {
    name: "Margin Top",
    prefix: "mt-",
    example: "mt-spacing-section", 
    description: "Apply spacing as top margin"
  },
  {
    name: "Margin Bottom",
    prefix: "mb-",
    example: "mb-spacing-component",
    description: "Apply spacing as bottom margin"
  },
  {
    name: "Padding Top",
    prefix: "pt-", 
    example: "pt-spacing-card",
    description: "Apply spacing as top padding"
  },
  {
    name: "Padding Bottom",
    prefix: "pb-",
    example: "pb-spacing-element",
    description: "Apply spacing as bottom padding"
  },
  {
    name: "Gap",
    prefix: "gap-",
    example: "gap-spacing-compact", 
    description: "Apply spacing as flexbox/grid gap"
  }
];

function SpacingExample({ spacing }: { spacing: SpacingItem }) {
  return (
    <div className="border border-stroke-primary rounded-lg p-4">
      {/* Visual Example */}
      <div className="mb-4">
        <div className="flex items-center">
          <div className="bg-surface-primary h-8 w-8 rounded"></div>
          <div 
            className="bg-content-secondary h-2"
            style={{ width: spacing.value }}
          ></div>
          <div className="bg-surface-primary h-8 w-8 rounded"></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-content-muted">{spacing.value}</span>
        </div>
      </div>
      
      {/* Details */}
      <div className="space-y-3">
        <div>
          <h4 className="text-content-primary font-semibold mb-1">{spacing.name}</h4>
          <p className="text-content-muted text-sm">{spacing.description}</p>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-xs text-content-muted">Semantic Class:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {spacing.class}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Figma Token:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {spacing.figmaToken}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Value:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {spacing.value}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Tailwind Equivalent:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {spacing.tailwindEquivalent}
            </code>
          </div>
        </div>
        
        <div>
          <span className="text-xs text-content-muted">Use Cases:</span>
          <p className="text-sm text-content-primary">{spacing.useCase}</p>
        </div>
      </div>
    </div>
  );
}

export function SpacingScale() {
  return (
    <section className="mb-16">
      <div className="container-inner">
        <h2 className="title-4xl font-semibold text-content-primary mb-8">
          Spacing System
        </h2>
        <p className="text-lg text-content-primary mb-12 max-w-3xl">
          Spacing tokens that work with both semantic classes and standard Tailwind utilities. 
          Choose the approach that best fits your workflow - semantic for design consistency or Tailwind for flexibility.
        </p>

        {/* Dual Approach Explanation */}
        <div className="bg-surface-tertiary rounded-lg p-6 mb-12">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Semantic + Tailwind Approach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Semantic Classes (Recommended)</h4>
              <code className="block bg-white p-2 rounded text-sm font-mono mb-2">
                py-spacing-section
              </code>
              <p className="text-sm text-content-muted">Use semantic tokens for design system consistency</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Tailwind Utilities (Alternative)</h4>
              <code className="block bg-white p-2 rounded text-sm font-mono mb-2">
                py-24
              </code>
              <p className="text-sm text-content-muted">Use standard Tailwind classes for flexibility</p>
            </div>
          </div>
        </div>

        {/* Spacing Scale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {spacingScale.map((spacing, index) => (
            <SpacingExample key={index} spacing={spacing} />
          ))}
        </div>

        {/* Usage Guidelines */}
        <div className="bg-surface-tertiary rounded-lg p-6 mb-8">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            How to Apply Spacing
          </h3>
          <p className="text-content-primary mb-6">
            Apply spacing using semantic tokens OR Tailwind equivalents:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spacingUtilities.map((utility, index) => (
              <div key={index}>
                <h4 className="font-semibold text-content-primary mb-2">{utility.name}</h4>
                <code className="block bg-white p-2 rounded text-sm font-mono mb-2">
                  {utility.example}
                </code>
                <p className="text-sm text-content-muted">{utility.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Patterns */}
        <div className="bg-surface-tertiary rounded-lg p-6">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Common Spacing Patterns
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-3">Semantic Approach</h4>
              <div className="space-y-3">
                <div>
                  <code className="bg-white p-2 rounded font-mono text-sm block">
                    py-spacing-section
                  </code>
                  <p className="text-content-muted text-xs mt-1">Major page sections (96px)</p>
                </div>
                <div>
                  <code className="bg-white p-2 rounded font-mono text-sm block">
                    gap-spacing-element
                  </code>
                  <p className="text-content-muted text-xs mt-1">Related elements (24px)</p>
                </div>
                <div>
                  <code className="bg-white p-2 rounded font-mono text-sm block">
                    p-spacing-card
                  </code>
                  <p className="text-content-muted text-xs mt-1">Card interiors (32px)</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-3">Tailwind Approach</h4>
              <div className="space-y-3">
                <div>
                  <code className="bg-white p-2 rounded font-mono text-sm block">
                    py-24
                  </code>
                  <p className="text-content-muted text-xs mt-1">Major page sections (96px)</p>
                </div>
                <div>
                  <code className="bg-white p-2 rounded font-mono text-sm block">
                    gap-6
                  </code>
                  <p className="text-content-muted text-xs mt-1">Related elements (24px)</p>
                </div>
                <div>
                  <code className="bg-white p-2 rounded font-mono text-sm block">
                    p-8
                  </code>
                  <p className="text-content-muted text-xs mt-1">Card interiors (32px)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}