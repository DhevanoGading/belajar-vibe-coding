import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get("authorId");

  const where = authorId ? { authorId } : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, username: true, name: true, avatar: true },
      },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, username: true, name: true, avatar: true },
          },
        },
      },
    },
  });

  const result = posts.map((post) => ({
    ...post,
    likes: post.likes.map((l) => l.userId),
    comments: post.comments.map((c) => ({
      ...c,
      author: c.author,
    })),
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  let body: { authorId?: string; content?: string; images?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { authorId, content, images } = body;
  if (!authorId || !content?.trim()) {
    return NextResponse.json({ error: "authorId and content are required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      authorId,
      content,
      images: images ?? undefined,
    },
    include: {
      author: {
        select: { id: true, username: true, name: true, avatar: true },
      },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, username: true, name: true, avatar: true },
          },
        },
      },
    },
  });

  const result = {
    ...post,
    likes: post.likes.map((l) => l.userId),
    comments: post.comments.map((c) => ({
      ...c,
      author: c.author,
    })),
  };

  return NextResponse.json(result);
}
