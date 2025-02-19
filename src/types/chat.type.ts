export interface IUser {
    name: string;
    ensName: string;
    profilePicture: string;
    address: string;
    chatId: string;
    type: "Request" | "Connected" | "Searched";
    lastTimestamp: number;
    lastMessage: string;
    unreadMessages: number;
}

export interface IMember {
    image: string;
    isAdmin: boolean;
    wallet: string;
}

export interface IGroup {
    groupId: string;
    name: string;
    description: string;
    public: boolean;
    image: string;
    erc20: string;
    nft: string;
    members: IMember[];
    pendingMembers: IMember[];
    type: "Request" | "Connected" | "Searched";
    lastTimestamp: number;
    lastMessage: string;
}

export type ChatType = "Text" | "MediaEmbed" | "Image" | "File" | "Reaction";

export interface IChat {
    timestamp: number;
    type: ChatType;
    content: string;
    fromAddress: string;
    toAddress: string;
    chatId: string;
    link: string | null;
    reaction: string;
    image?: string;
}

export type ProfileType = {
    desc: string,
    name: string,
    picture: string,
}

export type ChatModeType = 'group' | 'p2p'