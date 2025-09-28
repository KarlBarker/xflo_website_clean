// Responsive Image Types for CMS Integration

export interface ResponsiveImage {
  desktop: string;
  mobile?: string; // Optional - falls back to desktop
  alt: string;
  caption?: string;
}

export interface ImageShowcaseProps {
  images: ResponsiveImage[];
  displayType?: 'split' | 'dual' | 'full';
  backgroundColor?: 'white' | 'tertiary';
  className?: string;
}

// For Payload CMS Media Collection
export interface PayloadMediaItem {
  id: string;
  filename: string;
  alt: string;
  caption?: string;
  credit?: string;
  sizes?: {
    thumbnail?: PayloadImageSize;
    mobile?: PayloadImageSize;
    desktop?: PayloadImageSize;
    hero?: PayloadImageSize;
  };
}

export interface PayloadImageSize {
  filename: string;
  width: number;
  height: number;
  url: string;
}

// Helper function type for getting image URLs
export type GetImageUrlFunction = (
  media: PayloadMediaItem, 
  size?: 'mobile' | 'desktop' | 'hero'
) => string;