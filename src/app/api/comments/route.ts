import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { postId?: string; authorId?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { postId, authorId, content } = body;
  if (!postId || !authorId || !content?.trim()) {
    return NextResponse.json({ error: "postId, authorId, and content are required" }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: { postId, authorId, content: content.trim() },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    });

    return NextResponse.json({
      ...comment,
      author: comment.author,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 400 });
  }
}
