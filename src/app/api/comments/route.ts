import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { postId, authorId, content } = await request.json();
  const comment = await prisma.comment.create({
    data: { postId, authorId, content },
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
}
