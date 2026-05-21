import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const john = await prisma.user.upsert({
    where: { username: "johndoe" },
    update: {},
    create: {
      username: "johndoe",
      name: "John Doe",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      bio: "Frontend developer passionate about React and Next.js",
    },
  });

  const jane = await prisma.user.upsert({
    where: { username: "janesmith" },
    update: {},
    create: {
      username: "janesmith",
      name: "Jane Smith",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      bio: "Full-stack developer | TypeScript enthusiast",
    },
  });

  const alex = await prisma.user.upsert({
    where: { username: "alexdev" },
    update: {},
    create: {
      username: "alexdev",
      name: "Alex Developer",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      bio: "Building cool stuff with Next.js and Tailwind CSS",
    },
  });

  const sarah = await prisma.user.upsert({
    where: { username: "sarahux" },
    update: {},
    create: {
      username: "sarahux",
      name: "Sarah Designer",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "UX Designer | Creating beautiful experiences",
    },
  });

  const now = new Date();

  const post1 = await prisma.post.create({
    data: {
      authorId: john.id,
      content:
        "Just started learning Next.js 14 with the new App Router! The server components are amazing for performance. #NextJS #React",
      createdAt: new Date(now.getTime() - 7200000),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: jane.id,
      content:
        "TypeScript generics are underrated. Once you understand them, your code becomes so much more type-safe and reusable!",
      createdAt: new Date(now.getTime() - 14400000),
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: alex.id,
      content: "Hot take: Tailwind CSS is the best CSS framework for React apps. Change my mind.",
      createdAt: new Date(now.getTime() - 28800000),
    },
  });

  const post4 = await prisma.post.create({
    data: {
      authorId: sarah.id,
      content:
        "Working on a new design system for our app. Here's a sneak peek of the color palette we're using! 🎨",
      createdAt: new Date(now.getTime() - 43200000),
    },
  });

  const post5 = await prisma.post.create({
    data: {
      authorId: john.id,
      content:
        "Pro tip: Always use proper error boundaries in your React apps. It saves you from those ugly white screens of death!",
      createdAt: new Date(now.getTime() - 86400000),
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: jane.id,
      content: "Welcome to the Next.js family! The App Router is indeed powerful.",
      createdAt: new Date(now.getTime() - 3600000),
    },
  });

  await prisma.comment.create({
    data: {
      postId: post3.id,
      authorId: sarah.id,
      content: "I agree! The utility-first approach makes styling so much faster.",
      createdAt: new Date(now.getTime() - 1800000),
    },
  });

  await prisma.comment.create({
    data: {
      postId: post3.id,
      authorId: john.id,
      content: "Absolutely! Using it with shadcn/ui is a match made in heaven.",
      createdAt: new Date(now.getTime() - 1200000),
    },
  });

  await prisma.comment.create({
    data: {
      postId: post4.id,
      authorId: john.id,
      content: "Looks beautiful! Can't wait to see the full design system.",
      createdAt: new Date(now.getTime() - 600000),
    },
  });

  const likesData = [
    { postId: post1.id, userId: jane.id },
    { postId: post1.id, userId: alex.id },
    { postId: post1.id, userId: sarah.id },
    { postId: post2.id, userId: john.id },
    { postId: post2.id, userId: alex.id },
    { postId: post3.id, userId: john.id },
    { postId: post3.id, userId: jane.id },
    { postId: post3.id, userId: sarah.id },
    { postId: post4.id, userId: john.id },
    { postId: post4.id, userId: jane.id },
    { postId: post4.id, userId: alex.id },
    { postId: post5.id, userId: alex.id },
  ];

  for (const like of likesData) {
    await prisma.like.create({ data: like }).catch(() => {});
  }

  const followsData = [
    { followerId: john.id, followingId: jane.id },
    { followerId: john.id, followingId: alex.id },
    { followerId: jane.id, followingId: john.id },
    { followerId: jane.id, followingId: sarah.id },
    { followerId: alex.id, followingId: john.id },
    { followerId: sarah.id, followingId: john.id },
    { followerId: sarah.id, followingId: jane.id },
    { followerId: sarah.id, followingId: alex.id },
  ];

  for (const follow of followsData) {
    await prisma.follow.create({ data: follow }).catch(() => {});
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
