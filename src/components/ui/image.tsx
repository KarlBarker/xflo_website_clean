"use client"

import * as React from "react"
import NextImage, { ImageProps as NextImageProps } from "next/image"
import { cn } from "@/lib/utils"

export interface ImageProps extends NextImageProps {
  className?: string
  aspectRatio?: "square" | "video" | "wide" | "custom"
  width?: number
  height?: number
  fill?: boolean
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  alt: string // Make alt required for accessibility
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, aspectRatio, width, height, fill = false, rounded = "none", alt, ...props }, ref) => {
    const roundedClasses = {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    }
    
    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      wide: "aspect-[21/9]",
      custom: "",
    }
    
    return (
      <div
        className={cn(
          "overflow-hidden",
          aspectRatio && aspectRatioClasses[aspectRatio],
          roundedClasses[rounded],
          className
        )}
        style={
          aspectRatio === "custom" && width && height
            ? { aspectRatio: `${width} / ${height}` }
            : undefined
        }
        role="img"
        aria-label={alt}
      >
        <NextImage
          ref={ref}
          width={width}
          height={height}
          fill={fill}
          alt={alt} // Alt text is now required
          className={cn("object-cover", roundedClasses[rounded])}
          {...props}
        />
      </div>
    )
  }
)

Image.displayName = "Image"

export { Image }
