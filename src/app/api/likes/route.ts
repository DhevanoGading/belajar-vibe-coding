import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { postId, userId } = await request.json();

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "unliked" });
  }

  await prisma.like.create({ data: { postId, userId } });
  return NextResponse.json({ action: "liked" });
}
