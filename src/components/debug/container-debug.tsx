"use client";

import React from 'react';

interface ContainerDebugProps {
  enabled?: boolean;
}

export function ContainerDebug({ enabled = false }: ContainerDebugProps) {
  if (!enabled) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {/* RED: Main viewport container */}
      <div className="w-full h-full border-2 border-red-500 border-dashed bg-red-500/5">
        <div className="h-full flex items-end justify-center pb-20">
          <span className="bg-red-500 text-white px-2 py-1 text-xs">
            RED: Main viewport container
          </span>
        </div>
      </div>
      
      {/* BLUE: 1500px container (container-outer) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="container-outer h-full border-2 border-blue-500 border-dashed bg-blue-500/5">
          <div className="h-full flex items-end justify-center pb-16">
            <span className="bg-blue-500 text-white px-2 py-1 text-xs">
              BLUE: container-outer (1500px + gutters)
            </span>
          </div>
        </div>
      </div>
      
      {/* GREEN: 1180px container (container-inner) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="container-outer h-full">
          <div className="container-inner-no-pad h-full border-2 border-green-500 border-dashed bg-green-500/5">
            <div className="h-full flex items-end justify-center pb-12">
              <span className="bg-green-500 text-white px-2 py-1 text-xs">
                GREEN: container-inner-no-pad (1180px)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ORANGE: 784px text width container */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="container-outer h-full">
          <div className="container-inner-no-pad h-full">
            <div className="max-w-[784px] mx-auto h-full border-2 border-orange-500 border-dashed bg-orange-500/5">
              <div className="h-full flex items-end justify-center pb-8">
                <span className="bg-orange-500 text-black px-2 py-1 text-xs">
                  ORANGE: Text width (784px)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}