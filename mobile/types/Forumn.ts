export type ForumnStackParamList = {
    Feeds: undefined;
    PostDetails: { postId: string };

  };


export interface Comment {
    id: string;
    author: string;
    content: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
  }

export interface Post {
    id: string;
    title: string;
    author: string;
    content: string;
    mediaUri?: string; // optional image/video URI
    mediaType?: "image" | "video";
    upvotes: number;
    downvotes: number;
    comments: Comment[];
    createdAt: string;
  }