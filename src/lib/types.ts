export type PostWithRelations = {
  id: string;
  content: string;
  images: string[] | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  };
  likes: string[];
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      username: string;
      name: string;
      avatar: string | null;
    };
  }[];
};

export type UserBasic = {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
};
