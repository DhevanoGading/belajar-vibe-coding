import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { followerId, followingId } = await request.json();

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "unfollowed" });
  }

  await prisma.follow.create({ data: { followerId, followingId } });
  return NextResponse.json({ action: "followed" });
}
