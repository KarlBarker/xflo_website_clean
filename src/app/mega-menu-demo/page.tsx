import React from 'react';
import { StickyNavigationMega } from '@/components/blocks/sticky-navigation-mega';
import { getNavigationData } from '@/lib/navigation';

export default async function MegaMenuDemoPage() {
  const navigationData = await getNavigationData();

  return (
    <div className="min-h-screen bg-surface-light">
      {/* Navigation with Mega Menu enabled */}
      <StickyNavigationMega 
        navigationData={navigationData} 
        useMegaMenu={true}
      />
      
      {/* Content */}
      <main className="pt-32 pb-16">
        <div className="container-outer">
          <div className="container-inner">
            <h1 className="title-6xl font-black mb-8 text-content-primary">
              Mega Menu Demo
            </h1>
            <p className="text-lg text-content-muted mb-8">
              This page demonstrates the new mega menu navigation. Click the burger menu icon to see the mega menu in action.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-tertiary p-6 rounded-lg">
                <h2 className="title-3xl font-semibold mb-4 text-content-primary">
                  Mega Menu Features
                </h2>
                <ul className="space-y-2 text-content-muted">
                  <li>• Container-based layout with proper spacing</li>
                  <li>• Hover states with red color and arrow icons</li>
                  <li>• Responsive design (desktop mega menu, mobile traditional)</li>
                  <li>• Proper blend mode compatibility</li>
                  <li>• Red CTA section with contact information</li>
                </ul>
              </div>
              
              <div className="bg-surface-tertiary p-6 rounded-lg">
                <h2 className="title-3xl font-semibold mb-4 text-content-primary">
                  Technical Implementation
                </h2>
                <ul className="space-y-2 text-content-muted">
                  <li>• Toggleable navigation system</li>
                  <li>• Preserves existing sticky navigation</li>
                  <li>• Uses semantic design system classes</li>
                  <li>• Maintains accessibility standards</li>
                  <li>• Smooth animations and transitions</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-16 p-8 bg-surface-primary rounded-lg">
              <h2 className="title-4xl font-semibold mb-4 text-content-inverse">
                Testing the Mega Menu
              </h2>
              <p className="text-content-inverse mb-4">
                Click the burger menu in the top right to open the mega menu. Test the hover states 
                on the navigation links and try the &quot;Get in touch&quot; CTA button.
              </p>
              <p className="text-content-inverse opacity-80">
                The mega menu is designed to be ~660px deep to ensure it fits on most desktop screens 
                without requiring scrolling.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}