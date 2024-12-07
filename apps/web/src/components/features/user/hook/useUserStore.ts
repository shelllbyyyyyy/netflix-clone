import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: { access_token: string | null } | null;
  setCredentials: (user: { access_token: string }) => void;
  removeCredentials: () => void;
}

interface ProfileState {
  profile: {
    id: string | null;
    profile_name: string | null;
    avatar_url: string | null;
  } | null;
  setProfile: (profile: {
    id: string;
    profile_name: string;
    avatar_url: string;
  }) => void;
  logOutProfile: () => void;
}

interface MyState extends UserState, ProfileState {}

const userStoreSlice: StateCreator<MyState> = (set) => ({
  user: null,
  setCredentials: (user) => set({ user }),
  removeCredentials: () => set({ user: null }),
  profile: null,
  setProfile: (profile) => set({ profile }),
  logOutProfile: () => set({ profile: null }),
});

const persistedUserStore = persist<MyState>(userStoreSlice, {
  name: "user",
  storage: createJSONStorage(() => sessionStorage),
});

export const useUserStore = create(persistedUserStore);
