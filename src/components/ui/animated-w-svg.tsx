"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWSVGProps {
  className?: string;
  width?: number;
  height?: number;
}

export function AnimatedWSVG({
  className,
  width = 80,
  height = 80
}: AnimatedWSVGProps) {
  return (
    <div className={cn("animated-w-container", className)} style={{ width, height }}>
      {/* Frame-by-frame animation using background images */}
      <div
        className="w-animation"
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(/assets/w-frames/1.svg)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'wFrameSequence 2s infinite linear'
        }}
      />

      <style jsx>{`
        @keyframes wFrameSequence {
          0% { background-image: url(/assets/w-frames/1.svg); }
          3.33% { background-image: url(/assets/w-frames/2.svg); }
          6.67% { background-image: url(/assets/w-frames/3.svg); }
          10% { background-image: url(/assets/w-frames/4.svg); }
          13.33% { background-image: url(/assets/w-frames/5.svg); }
          16.67% { background-image: url(/assets/w-frames/6.svg); }
          20% { background-image: url(/assets/w-frames/7.svg); }
          23.33% { background-image: url(/assets/w-frames/8.svg); }
          26.67% { background-image: url(/assets/w-frames/9.svg); }
          30% { background-image: url(/assets/w-frames/10.svg); }
          33.33% { background-image: url(/assets/w-frames/11.svg); }
          36.67% { background-image: url(/assets/w-frames/12.svg); }
          40% { background-image: url(/assets/w-frames/13.svg); }
          43.33% { background-image: url(/assets/w-frames/14.svg); }
          46.67% { background-image: url(/assets/w-frames/15.svg); }
          50% { background-image: url(/assets/w-frames/16.svg); }
          53.33% { background-image: url(/assets/w-frames/17.svg); }
          56.67% { background-image: url(/assets/w-frames/18.svg); }
          60% { background-image: url(/assets/w-frames/19.svg); }
          63.33% { background-image: url(/assets/w-frames/20.svg); }
          66.67% { background-image: url(/assets/w-frames/21.svg); }
          70% { background-image: url(/assets/w-frames/22.svg); }
          73.33% { background-image: url(/assets/w-frames/23.svg); }
          76.67% { background-image: url(/assets/w-frames/24.svg); }
          80% { background-image: url(/assets/w-frames/25.svg); }
          83.33% { background-image: url(/assets/w-frames/26.svg); }
          86.67% { background-image: url(/assets/w-frames/27.svg); }
          90% { background-image: url(/assets/w-frames/28.svg); }
          93.33% { background-image: url(/assets/w-frames/29.svg); }
          96.67% { background-image: url(/assets/w-frames/30.svg); }
          100% { background-image: url(/assets/w-frames/1.svg); }
        }

        /* Color theming via CSS filters */
        .nav-light .animated-w-container .w-animation {
          filter: invert(1) brightness(1.1);
        }

        .nav-dark .animated-w-container .w-animation {
          filter: none;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animated-w-container .w-animation {
            animation: none !important;
            background-image: url(/assets/w-frames/26.svg) !important;
          }
        }
      `}</style>
    </div>
  );
}