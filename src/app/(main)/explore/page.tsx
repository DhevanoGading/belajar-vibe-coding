"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCard } from "@/components/posts/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";

export default function ExplorePage() {
  const { posts, isLoading: postsLoading, fetchAllPosts } = usePostStore();
  const { users, isLoading: usersLoading, fetchAllUsers } = useUserStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllPosts();
    fetchAllUsers();
  }, [fetchAllPosts, fetchAllUsers]);

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.id !== user?.id &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isLoading = postsLoading || usersLoading;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search posts and users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Posts</h2>
            {filteredPosts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No posts found
              </p>
            ) : (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="size-4" />
                  Who to follow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredUsers.slice(0, 5).map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Link href={`/profile/${u.username}`}>
                      <Avatar className="size-8">
                        <AvatarImage src={u.avatar ?? undefined} />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/profile/${u.username}`}
                        className="font-medium text-sm hover:underline block truncate"
                      >
                        {u.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        @{u.username}
                      </p>
                    </div>
                    <Link href={`/profile/${u.username}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No users found
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
