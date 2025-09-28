'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const bigBallRef = useRef<HTMLDivElement>(null);
  const smallBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bigBall = bigBallRef.current;
    const smallBall = smallBallRef.current;
    
    if (!bigBall || !smallBall) return;

    // Move the cursor
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(bigBall, {
        duration: 0.4,
        x: e.clientX - 15,
        y: e.clientY - 15,
        ease: "power2.out"
      });
      
      gsap.to(smallBall, {
        duration: 0.1,
        x: e.clientX - 5,
        y: e.clientY - 7,
        ease: "power2.out"
      });
    };

    // Hover an element
    const onMouseHover = () => {
      gsap.to(bigBall, {
        duration: 0.3,
        scale: 2.5,
        ease: "power2.out"
      });
    };

    const onMouseHoverOut = () => {
      gsap.to(bigBall, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out"
      });
    };

    // Add listeners
    document.body.addEventListener('mousemove', onMouseMove);
    
    // Add hover listeners using event delegation
    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .hoverable')) {
        onMouseHover();
      }
    };

    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .hoverable')) {
        onMouseHoverOut();
      }
    };

    // Use event delegation on document for all hoverable elements
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Hide cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      if (bigBall) bigBall.style.display = 'none';
      if (smallBall) smallBall.style.display = 'none';
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = 'none';
    }

    // Cleanup
    return () => {
      document.body.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        isolation: 'isolate'
      }}
    >
      <div 
        ref={bigBallRef}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          backdropFilter: 'invert(1) hue-rotate(180deg)',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        }}
      >
      </div>
      
      <div 
        ref={smallBallRef}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          borderRadius: '50%',
          width: '10px',
          height: '10px',
          backdropFilter: 'invert(1) hue-rotate(180deg)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
      </div>
    </div>
  );
}