"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeroTextProps {
  fixedText?: string;
  rotatingWords?: string[];
  subtitle?: string;
  className?: string;
}

export function AnimatedHeroText({
  fixedText = "The catalyst for",
  rotatingWords = [
    "Alignment",
    "Strategy",
    "Performance",
    "Experience",
    "Innovation",
    "Transformational\nGrowth"
  ],
  subtitle = "Driving Growth Across Marketing, RevOps & Technology",
  className
}: AnimatedHeroTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentWordIndex(prev => (prev + 1) % rotatingWords.length);
        setIsVisible(true);
      }, 50);

    }, currentWordIndex === rotatingWords.length - 1 ? 10000 : 500);

    return () => clearTimeout(timer);
  }, [currentWordIndex, rotatingWords.length]);

  const isLastWord = currentWordIndex === rotatingWords.length - 1;

  return (
    <div className="text-white -mt-8 md:-mt-32 pr-6 md:pr-12 relative">
      <div className="space-y-4 md:space-y-10">
        <div className="font-light text-white" style={{ fontSize: 'clamp(2rem, 8vw, 6.5rem)', textShadow: '0 1px 6px rgba(0, 0, 0, 0.4)' }}>
          {fixedText}
        </div>

        <div className="relative" style={{ height: 'clamp(6rem, 18vw, 18rem)' }}>
          <div
            className={cn(
              "font-black absolute w-full text-white leading-none transition-opacity duration-75 top-0",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ fontSize: 'clamp(2.25rem, 10vw, 8rem)', textShadow: '0 1px 6px rgba(0, 0, 0, 0.4)' }}
          >
            {rotatingWords[currentWordIndex].split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-base md:text-xl font-light text-white/80 max-w-3xl mt-6 md:mt-8" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}>
          {subtitle}
        </p>
      )}

      {/* Bouncing scroll arrow - absolutely positioned so it doesn't affect layout */}
      {isLastWord && isVisible && (
        <div className="absolute left-0 top-full mt-8 md:mt-16">
          <div className="animate-bounce">
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-white rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}