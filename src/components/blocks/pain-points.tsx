import React from "react";
import { cn } from "@/lib/utils";
import { SectionContainer } from "./section-container";
import { Badge } from "@/components/ui/badge";
import { getSpacingClasses, type SpacingProps } from "@/lib/spacing-utils";

interface PainPointsProps extends SpacingProps {
  title?: string;
  painPoints?: string[];
  className?: string;
}

export default function PainPoints({ 
  title = "Pain Points",
  painPoints = [
    "Manual processes slowing down sales",
    "Fragmented systems reducing efficiency", 
    "Showroom-dependent sales limiting reach",
    "Lack of buyer flexibility and speed",
    "Limited digital customer experience"
  ],
  className,
  spacingTop,
  spacingBottom
}: PainPointsProps) {

  // Return null if no pain points provided
  if (!painPoints || painPoints.length === 0) {
    return null;
  }

  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);

  return (
    <div className={cn("bg-surface-primary w-full", topClass, bottomClass, className)}>
      <SectionContainer leftAligned={false}>
        <div className="">
          <h2 className="title-2xl font-featured text-content-inverse mb-8">
            {title}
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-start">
          {painPoints.map((point, index) => (
            <Badge
              key={index}
              className="bg-badge-secondary text-content-inverse text-base font-standard border-transparent px-3 py-1.5 rounded-button h-auto"
            >
              {point}
            </Badge>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
