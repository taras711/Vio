import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type RightPanelMode = "persistent" | "modal";

type UIContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (value: boolean) => void;   // ← DOPLNIT TYP

  rightPanelContent: ReactNode | null;
  rightPanelMode: RightPanelMode;

  openRightPanel: (content: ReactNode, mode?: RightPanelMode) => void;
  closeRightPanel: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<ReactNode | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("persistent");

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const openRightPanel = (content: ReactNode, mode: RightPanelMode = "persistent") => {
    setRightPanelContent(content);
    setRightPanelMode(mode);
  };

  const closeRightPanel = () => {
    setRightPanelContent(null);
    setRightPanelMode("persistent");
  };

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,          // ← DOPLNIT DO PROVIDERU

        rightPanelContent,
        rightPanelMode,
        openRightPanel,
        closeRightPanel,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}