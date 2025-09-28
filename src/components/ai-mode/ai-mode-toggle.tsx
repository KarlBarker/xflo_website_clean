'use client';

import { cn } from '@/lib/utils';

interface AiModeToggleProps {
  onToggle: (isAiMode: boolean) => void;
  isAiMode: boolean;
}

export function AiModeToggle({ onToggle, isAiMode }: AiModeToggleProps) {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[10000]">
      <button
        onClick={() => onToggle(!isAiMode)}
        className={cn(
          "px-4 py-1 rounded-bl-md rounded-br-md text-sm font-medium transition-all duration-300 ease-in-out",
          "shadow-lg backdrop-blur-sm border",
          isAiMode
            ? "bg-black/90 text-white border-white/20 hover:bg-black"
            : "bg-white/90 text-gray-900 border-gray-200 hover:bg-white"
        )}
      >
        {isAiMode ? '← Back to Website' : 'AI Mode'}
      </button>
    </div>
  );
}