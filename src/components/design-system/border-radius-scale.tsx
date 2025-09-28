"use client";

import React from 'react';

interface BorderRadiusItem {
  name: string;
  class: string;
  value: string;
  description: string;
  figmaToken: string;
  useCase: string;
  tailwindEquivalent: string;
}

const borderRadiusItems: BorderRadiusItem[] = [
  {
    name: "Button/Input",
    class: "rounded-button",
    value: "6px",
    description: "Standard radius for interactive elements",
    figmaToken: "Button/Input",
    useCase: "Buttons and inputs",
    tailwindEquivalent: "rounded-md"
  },
  {
    name: "Card",
    class: "rounded-card",
    value: "8px",
    description: "Standard radius for content containers",
    figmaToken: "Card",
    useCase: "Cards and panels",
    tailwindEquivalent: "rounded-lg"
  },
  {
    name: "Modal",
    class: "rounded-modal",
    value: "12px",
    description: "Larger radius for overlay elements",
    figmaToken: "Modal",
    useCase: "Modals and overlays",
    tailwindEquivalent: "rounded-xl"
  }
];

function BorderRadiusExample({ item }: { item: BorderRadiusItem }) {
  return (
    <div className="border border-stroke-primary rounded-lg p-6">
      {/* Visual Example */}
      <div className="mb-6 flex items-center justify-center">
        <div 
          className={`bg-surface-primary h-16 w-32 ${item.class} flex items-center justify-center`}
        >
          <span className="text-content-inverse text-sm font-semibold">
            {item.value}
          </span>
        </div>
      </div>
      
      {/* Details */}
      <div className="space-y-3">
        <div>
          <h4 className="text-content-primary font-semibold mb-1">{item.name}</h4>
          <p className="text-content-muted text-sm">{item.description}</p>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-xs text-content-muted">CSS Class:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {item.class}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Figma Token:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {item.figmaToken}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Value:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {item.value}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Tailwind Equivalent:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {item.tailwindEquivalent}
            </code>
          </div>
        </div>
        
        <div>
          <span className="text-xs text-content-muted">Use Cases:</span>
          <p className="text-sm text-content-primary">{item.useCase}</p>
        </div>
      </div>
    </div>
  );
}

export function BorderRadiusScale() {
  return (
    <section className="mb-16">
      <div className="container-inner">
        <h2 className="title-4xl font-semibold text-content-primary mb-8">
          Border Radius System
        </h2>
        <p className="text-lg text-content-primary mb-12 max-w-3xl">
          Consistent border radius values for different component types. 
          Each radius serves specific UI patterns and maintains visual hierarchy across the design system.
        </p>

        {/* Border Radius Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {borderRadiusItems.map((item, index) => (
            <BorderRadiusExample key={index} item={item} />
          ))}
        </div>

        {/* Usage Guidelines */}
        <div className="bg-surface-tertiary rounded-lg p-6">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Border Radius Guidelines
          </h3>
          <p className="text-content-primary mb-6">
            Apply consistent border radius across components to maintain visual harmony:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Interactive Elements</h4>
              <code className="block bg-white p-2 rounded text-sm font-mono mb-2">
                rounded-button (6px)
              </code>
              <p className="text-sm text-content-muted">Buttons, form inputs, interactive controls</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Content Containers</h4>
              <code className="block bg-white p-2 rounded text-sm font-mono mb-2">
                rounded-card (8px)
              </code>
              <p className="text-sm text-content-muted">Cards, content panels, grouped information</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Overlay Elements</h4>
              <code className="block bg-white p-2 rounded text-sm font-mono mb-2">
                rounded-modal (12px)
              </code>
              <p className="text-sm text-content-muted">Modals, popovers, dropdown menus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}