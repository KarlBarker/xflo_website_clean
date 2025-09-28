"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  leftAligned?: boolean;
}

export function SectionContainer({
  children,
  className,
  fullWidth = false,
  leftAligned = false,
}: SectionContainerProps) {
  return (
    <div className="w-full">
      <div className="container-outer">
        <div
          className={cn(
            "w-full",
            !fullWidth && "container-inner-no-pad",
            leftAligned ? "ml-0" : "mx-auto",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
