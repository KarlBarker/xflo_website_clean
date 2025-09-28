import React from 'react';
import { DesignSystemLayout } from '@/components/design-system/design-system-layout';
import { ColorPalette } from '@/components/design-system/color-palette';
import { TypographyScale } from '@/components/design-system/typography-scale';
import { ContainerSystem } from '@/components/design-system/container-system';
import { SpacingScale } from '@/components/design-system/spacing-scale';
import { ComponentShowcase } from '@/components/design-system/component-showcase';
import { BorderRadiusScale } from '@/components/design-system/border-radius-scale';

export default function DesignSystemPage() {
  return (
    <DesignSystemLayout>
      {/* Introduction */}
      <section className="mb-16">
        <div className="container-inner">
          <h1 className="title-6xl font-featured text-content-primary mb-6">
            R3 Digital Design System
          </h1>
          <p className="text-lg text-content-primary max-w-3xl leading-relaxed mb-8">
            A comprehensive design system built on <strong>HSL colors</strong> and <strong>Tailwind CSS v4</strong> with semantic token extensions. 
            This interface matches exactly with our design tokens and serves as the single source of truth for designers and developers.
          </p>
          
          {/* System Architecture Highlight */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="title-3xl font-semibold text-blue-900 mb-4">
              🎨 Design System Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">HSL Color System</h4>
                <p className="text-sm">Semantic tokens like <code className="bg-blue-100 px-1 rounded">bg-surface-primary</code> and <code className="bg-blue-100 px-1 rounded">text-content-secondary</code></p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tailwind Foundation</h4>
                <p className="text-sm">Standard utilities like <code className="bg-blue-100 px-1 rounded">p-4</code>, <code className="bg-blue-100 px-1 rounded">gap-6</code>, and <code className="bg-blue-100 px-1 rounded">rounded-lg</code></p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dual Approach</h4>
                <p className="text-sm">Choose semantic <code className="bg-blue-100 px-1 rounded">py-spacing-section</code> OR Tailwind <code className="bg-blue-100 px-1 rounded">py-24</code></p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-tertiary rounded-lg p-6">
            <h3 className="title-3xl font-semibold text-content-primary mb-4">
              Figma ↔ Code Token Mapping
            </h3>
            <p className="text-content-primary mb-4">
              Use these exact token names in Figma to ensure seamless design-to-code handoffs. 
              Each section below shows the complete mapping from Figma tokens to CSS classes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <strong className="text-content-primary">Figma Token:</strong>
                <code className="block bg-white p-2 rounded mt-1 text-sm">
                  Surface/Primary
                </code>
              </div>
              <div>
                <strong className="text-content-primary">CSS Class:</strong>
                <code className="block bg-white p-2 rounded mt-1 text-sm">
                  bg-surface-primary
                </code>
              </div>
              <div>
                <strong className="text-content-primary">Value:</strong>
                <code className="block bg-white p-2 rounded mt-1 text-sm">
                  #171717
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color System */}
      <ColorPalette />

      {/* Typography */}
      <TypographyScale />

      {/* Container System */}
      <ContainerSystem />

      {/* Spacing */}
      <SpacingScale />

      {/* Border Radius */}
      <BorderRadiusScale />

      {/* Component Examples */}
      <ComponentShowcase />
    </DesignSystemLayout>
  );
}