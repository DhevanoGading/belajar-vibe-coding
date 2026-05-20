import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: { followerId?: string; followingId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { followerId, followingId } = body;
  if (!followerId || !followingId) {
    return NextResponse.json({ error: "followerId and followingId are required" }, { status: 400 });
  }

  if (followerId === followingId) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "unfollowed" });
  }

  try {
    await prisma.follow.create({ data: { followerId, followingId } });
  } catch {
    return NextResponse.json({ error: "Failed to follow user" }, { status: 400 });
  }
  return NextResponse.json({ action: "followed" });
}
