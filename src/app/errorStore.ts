import { create } from "zustand"; // instal zustand for ts: npm i zustand
import type { GlobalError } from "../types/errors";

interface GlobalErrorState {
  error: GlobalError | null;
  push: (err: Omit<GlobalError, "id" | "timestamp">) => void;
  clear: () => void;
}

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
  error: null,

  push: (err) =>
    set({
      error: {
        ...err,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      },
    }),

  clear: () => set({ error: null }),
}));

// ← Toto je klíč: přístup ke store BEZ hooku
// Použitelné kdekoliv — v class komponentách, window handlerech, mimo React
export const errorStore = useGlobalErrorStore.getState;