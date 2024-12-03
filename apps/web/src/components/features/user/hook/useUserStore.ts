import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: { access_token: string | null } | null;
  setCredentials: (user: { access_token: string }) => void;
  removeCredentials: () => void;
}

const userStoreSlice: StateCreator<UserState> = (set) => ({
  user: null,
  setCredentials: (user) => set({ user }),
  removeCredentials: () => set({ user: null }),
});

const persistedUserStore = persist<UserState>(userStoreSlice, {
  name: "user",
});

export const useUserStore = create(persistedUserStore);
