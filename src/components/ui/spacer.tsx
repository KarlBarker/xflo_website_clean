"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface SpacerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
}

export function Spacer({
  className,
  size = 'medium',
}: SpacerProps) {
  const sizeClasses = {
    small: 'h-8', // 2rem, 32px
    medium: 'h-16', // 4rem, 64px
    large: 'h-24', // 6rem, 96px
    xl: 'h-32', // 8rem, 128px
  };
  
  return (
    <div className={cn("w-full", sizeClasses[size], className)} aria-hidden="true" />
  );
}
