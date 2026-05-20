import { create } from "zustand";
import type { AuthUser } from "@/lib/types";
import { getUserByEmail } from "@/data/dummy";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string, password: string) => {
    const user = getUserByEmail(email);
    if (user && user.password === password) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));