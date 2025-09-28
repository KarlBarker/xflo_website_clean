'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AiModeContextType {
  isAiMode: boolean;
  toggleAiMode: () => void;
  setAiMode: (mode: boolean) => void;
}

const AiModeContext = createContext<AiModeContextType | undefined>(undefined);

export function AiModeProvider({ children }: { children: ReactNode }) {
  const [isAiMode, setIsAiMode] = useState(false);

  const toggleAiMode = () => {
    setIsAiMode(prev => !prev);
  };

  const setAiMode = (mode: boolean) => {
    setIsAiMode(mode);
  };

  return (
    <AiModeContext.Provider value={{ isAiMode, toggleAiMode, setAiMode }}>
      {children}
    </AiModeContext.Provider>
  );
}

export function useAiMode() {
  const context = useContext(AiModeContext);
  if (context === undefined) {
    throw new Error('useAiMode must be used within an AiModeProvider');
  }
  return context;
}