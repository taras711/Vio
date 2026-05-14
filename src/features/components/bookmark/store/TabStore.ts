import { create } from "zustand";

export interface TabItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  createdAt?: number;
}

interface TabStore {
    tabs: TabItem[];
    addTab: (tab: TabItem) => void;
    removeTab: (id: string) => void;
    clearTabs: () => void;
    activeTabId: string | null;
    setActiveTab: (id: string) => void;
}

export const useTabStore = create<TabStore>((set, get) => ({
  tabs: [],
  activeTabId: null,

  addTab: (tab) =>
    set((state) => {
      if (state.tabs.some((t) => t.path === tab.path)) return state;
      tab.createdAt = Date.now();
      return { tabs: [...state.tabs, tab], activeTabId: tab.id };
    }),

  removeTab: (id) =>
    set((state) => {
      const filtered = state.tabs.filter((t) => t.id !== id);
      return {
        tabs: filtered,
        activeTabId: filtered.length ? filtered[filtered.length - 1].id : null,
      };
    }),

  setActiveTab: (id) => set({ activeTabId: id }),
  clearTabs: () => set({ tabs: [] })
}));

// -------------------------
// PERSIST (localStorage)
// -------------------------

// Load on startup
const saved = localStorage.getItem("tabStore");
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    useTabStore.setState(parsed);
  } catch {
    console.warn("Invalid tabStore data, ignoring");
  }
}

// Save on change (debounced)
let timeout: any = null;

useTabStore.subscribe((state) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem(
      "tabStore",
      JSON.stringify({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      })
    );
  }, 150);
});
