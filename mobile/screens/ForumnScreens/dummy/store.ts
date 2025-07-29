// dummy.ts
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
  username: string;
  avatarUri: string;
  content: string;
  mediaUri?: string;
  mediaType?: 'image' | 'video';
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  createdAt: string;
}
export const demoPosts: Post[] = [
  {
    id: '1',
    title: 'Best organic fertilizers for maize?',
    author: 'FarmerJoe',
    username: 'FarmerJoe',
    avatarUri: 'https://i.pravatar.cc/150?img=3',
    content: 'What organic fertilizer yields the best results for maize?',
    mediaUri:
      'https://cdn.prod.website-files.com/6391a69da19785feb2dd28ca/63f30926cdf34e1d76bfcc9b_we-are-farmer-p-1080.jpg',
    mediaType: 'image',
    upvotes: 42,
    downvotes: 3,
    createdAt: '2h ago',
    comments: [
      {
        id: 'c1',
        author: 'AgriExpert',
        content:
          'Try a mix of poultry manure and neem cake for high nitrogen.',
        upvotes: 12,
        downvotes: 1,
        createdAt: '1h ago',
      },
    ],
  },
  {
    id: '2',
    title: 'Indoor hydroponics vs soil-based yield?',
    author: 'GreenThumb',
    username: 'GreenThumb',
    avatarUri: 'https://i.pravatar.cc/150?img=5',
    content:
      'Has anyone compared yields between hydroponic and soil setups?',
    mediaUri: 'https://cdn.prod.website-files.com/6391a69da197858b22dd28d4/685169094159f2fc34fe4cd2_WhatsApp%20Image%202025-06-04%20at%2011.04.09%20(1).jpeg',
    mediaType: 'image',
    upvotes: 27,
    downvotes: 2,
    createdAt: '5h ago',
    comments: [],
  },
];
