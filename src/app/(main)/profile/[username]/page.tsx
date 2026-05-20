"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, UserMinus, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { usePostStore } from "@/store/usePostStore";
import { PostCard } from "@/components/posts/PostCard";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const { user: currentUser } = useAuthStore();
  const { getUserByUsername, toggleFollow } = useUserStore();
  const { posts, fetchPostsByUser } = usePostStore();
  const [profileUser, setProfileUser] = useState<{
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    followers: string[];
    following: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const user = await getUserByUsername(username);
      setProfileUser(user);
      if (user) {
        await fetchPostsByUser(user.id);
      }
      setIsLoading(false);
    }
    load();
  }, [username, getUserByUsername, fetchPostsByUser]);

  const handleFollow = async () => {
    if (currentUser && profileUser) {
      await toggleFollow(currentUser.id, profileUser.id);
      const updated = await getUserByUsername(username);
      if (updated) setProfileUser(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-20" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Skeleton className="size-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">User not found</p>
            <Button variant="link" onClick={() => router.back()}>
              Go back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userPosts = posts.filter((post) => post.author.id === profileUser.id);
  const isFollowing = currentUser
    ? profileUser.followers.includes(currentUser.id)
    : false;
  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <Card>
        <CardContent className="pt-6 relative">
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => router.push("/settings")}
            >
              <Settings className="size-5" />
            </Button>
          )}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="size-24">
              <AvatarImage src={profileUser.avatar ?? undefined} />
              <AvatarFallback className="text-2xl">
                {profileUser.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{profileUser.name}</h1>
              <p className="text-muted-foreground">@{profileUser.username}</p>
              <p className="mt-2">{profileUser.bio}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">
                    {profileUser.followers.length}
                  </strong>{" "}
                  Followers
                </span>
                <span>
                  <strong className="text-foreground">
                    {profileUser.following.length}
                  </strong>{" "}
                  Following
                </span>
              </div>
            </div>

            {!isOwnProfile && currentUser && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollow}
                className="gap-2"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="size-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1 gap-2">
            Posts ({userPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          {userPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "You haven't posted anything yet"
                    : "No posts yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
