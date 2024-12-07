import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  modalOpen: boolean;
  setModalOpen: () => void;
  setModalClosed: () => void;
}

const globalStoreSlice: StateCreator<GlobalState> = (set) => ({
  modalOpen: true,
  setModalClosed: () => set({ modalOpen: false }),
  setModalOpen: () => set({ modalOpen: true }),
});

const persistedGlobalStore = persist<GlobalState>(globalStoreSlice, {
  name: "global",
  storage: createJSONStorage(() => sessionStorage),
});

export const useGlobalStore = create(persistedGlobalStore);
