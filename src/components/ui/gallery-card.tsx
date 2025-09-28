"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryCardProps {
  title: string;
  href: string;
  image: string;
  logo?: string;
  client?: string;
  className?: string;
}

export function GalleryCard({
  title,
  href,
  image,
  logo = "/castle_green_logo.svg",
  client,
  className,
}: GalleryCardProps) {
  return (
    <>
      {/* Desktop version with hover effects */}
      <div className="hidden md:block">
        <Link href={href} className="block h-full group">
          <div className={cn(
            "relative h-[450px] w-[450px] rounded-lg overflow-hidden",
            className
          )}>
            {/* Background Image */}
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Inactive State - No Overlay */}
            
            {/* Active/Hover State - Full Content */}
            <div className="absolute inset-0 bg-surface-light flex flex-col justify-end p-8 text-content-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
              {/* Logo - positioned above title */}
              <div className="mb-4">
                <Image 
                  src={logo}
                  alt={client || "Logo"}
                  width={128}
                  height={32}
                  className="h-8 w-auto object-contain brightness-0"
                />
              </div>
              
              {/* Title */}
              <h3 className="title-3xl font-featured leading-tight mb-4">
                {title}
              </h3>
              
              {/* Read More Link */}
              <div className="inline-flex items-center gap-2 text-body-xl font-standard group/link">
                <span className="group-hover/link:underline">Read more</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover/link:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Mobile version - different layout */}
      <div className="block md:hidden">
        <Link href={href} className="block">
          <div className={cn("w-full", className)}>
            {/* Image Card */}
            <div className="relative h-[320px] w-full rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Logo in the white gap */}
            <div className="pt-6 pb-3">
              <Image 
                src={logo}
                alt={client || "Logo"}
                width={128}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            
            {/* Title text - left aligned to image */}
            <div>
              <h3 className="text-body-xl font-featured leading-tight text-content-primary">
                {title}
              </h3>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}