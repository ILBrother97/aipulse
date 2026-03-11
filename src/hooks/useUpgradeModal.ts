import { create } from 'zustand';

interface UpgradeModalState {
  isOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

export const useUpgradeModal = create<UpgradeModalState>((set) => ({
  isOpen: false,
  openUpgradeModal: () => set({ isOpen: true }),
  closeUpgradeModal: () => set({ isOpen: false }),
}));
