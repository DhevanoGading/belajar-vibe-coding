import { create } from "zustand";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface RegisterResult {
  success: boolean;
  errors?: Record<string, string>;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => void;
  checkSession: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser> & { password?: string }) => Promise<{
    success: boolean;
    errors?: Record<string, string>;
  }>;
}

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (identifier: string, password: string) => {
    const { ok, data } = await fetchJSON("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!ok) return false;

    set({ user: data.user, isAuthenticated: true });
    return true;
  },

  register: async (data: RegisterData) => {
    const { ok, status, data: resData } = await fetchJSON("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!ok) {
      return { success: false, errors: resData.errors };
    }

    set({ user: resData.user, isAuthenticated: true });
    return { success: true };
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  checkSession: async () => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      set({ user: JSON.parse(stored), isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: Partial<AuthUser> & { password?: string }) => {
    const { ok, data: resData } = await fetchJSON("/api/auth/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!ok) {
      return { success: false, errors: resData.errors };
    }

    set({ user: resData.user });
    return { success: true };
  },
}));

useAuthStore.subscribe((state) => {
  if (state.user) {
    localStorage.setItem("auth_user", JSON.stringify(state.user));
  } else {
    localStorage.removeItem("auth_user");
  }
});
