import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  let body: {
    id?: string; name?: string; username?: string;
    bio?: string; avatar?: string | null; password?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, name, username, bio, avatar, password } = body;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const errors: Record<string, string> = {};

  if (name !== undefined && name.trim().length === 0) {
    errors.name = "Name cannot be empty";
  }

  if (username !== undefined) {
    const trimmed = username.trim();
    if (trimmed.length === 0) {
      errors.username = "Username cannot be empty";
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    } else if (trimmed !== existingUser.username) {
      const duplicate = await prisma.user.findUnique({ where: { username: trimmed } });
      if (duplicate) {
        errors.username = "Username already taken";
      }
    }
  }

  if (bio !== undefined && bio.length > 200) {
    errors.bio = "Bio must be under 200 characters";
  }

  if (password !== undefined && password.length > 0 && password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};

  if (name !== undefined) updateData.name = name.trim();
  if (username !== undefined) updateData.username = username.trim();
  if (bio !== undefined) updateData.bio = bio;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (password && password.length > 0) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
    },
  });

  return NextResponse.json({ user: updatedUser });
}
