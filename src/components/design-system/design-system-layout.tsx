"use client";

import React from 'react';
import { MainNavigation } from '@/components/blocks/main-navigation';
import { Footer } from '@/components/blocks/footer';

interface DesignSystemLayoutProps {
  children: React.ReactNode;
}

export function DesignSystemLayout({ children }: DesignSystemLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="relative z-50">
        <MainNavigation darkMode={false} />
      </div>
      
      {/* Content */}
      <main className="pt-8 pb-16">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}