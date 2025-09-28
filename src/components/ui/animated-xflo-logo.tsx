"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedXfloLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function AnimatedXfloLogo({
  className
}: AnimatedXfloLogoProps) {
  return (
    <img
      src="/xflo_logo_new2025.svg"
      alt="xFlo"
      className={cn("xflo-logo", className)}
      style={{
        display: 'block',
        height: '28px',
        width: 'auto',
        maxHeight: '28px',
        marginTop: '22px'
      }}
    />
  );
}