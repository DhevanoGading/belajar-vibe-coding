"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import type { Post, User } from "@/lib/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const { toggleLike, deletePost, addComment, deleteComment } = usePostStore();
  const { getUser } = useUserStore();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const author = getUser(post.authorId);
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwner = user?.id === post.authorId;

  const handleLike = () => {
    if (user) {
      toggleLike(post.id, user.id);
    }
  };

  const handleDeletePost = () => {
    if (user) {
      deletePost(post.id, user.id);
    }
  };

  const handleAddComment = () => {
    if (user && commentText.trim()) {
      addComment(post.id, user.id, commentText.trim());
      setCommentText("");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (user) {
      deleteComment(post.id, commentId, user.id);
    }
  };

  if (!author) return <PostCardSkeleton />;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${author.username}`}>
              <Avatar className="size-10">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                href={`/profile/${author.username}`}
                className="font-semibold hover:underline"
              >
                {author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                @{author.username} ·{" "}
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" />}>
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive" onClick={handleDeletePost}>
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-muted-foreground hover:text-destructive",
                isLiked && "text-destructive"
              )}
              onClick={handleLike}
            >
              <Heart
                className={cn("size-4", isLiked && "fill-current")}
              />
              {post.likes.length > 0 && post.likes.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle className="size-4" />
              {post.comments.length > 0 && post.comments.length}
            </Button>
          </div>
        </CardContent>
      </Card>

      <CommentsDialog
        open={showComments}
        onOpenChange={setShowComments}
        post={post}
        commentText={commentText}
        onCommentChange={setCommentText}
        onSubmitComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        getUser={getUser}
      />
    </>
  );
}

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
  commentText: string;
  onCommentChange: (text: string) => void;
  onSubmitComment: () => void;
  onDeleteComment: (commentId: string) => void;
  getUser: (userId: string) => User | undefined;
}

function CommentsDialog({
  open,
  onOpenChange,
  post,
  commentText,
  onCommentChange,
  onSubmitComment,
  onDeleteComment,
  getUser,
}: CommentsDialogProps) {
  const { user } = useAuthStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {post.comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            post.comments.map((comment) => {
              const commentAuthor = getUser(comment.authorId);
              const isCommentOwner = user?.id === comment.authorId;

              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={commentAuthor?.avatar} />
                    <AvatarFallback>
                      {commentAuthor?.name[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {commentAuthor?.name}
                      </span>
                      {isCommentOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-destructive"
                          onClick={() => onDeleteComment(comment.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {user && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => onCommentChange(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={onSubmitComment} disabled={!commentText.trim()}>
                Post
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}