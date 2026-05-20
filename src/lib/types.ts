export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  followers: string[];
  following: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface AuthUser extends User {
  email: string;
  password: string;
}