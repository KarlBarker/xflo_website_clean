import React from 'react';
import { cn } from '@/lib/utils';

interface SolutionSectionProps {
  className?: string;
}

export function SolutionSection({ className }: SolutionSectionProps) {
  return (
    <div className={cn("w-full py-16 bg-surface-tertiary", className)}>
      <div className="container mx-auto max-w-[1500px] px-6 md:px-8 lg:px-12">
        <div className="w-full max-w-[1180px] mx-auto">
          <div className="flex flex-col max-w-[780px] mx-auto">
            <h3 className="title-3xl font-featured text-content-primary mb-4">
              The Solution
            </h3>
            <div className="text-lg font-standard text-content-primary flex flex-col gap-6">
              <p>
                We worked with Castle Green to move them from traditional systems to a digital-first platform.
                The result was Willow, a virtual assistant designed to transform the entire home-buying journey.
              </p>
              <p>
                Buyers could explore homes in detail using CGI walkthroughs, customise finishes and extras, and
                track their purchase from first click to final key handover. No need to book a showroom visit. No
                need to wait for a callback.
              </p>
              <p>
                Behind the scenes, Willow brought CRM, ecommerce and service support into one connected
                space. Buyers could chat in real time, report snags with annotated floorplans, and upload photos
                or video to speed up fixes. The Castle Green team gained full visibility of customer needs and
                freed up hours of admin time every week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
