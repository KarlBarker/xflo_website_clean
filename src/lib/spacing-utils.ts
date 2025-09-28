/**
 * Spacing utilities for consistent block spacing across components
 */

export type SpacingSize = 'none' | 'tight' | 'compact' | 'element' | 'component' | 'section';

export interface SpacingProps {
  spacingTop?: SpacingSize;
  spacingBottom?: SpacingSize;
}

/**
 * Maps spacing size tokens to Tailwind classes using design system spacing scale
 * Uses responsive Tailwind utilities that match our design system values
 * Mobile: ~65% of desktop values (see theme.css for exact values)
 */
const spacingMap: Record<SpacingSize, { top: string; bottom: string }> = {
  'none': { top: 'pt-px', bottom: 'pb-px' },                               // 1px (prevents white gaps)
  'tight': { top: 'pt-2', bottom: 'pb-2' },                                 // 8px (same on mobile/desktop)
  'compact': { top: 'pt-3 md:pt-4', bottom: 'pb-3 md:pb-4' },              // 12px → 16px
  'element': { top: 'pt-4 md:pt-6', bottom: 'pb-4 md:pb-6' },              // 16px → 24px  
  'component': { top: 'pt-8 md:pt-12', bottom: 'pb-8 md:pb-12' },          // 32px → 48px
  'section': { top: 'pt-16 md:pt-24', bottom: 'pb-16 md:pb-24' },          // 64px → 96px
};

/**
 * Maps CMS spacing values to SpacingSize tokens
 */
const mapCMSSpacing = (cmsValue?: string | SpacingSize): SpacingSize | undefined => {
  if (!cmsValue) return undefined;
  
  // If it's already a SpacingSize token, return it
  if (typeof cmsValue === 'string' && ['none', 'tight', 'compact', 'element', 'component', 'section'].includes(cmsValue)) {
    return cmsValue as SpacingSize;
  }
  
  // Map CMS pixel values to SpacingSize tokens
  const cmsSpacingMap: Record<string, SpacingSize> = {
    '0px': 'none',
    '8px': 'tight', 
    '16px': 'compact',
    '24px': 'element',
    '48px': 'component',
    '96px': 'section',
  };
  
  return cmsSpacingMap[cmsValue] || undefined;
};

/**
 * Gets Tailwind spacing classes for top and bottom padding
 * 
 * @param spacingTop - Top spacing size (defaults to 'component')
 * @param spacingBottom - Bottom spacing size (defaults to 'section')
 * @returns Object with topClass and bottomClass strings
 */
export const getSpacingClasses = (
  spacingTop?: string | SpacingSize, 
  spacingBottom?: string | SpacingSize
) => {
  // Default to moderate top spacing and full section bottom spacing
  const defaultTop: SpacingSize = 'component';    // 48px
  const defaultBottom: SpacingSize = 'section';   // 96px
  
  const topSize = mapCMSSpacing(spacingTop) ?? defaultTop;
  const bottomSize = mapCMSSpacing(spacingBottom) ?? defaultBottom;
  
  return {
    topClass: spacingMap[topSize].top,
    bottomClass: spacingMap[bottomSize].bottom,
  };
};

/**
 * Helper to combine spacing classes with other classes
 */
export const withSpacing = (
  baseClasses: string,
  spacingTop?: SpacingSize,
  spacingBottom?: SpacingSize
): string => {
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);
  return `${baseClasses} ${topClass} ${bottomClass}`;
};