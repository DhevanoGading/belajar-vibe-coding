import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { postId?: string; userId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { postId, userId } = body;
  if (!postId || !userId) {
    return NextResponse.json({ error: "postId and userId are required" }, { status: 400 });
  }

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "unliked" });
  }

  try {
    await prisma.like.create({ data: { postId, userId } });
  } catch {
    return NextResponse.json({ error: "Failed to like post" }, { status: 400 });
  }
  return NextResponse.json({ action: "liked" });
}
