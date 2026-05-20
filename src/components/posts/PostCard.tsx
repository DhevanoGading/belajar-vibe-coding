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
import { cn } from "@/lib/utils";
import type { PostWithRelations } from "@/lib/types";

interface PostCardProps {
  post: PostWithRelations;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const { toggleLike, deletePost, addComment, deleteComment } = usePostStore();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const author = post.author;
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwner = user?.id === author.id;

  const handleLike = async () => {
    if (user) {
      await toggleLike(post.id, user.id);
    }
  };

  const handleDeletePost = async () => {
    if (user) {
      await deletePost(post.id);
    }
  };

  const handleAddComment = async () => {
    if (user && commentText.trim()) {
      await addComment(post.id, user.id, commentText.trim());
      setCommentText("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (user) {
      await deleteComment(post.id, commentId);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${author.username}`}>
              <Avatar className="size-10">
                <AvatarImage src={author.avatar ?? undefined} />
                <AvatarFallback>{author.name[0] || "?"}</AvatarFallback>
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
      />
    </>
  );
}

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostWithRelations;
  commentText: string;
  onCommentChange: (text: string) => void;
  onSubmitComment: () => void;
  onDeleteComment: (commentId: string) => void;
}

function CommentsDialog({
  open,
  onOpenChange,
  post,
  commentText,
  onCommentChange,
  onSubmitComment,
  onDeleteComment,
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
              const isCommentOwner = user?.id === comment.author.id;

              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={comment.author.avatar ?? undefined} />
                    <AvatarFallback>
                      {comment.author.name[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {comment.author.name}
                      </span>
                      {isCommentOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-destructive"
                          onClick={() => onDeleteComment(comment.id)}
                          aria-label="Delete comment"
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
