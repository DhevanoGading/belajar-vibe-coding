"use client";

import { usePostStore } from "@/store/usePostStore";
import { PostCard } from "@/components/posts/PostCard";
import { CreatePost } from "@/components/posts/CreatePost";

export default function HomePage() {
  const { posts } = usePostStore();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <CreatePost />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}