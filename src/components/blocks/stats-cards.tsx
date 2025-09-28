"use client"

import { cn } from "@/lib/utils"
import { SectionContainer } from './section-container'
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils'

interface StatItem {
  value: string
  description: string
  cardColor?: string
  color?: string // Keep for backwards compatibility
}

interface StatsCardsProps extends SpacingProps {
  className?: string
  variant?: "desktop" | "mobile"
  title?: string
  stats?: StatItem[]
  backgroundColor?: 'white' | 'White' | 'light-gray' | 'Light Gray' | 'primary' | 'primary-dark' | 'tertiary'
}

const defaultStats: StatItem[] = [
  {
    value: "7%",
    description: "increase in home extras sales",
    cardColor: "secondary"
  },
  {
    value: "20%",
    description: "increase in customer engagement",
    cardColor: "secondary"
  },
  {
    value: "15%",
    description: "improvement in marketing ROI",
    cardColor: "secondary"
  }
]

export function StatsCards({ 
  className, 
  title = "Headline Performance",
  stats = defaultStats,
  backgroundColor = 'white',
  spacingTop,
  spacingBottom
}: StatsCardsProps) {
  // Map background colors to design system classes
  const bgColorMap = {
    'white': 'bg-surface-light',
    'White': 'bg-surface-light',
    'light-gray': 'bg-surface-tertiary',
    'Light Gray': 'bg-surface-tertiary',
    'primary': 'bg-surface-primary',
    'primary-dark': 'bg-surface-primary',
    'tertiary': 'bg-surface-tertiary'
  };
  
  
  const bgClass = bgColorMap[backgroundColor] || 'bg-surface-tertiary';
  
  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  
  // Determine text color based on background
  const textColorClass = (backgroundColor === 'primary' || backgroundColor === 'primary-dark') ? 'text-content-inverse' : 'text-content-primary';
  return (
    <section 
      className={cn(
        "w-full",
        bgClass,
        topClass,
        bottomClass,
        className
      )}
      aria-label="Statistics section"
    >
      <SectionContainer leftAligned={false}>
        <h2 className={cn("title-2xl font-semibold mb-8 md:mb-12", textColorClass)}>
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} backgroundColor={backgroundColor} />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}

// Named export
export { StatsCards as StatsCardsComponent }

// Default export
// Individual stat card component - simplified
function StatCard({ stat, backgroundColor }: { stat: StatItem; backgroundColor?: string }) {
  // Handle both 'value' and 'percentage' fields from CMS for flexibility
  const displayValue = stat.value || (stat as any).percentage || 'No Value';

  
  // Individual card background - should be lighter than section background
  const cardBgClass = (backgroundColor === 'primary' || backgroundColor === 'primary-dark') ? 'bg-surface-secondary' : 'bg-surface-tertiary';
  
  // Text colors for individual cards
  const cardTextColorClass = (backgroundColor === 'primary' || backgroundColor === 'primary-dark') ? 'text-content-inverse' : 'text-content-primary';
  
  return (
    <div 
      className={cn(cardBgClass, "rounded-lg p-6 sm:p-8")}
    >
      <div className="flex flex-col space-y-4">
        <div className={cn("title-6xl font-extrabold text-content-brand")}>
          {displayValue}
        </div>
        <div className={cn("text-body-xl font-semibold", cardTextColorClass)}>
          {stat.description}
        </div>
      </div>
    </div>
  );
}

export default StatsCards