import { create } from "zustand";
import type { Post, Comment } from "@/lib/types";
import { dummyPosts as initialPosts } from "@/data/dummy";

interface PostState {
  posts: Post[];
  createPost: (authorId: string, content: string) => void;
  deletePost: (postId: string, authorId: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, authorId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string, authorId: string) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [...initialPosts],

  createPost: (authorId: string, content: string) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId,
      content,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  deletePost: (postId: string, authorId: string) => {
    set((state) => ({
      posts: state.posts.filter(
        (post) => !(post.id === postId && post.authorId === authorId)
      ),
    }));
  },

  toggleLike: (postId: string, userId: string) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;
        const isLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter((id) => id !== userId)
            : [...post.likes, userId],
        };
      }),
    }));
  },

  addComment: (postId: string, authorId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }),
    }));
  },

  deleteComment: (postId: string, commentId: string, authorId: string) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.filter(
            (comment) =>
              !(comment.id === commentId && comment.authorId === authorId)
          ),
        };
      }),
    }));
  },
}));