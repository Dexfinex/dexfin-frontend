// Social feed types
export interface User {
  username: string;
  address: string;
  avatar: string;
  followers: number;
  following: number;
  bio: string;
  platforms: string[];
  verified?: boolean;
}

export interface Activity {
  id: string;
  type: 'swap' | 'mint' | 'transfer' | 'trade' | 'media';
  address: string;
  username?: string;
  avatar?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  hasLiked: boolean;
  profit?: {
    amount: number;
    percentage: number;
  };
  details: {
    action: string;
    token1?: string;
    token2?: string;
    amount1?: string;
    amount2?: string;
    protocol?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'music' | 'nft';
    mediaTitle?: string;
    mediaDescription?: string;
    mediaDuration?: string;
    mediaCreator?: string;
    mediaCover?: string;
  };
}