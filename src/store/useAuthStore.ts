import { create } from "zustand";

interface AuthStore {
  token: string | null;
  role: string | null;
  setAuth: (token: string | null, role: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  role: null,
  setAuth: (token, role) => set({ token, role }),
  clearAuth: () => set({ token: null, role: null }),
}));
