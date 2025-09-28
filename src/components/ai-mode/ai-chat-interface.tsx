'use client';

import Link from 'next/link';
import { LogoIcon } from '@/components/ui/logo-icon';
import { AnimatedBurger } from '@/components/ui/animated-burger';

interface AiChatInterfaceProps {
  onClose: () => void;
}

export function AiChatInterface({ onClose }: AiChatInterfaceProps) {
  return (
    <div className="fixed inset-0 bg-surface-light z-[9999] flex flex-col">
      {/* Header matching exact navigation structure */}
      <div className="w-full bg-surface-light border-b border-stroke-primary">
        <div className="w-full -mt-4">
          <div className="container-nav flex items-center justify-between">
            {/* Logo - matching navigation exactly */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center" aria-label="Home page">
                <LogoIcon 
                  darkMode="False"
                  className="h-8 w-auto" 
                  aria-hidden="true"
                />
              </Link>
            </div>
            
            {/* Spacer to push close button right */}
            <div className="flex-1"></div>
            
            {/* Close button - matching burger menu position exactly */}
            <div className="flex">
              <div className="pt-5 pb-2 -mr-4">
                <AnimatedBurger 
                  isOpen={true} 
                  onClick={onClose}
                  darkMode={false}
                  aria-label="Close AI Mode"
                  aria-expanded={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width iframe chat */}
      <div className="flex-1 w-full h-full overflow-hidden">
        <iframe 
          src="https://api.xflo.ai/api/public/embed/xflo_eded96086bb3aad469ed856bfa651c1a0235262b" 
          className="w-full h-full border-0"
          title="xFlo AI Assistant"
          allow="microphone; camera; autoplay; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          loading="eager"
        />
      </div>
    </div>
  );
}