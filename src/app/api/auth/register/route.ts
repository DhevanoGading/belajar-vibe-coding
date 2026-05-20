import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  let body: { name?: string; username?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, username, email, password } = body;
  const errors: Record<string, string> = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!username || username.trim().length === 0) {
    errors.username = "Username is required";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = "Username can only contain letters, numbers, and underscores";
  }

  if (!email || email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { errors: { email: "Email already registered" } },
      { status: 409 }
    );
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return NextResponse.json(
      { errors: { username: "Username already taken" } },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password!, 10);

  const user = await prisma.user.create({
    data: {
      username: username!.trim(),
      name: name!.trim(),
      email: email!.trim(),
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
