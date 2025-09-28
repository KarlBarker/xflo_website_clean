'use client';

import { useAiMode } from '@/context/ai-mode-context';
import { AiModeToggle } from './ai-mode-toggle';
import { AiChatInterface } from './ai-chat-interface';

export function AiModeContainer() {
  const { isAiMode, setAiMode } = useAiMode();

  return (
    <>
      {/* Toggle button - always visible */}
      <AiModeToggle 
        isAiMode={isAiMode} 
        onToggle={setAiMode} 
      />
      
      {/* Chat interface - only visible in AI mode */}
      {isAiMode && (
        <AiChatInterface 
          onClose={() => setAiMode(false)} 
        />
      )}
    </>
  );
}