import { create } from "zustand";
import type { PostWithRelations } from "@/lib/types";

interface PostState {
  posts: PostWithRelations[];
  isLoading: boolean;
  fetchAllPosts: () => Promise<void>;
  fetchPostsByUser: (userId: string) => Promise<void>;
  createPost: (authorId: string, content: string, images?: string[]) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, authorId: string, content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
}

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: true,

  fetchAllPosts: async () => {
    set({ isLoading: true });
    const posts = await fetchJSON("/api/posts");
    set({ posts, isLoading: false });
  },

  fetchPostsByUser: async (userId: string) => {
    set({ isLoading: true });
    const posts = await fetchJSON(`/api/posts?authorId=${userId}`);
    set({ posts, isLoading: false });
  },

  createPost: async (authorId, content, images) => {
    const post = await fetchJSON("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId, content, images }),
    });
    set((state) => ({ posts: [post, ...state.posts] }));
  },

  toggleLike: async (postId, userId) => {
    const prevPosts = get().posts;
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes.includes(userId)
                ? p.likes.filter((id) => id !== userId)
                : [...p.likes, userId],
            }
          : p
      ),
    }));
    try {
      await fetchJSON("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId }),
      });
    } catch {
      set({ posts: prevPosts });
    }
  },

  addComment: async (postId, authorId, content) => {
    const comment = await fetchJSON("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, authorId, content }),
    });
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      ),
    }));
  },

  deletePost: async (postId) => {
    const prevPosts = get().posts;
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
    }));
    try {
      await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    } catch {
      set({ posts: prevPosts });
    }
  },

  deleteComment: async (postId, commentId) => {
    const prevPosts = get().posts;
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      ),
    }));
    try {
      await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    } catch {
      set({ posts: prevPosts });
    }
  },
}));
