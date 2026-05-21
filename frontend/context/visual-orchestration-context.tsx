'use client';

import { type ReactNode, createContext, useContext } from 'react';
import {
  type VisualMode,
  type VisualState,
  useVisualOrchestration,
} from '@/hooks/useVisualOrchestration';

interface VisualOrchestrationContextValue {
  state: VisualState;
  setMode: (mode: VisualMode) => void;
}

const VisualOrchestrationContext = createContext<VisualOrchestrationContextValue | null>(null);

export function VisualOrchestrationProvider({ children }: { children: ReactNode }) {
  const value = useVisualOrchestration();

  return (
    <VisualOrchestrationContext.Provider value={value}>
      {children}
    </VisualOrchestrationContext.Provider>
  );
}

export function useVisualOrchestrationContext() {
  const context = useContext(VisualOrchestrationContext);

  if (!context) {
    throw new Error(
      'useVisualOrchestrationContext must be used within VisualOrchestrationProvider'
    );
  }

  return context;
}
