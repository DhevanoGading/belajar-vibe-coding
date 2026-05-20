import { create } from "zustand";

type UserBasic = {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
};

type UserProfile = UserBasic & {
  bio: string | null;
  followers: string[];
  following: string[];
};

interface UserState {
  users: UserBasic[];
  isLoading: boolean;
  fetchAllUsers: () => Promise<void>;
  getUserByUsername: (username: string) => Promise<UserProfile | null>;
  toggleFollow: (followerId: string, followingId: string) => Promise<void>;
}

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: true,

  fetchAllUsers: async () => {
    set({ isLoading: true });
    const users = await fetchJSON("/api/users");
    set({ users, isLoading: false });
  },

  getUserByUsername: async (username: string) => {
    return fetchJSON(`/api/users/by-username/${username}`);
  },

  toggleFollow: async (followerId: string, followingId: string) => {
    await fetchJSON("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId, followingId }),
    });
  },
}));
