/**
 * Theme utilities for consistent color handling across components
 */

/**
 * Maps CMS color values to normalized design system values
 * CMS sends capitalized values, we normalize to lowercase
 */
export const normalizeCMSColor = (color?: string): string => {
  if (!color) return 'white';
  
  const colorMap: Record<string, string> = {
    'White': 'white',
    'white': 'white',
    'Light Gray': 'light-gray',
    'light-gray': 'light-gray',
    'Primary': 'primary',
    'primary': 'primary',
    'Primary Dark': 'primary-dark',
    'primary-dark': 'primary-dark',
    'Dark': 'primary',
    'dark': 'primary',
    'Tertiary': 'tertiary',
    'tertiary': 'tertiary'
  };
  
  return colorMap[color] || 'white';
};

/**
 * Maps normalized color values to Tailwind background classes
 */
export const getBackgroundClass = (normalizedColor: string): string => {
  const bgMap: Record<string, string> = {
    'white': 'bg-surface-light',
    'light-gray': 'bg-surface-tertiary',
    'primary': 'bg-surface-primary',
    'primary-dark': 'bg-surface-primary',
    'tertiary': 'bg-surface-tertiary'
  };
  
  return bgMap[normalizedColor] || 'bg-surface-light';
};

/**
 * Determines if a background color should use light or dark text
 */
export const getBackgroundContext = (normalizedColor: string): 'light' | 'dark' => {
  const darkBackgrounds = ['primary', 'primary-dark'];
  return darkBackgrounds.includes(normalizedColor) ? 'dark' : 'light';
};

/**
 * Combined utility to get both background class and context
 */
export const getBackgroundTheme = (cmsColor?: string) => {
  const normalized = normalizeCMSColor(cmsColor);
  return {
    bgClass: getBackgroundClass(normalized),
    bgContext: getBackgroundContext(normalized),
    normalized
  };
};