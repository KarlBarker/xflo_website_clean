"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Download, Settings } from 'lucide-react';

interface ComponentExample {
  name: string;
  description: string;
  figmaComponent: string;
  codeExample: string;
  component: React.ReactNode;
}

const componentExamples: ComponentExample[] = [
  {
    name: "Primary Button",
    description: "Main call-to-action buttons with semantic styling",
    figmaComponent: "Button/Primary",
    codeExample: `<Button variant="default" size="default">
  Get In Touch
  <ArrowRight className="h-4 w-4" />
</Button>`,
    component: (
      <Button variant="default" size="default">
        Get In Touch
        <ArrowRight className="h-4 w-4" />
      </Button>
    )
  },
  {
    name: "Secondary Button", 
    description: "Secondary actions with outline styling",
    figmaComponent: "Button/Secondary",
    codeExample: `<Button variant="outline" size="default">
  Download
  <Download className="h-4 w-4" />
</Button>`,
    component: (
      <Button variant="outline" size="default">
        Download  
        <Download className="h-4 w-4" />
      </Button>
    )
  },
  {
    name: "Ghost Button",
    description: "Subtle actions with minimal styling", 
    figmaComponent: "Button/Ghost",
    codeExample: `<Button variant="ghost" size="default">
  <Settings className="h-4 w-4" />
  Settings
</Button>`,
    component: (
      <Button variant="ghost" size="default">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    )
  },
  {
    name: "Card Component",
    description: "Standard content cards with proper spacing",
    figmaComponent: "Card/Standard", 
    codeExample: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content with semantic typography and spacing.</p>
  </CardContent>
</Card>`,
    component: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content with semantic typography and spacing.</p>
        </CardContent>
      </Card>
    )
  },
  {
    name: "Badge Components",
    description: "Status indicators and labels",
    figmaComponent: "Badge/Default",
    codeExample: `<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge> 
<Badge variant="outline">Outline</Badge>`,
    component: (
      <div className="flex gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    )
  }
];

function ComponentExample({ example }: { example: ComponentExample }) {
  return (
    <div className="border border-stroke-primary rounded-lg p-6">
      {/* Component Preview */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200 flex items-center justify-center min-h-24">
        {example.component}
      </div>
      
      {/* Details */}
      <div className="space-y-4">
        <div>
          <h4 className="text-content-primary font-semibold mb-1">{example.name}</h4>
          <p className="text-content-muted text-sm">{example.description}</p>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="text-xs text-content-muted">Figma Component:</span>
            <code className="block bg-neutral-100 p-2 rounded text-xs font-mono">
              {example.figmaComponent}
            </code>
          </div>
          
          <div>
            <span className="text-xs text-content-muted">Code Example:</span>
            <pre className="bg-neutral-100 p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {example.codeExample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComponentShowcase() {
  return (
    <section className="mb-16">
      <div className="container-inner">
        <h2 className="title-4xl font-semibold text-content-primary mb-8">
          Component Examples
        </h2>
        <p className="text-lg text-content-primary mb-12 max-w-3xl">
          Common UI components built with our design system tokens. These components 
          automatically inherit semantic styling and maintain consistency across the application.
        </p>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {componentExamples.map((example, index) => (
            <ComponentExample key={index} example={example} />
          ))}
        </div>

        {/* Design System Guidelines */}
        <div className="bg-surface-tertiary rounded-lg p-6">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Design-to-Code Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-content-primary mb-3">For Designers</h4>
              <ul className="space-y-2 text-sm text-content-primary">
                <li>• Use tokens from this page as Figma variable names</li>
                <li>• Reference component variants shown here</li>
                <li>• Specify exact CSS classes in handoff specs</li>
                <li>• Maintain consistency with semantic naming</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-3">For Developers</h4>
              <ul className="space-y-2 text-sm text-content-primary">
                <li>• Use semantic classes instead of arbitrary values</li>
                <li>• Reference this page for token availability</li>
                <li>• Extend components using design system patterns</li>
                <li>• Maintain token consistency in new components</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-8 bg-white border border-stroke-primary rounded-lg p-6">
          <h3 className="title-3xl font-semibold text-content-primary mb-4">
            Quick Reference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Colors</h4>
              <code className="text-xs">bg-surface-*</code><br/>
              <code className="text-xs">text-content-*</code><br/>
              <code className="text-xs">border-stroke-*</code>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Typography</h4>
              <code className="text-xs">title-*xl</code><br/>
              <code className="text-xs">text-navigation</code><br/>
              <code className="text-xs">font-featured</code>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Layout</h4>
              <code className="text-xs">container-outer</code><br/>
              <code className="text-xs">container-inner</code><br/>
              <code className="text-xs">w-text</code>
            </div>
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Spacing</h4>
              <code className="text-xs">spacing-section</code><br/>
              <code className="text-xs">spacing-component</code><br/>
              <code className="text-xs">spacing-element</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}