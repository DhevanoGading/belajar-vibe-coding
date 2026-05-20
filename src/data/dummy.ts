import type { AuthUser, Post } from "@/lib/types";

export const dummyUsers: AuthUser[] = [
  {
    id: "1",
    username: "johndoe",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "Frontend developer passionate about React and Next.js",
    followers: ["2", "3", "4"],
    following: ["2", "3"],
  },
  {
    id: "2",
    username: "janesmith",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    bio: "Full-stack developer | TypeScript enthusiast",
    followers: ["1", "3"],
    following: ["1", "4"],
  },
  {
    id: "3",
    username: "alexdev",
    name: "Alex Developer",
    email: "alex@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Building cool stuff with Next.js and Tailwind CSS",
    followers: ["1", "2"],
    following: ["1"],
  },
  {
    id: "4",
    username: "sarahux",
    name: "Sarah Designer",
    email: "sarah@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "UX Designer | Creating beautiful experiences",
    followers: ["2"],
    following: ["1", "2", "3"],
  },
];

export const dummyPosts: Post[] = [
  {
    id: "p1",
    authorId: "1",
    content: "Just started learning Next.js 14 with the new App Router! The server components are amazing for performance. #NextJS #React",
    likes: ["2", "3", "4"],
    comments: [
      {
        id: "c1",
        authorId: "2",
        content: "Welcome to the Next.js family! The App Router is indeed powerful.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "p2",
    authorId: "2",
    content: "TypeScript generics are underrated. Once you understand them, your code becomes so much more type-safe and reusable!",
    likes: ["1", "3"],
    comments: [],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "p3",
    authorId: "3",
    content: "Hot take: Tailwind CSS is the best CSS framework for React apps. Change my mind.",
    likes: ["1", "2", "4"],
    comments: [
      {
        id: "c2",
        authorId: "4",
        content: "I agree! The utility-first approach makes styling so much faster.",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "c3",
        authorId: "1",
        content: "Absolutely! Using it with shadcn/ui is a match made in heaven.",
        createdAt: new Date(Date.now() - 1200000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "p4",
    authorId: "4",
    content: "Working on a new design system for our app. Here's a sneak peek of the color palette we're using! 🎨",
    likes: ["1", "2", "3"],
    comments: [
      {
        id: "c4",
        authorId: "1",
        content: "Looks beautiful! Can't wait to see the full design system.",
        createdAt: new Date(Date.now() - 600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "p5",
    authorId: "1",
    content: "Pro tip: Always use proper error boundaries in your React apps. It saves you from those ugly white screens of death!",
    likes: ["3"],
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function getUserById(id: string) {
  return dummyUsers.find((user) => user.id === id);
}

export function getUserByUsername(username: string) {
  return dummyUsers.find((user) => user.username === username);
}

export function getUserByEmail(email: string) {
  return dummyUsers.find((user) => user.email === email);
}

export function getPostsByAuthor(authorId: string) {
  return dummyPosts.filter((post) => post.authorId === authorId);
}

export function getPostsByUsers(userIds: string[]) {
  return dummyPosts.filter((post) => userIds.includes(post.authorId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllPosts() {
  return [...dummyPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}