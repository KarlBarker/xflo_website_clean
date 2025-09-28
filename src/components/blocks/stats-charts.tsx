"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SectionContainer } from './section-container'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { useCountAnimation } from '@/hooks/use-count-animation'

interface StatCardProps {
  stat: number // The actual number for the stat
  title: string // Main title
  description: string // Single description line
  chartBaseColor?: string // Background circle color
  chartValueColor?: string // Progress circle color
  className?: string
}

interface StatsChartsProps {
  stats?: StatCardProps[]
  className?: string
  chartBaseColor?: string // Global base color
  chartValueColor?: string // Global value color
}

// Color mapping using our design system (kept for future use)
// const colorMap: Record<string, string> = {
//   'neutral-100': 'hsl(0 0% 96%)',
//   'neutral-200': 'hsl(0 0% 90%)',
//   'neutral-300': 'hsl(0 0% 83%)',
//   'neutral-400': 'hsl(0 0% 64%)',
//   'neutral-500': 'hsl(0 0% 45%)',
//   'neutral-600': 'hsl(0 0% 32%)',
//   'neutral-700': 'hsl(0 0% 25%)',
//   'neutral-800': 'hsl(0 0% 15%)',
// }

function StatCard({ 
  stat, 
  title, 
  className 
}: StatCardProps) {
  // Animation hooks
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  })
  
  const animatedCount = useCountAnimation({
    end: stat,
    duration: 2000,
    trigger: isIntersecting
  })
  
  const animatedPercentage = useCountAnimation({
    end: Math.min(stat, 100),
    duration: 2000,
    trigger: isIntersecting
  })
  
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference
  
  // Get colors from map (keeping for future use)
  // const baseColor = colorMap[chartBaseColor] || chartBaseColor
  // const valueColor = colorMap[chartValueColor] || chartValueColor

  return (
    <Card ref={ref} className={cn("h-72 md:h-80 bg-transparent border-none shadow-none w-full", className)}>
      <CardContent className="flex flex-col items-center justify-center h-full pt-0 px-4 pb-4">
        {/* Progress Circle */}
        <div className="relative w-52 h-52 md:w-56 md:h-56 mb-4">
          <svg className="w-52 h-52 md:w-56 md:h-56 transform -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="hsl(0 0% 83%)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="hsl(0 0% 25%)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-[2000ms] ease-out"
            />
          </svg>
          {/* Stat text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="title-6xl font-extrabold text-content-secondary">
              {animatedCount > 100 ? `${animatedCount}%` : `${animatedCount}%`}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-content-inverse text-center leading-tight min-h-14 flex items-start justify-center px-4 whitespace-pre-line capitalize">
          {title}
        </h3>
      </CardContent>
    </Card>
  )
}

const defaultStats: StatCardProps[] = [
  {
    stat: 7,
    title: "Increase in home extras sales",
    description: ""
  },
  {
    stat: 20,
    title: "Increase in customer engagement", 
    description: ""
  },
  {
    stat: 15,
    title: "Improvement in marketing ROI",
    description: ""
  },
  {
    stat: 84,
    title: "User Adoption",
    description: ""
  }
]

export function StatsCharts({ 
  stats = defaultStats, 
  className,
  chartBaseColor = 'stone-200',
  chartValueColor = 'stone-500'
}: StatsChartsProps) {
  return (
    <section className={cn("w-full bg-surface-primary py-8 md:py-12", className)}>
      <SectionContainer leftAligned={false}>
        <h2 className="title-2xl font-semibold text-content-inverse mb-8">
          Headline Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              {...stat}
              chartBaseColor={stat.chartBaseColor || chartBaseColor}
              chartValueColor={stat.chartValueColor || chartValueColor}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}

export { StatCard }
export type { StatCardProps, StatsChartsProps }