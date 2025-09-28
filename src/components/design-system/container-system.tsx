"use client";

import React from 'react';

interface ContainerItem {
  name: string;
  class: string;
  maxWidth: string;
  gutters: string;
  description: string;
  figmaToken: string;
  useCase: string;
}

const containers: ContainerItem[] = [
  {
    name: "Outer Container",
    class: "container-outer", 
    maxWidth: "1500px",
    gutters: "24px mobile, 64px desktop",
    description: "Main layout container for full-width sections",
    figmaToken: "Container/Outer",
    useCase: "Page sections, hero areas, full-width content"
  },
  {
    name: "Inner Container",
    class: "container-inner",
    maxWidth: "1180px", 
    gutters: "24px mobile, 64px desktop",
    description: "Content container for readable text width",
    figmaToken: "Container/Inner",
    useCase: "Article content, forms, main content areas"
  },
  {
    name: "Text Width",
    class: "w-text or max-w-[784px]",
    maxWidth: "784px",
    gutters: "Inherits from parent",
    description: "Optimal reading width for text content. Note: w-text is defined in CSS, or use max-w-[784px] with Tailwind", 
    figmaToken: "Text Width",
    useCase: "Long-form content, articles, body text"
  },
  {
    name: "Fluid Container", 
    class: "container-fluid",
    maxWidth: "100%",
    gutters: "24px mobile, 64px desktop",
    description: "Full-width container with responsive gutters",
    figmaToken: "Container/Fluid",
    useCase: "Full-width sections that need gutters"
  },
  {
    name: "Navigation Container",
    class: "container-nav",
    maxWidth: "1500px", 
    gutters: "16px mobile, 32px desktop",
    description: "Special container for navigation with smaller gutters",
    figmaToken: "Container/Navigation",
    useCase: "Navigation bars, headers"
  },
  {
    name: "Outer Container (No Padding)",
    class: "container-outer-no-pad",
    maxWidth: "1500px",
    gutters: "None",
    description: "Outer container without any padding",
    figmaToken: "Container/Outer/NoPad",
    useCase: "Edge-to-edge content within outer bounds"
  },
  {
    name: "Inner Container (No Padding)",
    class: "container-inner-no-pad",
    maxWidth: "1180px",
    gutters: "None",
    description: "Inner container without any padding",
    figmaToken: "Container/Inner/NoPad",
    useCase: "Edge-to-edge content within inner bounds, used inside container-outer"
  },
  {
    name: "Gallery Scroll Container",
    class: "gallery-scroll-container",
    maxWidth: "Extends to viewport edge",
    gutters: "Left: aligns with 1180px content; Right: extends past container gutters",
    description: "Scrollable container that starts at content line but extends to viewport edge for overflow scrolling",
    figmaToken: "Container/Gallery/Scroll",
    useCase: "Horizontal scrolling galleries, carousels that need left content alignment with right overflow"
  }
];

function ContainerExample({ container }: { container: ContainerItem }) {
  return (
    <div className="mb-8">
      {/* Visual Example */}
      <div className="border-2 border-dashed border-neutral-300 p-4 mb-4">
        <div className={`${container.class} bg-surface-tertiary min-h-20 flex items-center justify-center relative`}>
          <span className="text-content-primary font-semibold">
            {container.name}
          </span>
          
          {/* Width indicator */}
          <div className="absolute top-2 right-2 text-xs text-content-muted">
            Max: {container.maxWidth}
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className="space-y-3">
        <div>
          <h4 className="text-content-primary font-semibold mb-1">{container.name}</h4>
          <p className="text-content-muted text-sm">{container.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-content-muted">CSS Class:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {container.class}
            </code>
          </div>
          <div>
            <span className="text-xs text-content-muted">Figma Token:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {container.figmaToken}
            </code>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-content-muted">Max Width:</span>
            <p className="text-sm text-content-primary">{container.maxWidth}</p>
          </div>
          <div>
            <span className="text-xs text-content-muted">Gutters:</span>
            <p className="text-sm text-content-primary">{container.gutters}</p>
          </div>
        </div>
        
        <div>
          <span className="text-xs text-content-muted">Use Cases:</span>
          <p className="text-sm text-content-primary">{container.useCase}</p>
        </div>
      </div>
    </div>
  );
}

export function ContainerSystem() {
  return (
    <section className="mb-16">
      <div className="container-inner">
        <h2 className="title-4xl font-semibold text-content-primary mb-8">
          Container System
        </h2>
        <p className="text-lg text-content-primary mb-12 max-w-3xl">
          Container system with responsive gutters following our design tokens. 
          Content containers use larger gutters (24px/64px) while navigation uses smaller gutters (16px/32px).
        </p>

        {/* Container Guidelines */}
        <div className="bg-surface-tertiary rounded-lg p-6 mb-12">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Container Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Mobile Gutters</h4>
              <p className="text-content-primary">24px content / 16px navigation</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Desktop Gutters</h4>
              <p className="text-content-primary">64px content / 32px navigation</p>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Breakpoint</h4>
              <p className="text-content-primary">768px (mobile to desktop)</p>
            </div>
          </div>
        </div>

        {/* Container Examples */}
        <div className="space-y-8">
          {containers.map((container, index) => (
            <ContainerExample key={index} container={container} />
          ))}
        </div>

        {/* Usage Examples */}
        <div className="bg-surface-tertiary rounded-lg p-6 mt-12">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Common Usage Patterns
          </h3>
          <div className="space-y-4">
            <div>
              <code className="bg-white p-2 rounded font-mono text-sm">
                {'<div className="container-outer">'}
              </code>
              <p className="text-content-muted text-sm mt-1">
                Use for full-width sections like heroes, footers, and major page divisions
              </p>
            </div>
            <div>
              <code className="bg-white p-2 rounded font-mono text-sm">
                {'<div className="container-inner max-w-text">'}
              </code>
              <p className="text-content-muted text-sm mt-1">
                Combine containers for optimal reading width within inner constraints
              </p>
            </div>
            <div>
              <code className="bg-white p-2 rounded font-mono text-sm">
                {'<nav className="container-nav">'}
              </code>
              <p className="text-content-muted text-sm mt-1">
                Special navigation container with specific gutter requirements
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}