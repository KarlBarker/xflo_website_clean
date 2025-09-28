import React from 'react';
import { cn } from '@/lib/utils';

interface ProcessingMessageProps {
  message: string;
  isFlashing?: boolean;
  className?: string;
}

export function ProcessingMessage({ 
  message, 
  isFlashing = false, 
  className 
}: ProcessingMessageProps) {
  return (
    <div className={cn(
      "processing-message rounded-lg p-3 bg-gray-100 text-gray-700 text-sm transition-opacity duration-300",
      isFlashing && "animate-pulse",
      className
    )}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
        {message}
      </div>
    </div>
  );
}