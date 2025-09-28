"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SectionContainer } from './section-container';
import { getBackgroundTheme } from '@/lib/theme-utils';
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils';
import { BookingModal, useBookingModal } from '@/components/ui/booking-modal';

interface CTASectionProps extends SpacingProps {
  eyebrow?: string;
  title?: string;
  primaryCTA?: {
    text: string;
    href: string;
    type?: 'email' | 'phone' | 'link' | 'booking';
  };
  secondaryCTA?: {
    text: string;
    href: string;
    type?: 'email' | 'phone' | 'link' | 'booking';
  };
  backgroundColor?: string;
  containerBackgroundColor?: string;
  width?: 'full' | 'container';
  className?: string;
  calendarUrl?: string; // Google Calendar booking URL
}

export function CTASection({
  eyebrow = "LET'S WORK TOGETHER",
  title = "Discuss your project with us.",
  primaryCTA = {
    text: "HELLO@KYAN.COM",
    href: "mailto:hello@kyan.com",
    type: "email"
  },
  secondaryCTA = {
    text: "+44 (0) 1483 548282",
    href: "tel:+441483548282",
    type: "phone"
  },
  backgroundColor = 'primary',
  containerBackgroundColor = 'light-gray',
  width = 'full',
  spacingTop,
  spacingBottom,
  className,
  calendarUrl = "https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE_ID",
}: CTASectionProps) {
  const bookingModal = useBookingModal();
  // Use theme utilities for consistent color handling
  const backgroundTheme = getBackgroundTheme(backgroundColor);
  const containerTheme = getBackgroundTheme(containerBackgroundColor);

  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);

  // Content JSX
  const ctaContent = (
    <div className="w-text mx-auto text-center px-6 md:px-0">
      {/* Eyebrow text */}
      {eyebrow && (
        <p className="text-sm font-standard tracking-widest mb-6 opacity-70 text-adaptive">
          {eyebrow}
        </p>
      )}
      
      {/* Main title */}
      {title && (
        <h2 className="title-5xl font-featured mb-12 text-adaptive">
          {title}
        </h2>
      )}
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {primaryCTA?.text && (
          <>
            {(primaryCTA.type === 'booking' || primaryCTA.href?.includes('calendar.app.google') || primaryCTA.href?.includes('calendar.google.com')) ? (
              <Button
                variant="outline"
                onClick={() => {
                  // Open in new tab
                  window.open(primaryCTA.href, '_blank');
                }}
                className={cn(
                  "px-8 py-2 text-lg tracking-wide min-w-[240px] hover:bg-white hover:text-black cta-button-adaptive",
                )}
              >
                {primaryCTA.text}
              </Button>
            ) : (
              <Button
                variant="outline"
                asChild
                className={cn(
                  "px-8 py-2 text-lg tracking-wide min-w-[240px] hover:bg-white hover:text-black cta-button-adaptive",
                )}
              >
                <a href={primaryCTA.href}>
                  {primaryCTA.text}
                </a>
              </Button>
            )}
          </>
        )}

        {secondaryCTA?.text && (
          <>
            {secondaryCTA.type === 'booking' ? (
              <Button
                variant="outline"
                onClick={bookingModal.openModal}
                className={cn(
                  "px-8 py-2 text-lg tracking-wide min-w-[240px] hover:bg-white hover:text-black cta-button-adaptive",
                )}
              >
                {secondaryCTA.text}
              </Button>
            ) : (
              <Button
                variant="outline"
                asChild
                className={cn(
                  "px-8 py-2 text-lg tracking-wide min-w-[240px] hover:bg-white hover:text-black cta-button-adaptive",
                )}
              >
                <a href={secondaryCTA.href}>
                  {secondaryCTA.text}
                </a>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn("w-full", topClass, bottomClass, backgroundTheme.bgClass, className)}
        data-background={backgroundTheme.bgContext}
      >
        {width === 'container' ? (
          // Container width: outer has background, inner container has containerBackgroundColor
          <div className="container-outer">
            <div
              className={cn("container-inner-no-pad mx-auto py-12 px-12 rounded-lg", containerTheme.bgClass)}
              data-background={containerTheme.bgContext}
            >
              {ctaContent}
            </div>
          </div>
        ) : (
          // Full width: backgroundColor applied to outer wrapper including spacing
          <SectionContainer className="py-12">
            {ctaContent}
          </SectionContainer>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={bookingModal.closeModal}
        calendarUrl={primaryCTA?.href || calendarUrl}
        title="Book a Discovery Call"
      />
    </>
  );
}

export default CTASection;