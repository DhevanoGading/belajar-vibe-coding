import { create } from "zustand";
import type { User } from "@/lib/types";
import { dummyUsers } from "@/data/dummy";

interface UserState {
  users: User[];
  toggleFollow: (currentUserId: string, targetUserId: string) => void;
  getUser: (userId: string) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [...dummyUsers],

  toggleFollow: (currentUserId: string, targetUserId: string) => {
    set((state) => ({
      users: state.users.map((user) => {
        if (user.id !== currentUserId) return user;

        const isFollowing = user.following.includes(targetUserId);
        const targetUser = state.users.find((u) => u.id === targetUserId);

        if (!targetUser) return user;

        return {
          ...user,
          following: isFollowing
            ? user.following.filter((id) => id !== targetUserId)
            : [...user.following, targetUserId],
        };
      }),
    }));

    set((state) => ({
      users: state.users.map((user) => {
        if (user.id !== targetUserId) return user;

        const currentUser = get().users.find((u) => u.id === currentUserId);
        if (!currentUser) return user;

        const isFollowedBy = currentUser.following.includes(targetUserId);

        return {
          ...user,
          followers: isFollowedBy
            ? [...user.followers, currentUserId]
            : user.followers.filter((id) => id !== currentUserId),
        };
      }),
    }));
  },

  getUser: (userId: string) => {
    return get().users.find((user) => user.id === userId);
  },
}));