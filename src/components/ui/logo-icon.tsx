import React from 'react';
import Image from 'next/image';

interface LogoIconProps {
  darkMode?: "False" | "True";
  className?: string;
}

export function LogoIcon({ darkMode = "False", className }: LogoIconProps) {
  // xflo_logo_new2025.svg has black paths, so we invert for dark mode

  // Override any height classes with inline styles for precise control
  const logoStyle = {
    width: '80px !important',
    height: '22px !important',
    maxHeight: '22px !important',
    objectFit: 'contain' as const,
    display: 'block'
  };

  if (darkMode === "True") {
    // Dark background - invert black logo to white
    return (
      <Image
        src="/xflo_logo_new2025.svg"
        alt="xFlo"
        width={80}
        height={22}
        className={`${className} invert`}
        style={logoStyle}
        priority
      />
    );
  } else {
    // Light background - keep black logo as is
    return (
      <Image
        src="/xflo_logo_new2025.svg"
        alt="xFlo"
        width={80}
        height={22}
        className={className}
        style={logoStyle}
        priority
      />
    );
  }
}
