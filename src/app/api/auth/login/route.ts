import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { identifier, password } = await request.json();

  if (!identifier) {
    return NextResponse.json({ error: "Email or username is required" }, { status: 400 });
  }

  const isEmail = identifier.includes("@");
  const user = await prisma.user.findUnique({
    where: isEmail ? { email: identifier } : { username: identifier },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      password: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid email/username or password" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}
