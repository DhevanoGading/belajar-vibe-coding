"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, UserMinus, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { usePostStore } from "@/store/usePostStore";
import { PostCard } from "@/components/posts/PostCard";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const { user: currentUser } = useAuthStore();
  const { users, toggleFollow } = useUserStore();
  const { posts } = usePostStore();

  const profileUser = users.find((u) => u.username === username);

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

  const userPosts = posts.filter((post) => post.authorId === profileUser.id);
  const isFollowing = currentUser?.following.includes(profileUser.id);
  const isOwnProfile = currentUser?.id === profileUser.id;

  const handleFollow = () => {
    if (currentUser) {
      toggleFollow(currentUser.id, profileUser.id);
    }
  };

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
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="size-24">
              <AvatarImage src={profileUser.avatar} />
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
            <MessageCircle className="size-4" />
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