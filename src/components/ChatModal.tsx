import React, { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  X, Maximize2, Minimize2, Search, Smile, Download,
  MessageSquare, Share2, Users, ArrowRight, Plus,
  Settings, User, Info, CheckCircle, XCircle, File,
  Edit, Lock, Eye
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { Theme } from 'emoji-picker-react';
import { Theme as GifTheme } from 'gif-picker-react';
import { VideoCallModal } from './VideoCallModal';
import { CreateGroupModal } from './CreateGroupModal';
import { SendFileModal } from './SendFileModal';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import { useStore } from '../store/useStore';
import { Spinner, Popover, PopoverTrigger, PopoverContent, Tooltip, useToast } from '@chakra-ui/react';
import { Clipboard } from './common/Clipboard';
import { extractAddress, getChatHistoryDate, getEnsName, shrinkAddress } from '../utils/common.util';
import { getAllChatData, getWalletProfile } from '../utils/chatApi';
import { LIMIT } from '../utils/chatApi';
import { EditChatProfileModal } from './EditChatProfileModal';
import { ChatGroupModal } from './ChatGroupModal';
import { IUser, IGroup, ChatType, IChat, ProfileType } from '../types/chat.type';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// interface ChatUser {
//   id: string;
//   name: string;
//   ens: string;
//   avatar: string;
//   isOnline: boolean;
//   lastSeen?: string;
//   status?: string;
//   nftAccess?: {
//     collection: string;
//     tokenId: string;
//     image: string;
//     verified: boolean;
//   }[];
// }

// interface ChatGroup {
//   id: string;
//   name: string;
//   description: string;
//   members: ChatUser[];
//   type: 'public' | 'private' | 'nft-gated';
//   icon: string;
//   requiredNft?: {
//     collection: string;
//     image: string;
//   };
// }

// const mockUsers: ChatUser[] = [
//   {
//     id: '1',
//     name: 'Alice',
//     ens: 'alice.eth',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
//     isOnline: true,
//     status: 'Trading BTC/ETH pairs 📈',
//     nftAccess: [
//       {
//         collection: 'Bored Ape Yacht Club',
//         tokenId: '#8817',
//         image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=256',
//         verified: true
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: 'Bob',
//     ens: 'bob.eth',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
//     isOnline: true,
//     status: 'DeFi degen 🌾',
//     nftAccess: [
//       {
//         collection: 'Azuki',
//         tokenId: '#4391',
//         image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=256',
//         verified: true
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Charlie',
//     ens: 'charlie.eth',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
//     isOnline: false,
//     lastSeen: '2 hours ago',
//     nftAccess: [
//       {
//         collection: 'Pudgy Penguins',
//         tokenId: '#2156',
//         image: 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&dpr=1&w=256',
//         verified: true
//       }
//     ]
//   }
// ];

// const mockGroups: ChatGroup[] = [
//   {
//     id: 'wow',
//     name: 'Wealth of Wisdom',
//     description: 'Exclusive community for financial wisdom and insights',
//     members: mockUsers.slice(0, 8),
//     type: 'public',
//     icon: 'https://wealthofwisdom.io/wp-content/uploads/2022/12/wow-logoi1.svg'
//   },
//   {
//     id: 'trading',
//     name: 'Trading Group',
//     description: 'Discuss trading strategies and market analysis',
//     members: mockUsers.slice(0, 5),
//     type: 'public',
//     icon: '📈'
//   },
//   {
//     id: 'defi',
//     name: 'DeFi Discussion',
//     description: 'All things DeFi - yields, protocols, and strategies',
//     members: mockUsers.slice(1, 6),
//     type: 'public',
//     icon: '🌾'
//   },
//   {
//     id: 'bayc-alpha',
//     name: 'BAYC Alpha',
//     description: 'Exclusive BAYC holders chat',
//     members: mockUsers.filter(user =>
//       user.nftAccess?.some(nft => nft.collection === 'Bored Ape Yacht Club')
//     ),
//     type: 'nft-gated',
//     icon: '🐵',
//     requiredNft: {
//       collection: 'Bored Ape Yacht Club',
//       image: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=256'
//     }
//   },
//   {
//     id: 'azuki-dao',
//     name: 'Azuki DAO',
//     description: 'Azuki holders governance chat',
//     members: mockUsers.filter(user =>
//       user.nftAccess?.some(nft => nft.collection === 'Azuki')
//     ),
//     type: 'nft-gated',
//     icon: '⛩️',
//     requiredNft: {
//       collection: 'Azuki',
//       image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=256'
//     }
//   }
// ];

// const tradingGroupMessages = [
//   {
//     id: '1',
//     sender: {
//       id: '4',
//       name: 'CryptoWhale',
//       ens: 'whale.eth',
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whale',
//       isOnline: true,
//       status: 'Trading 24/7 🐋'
//     },
//     content: "BTC looking bullish on the 4h chart. Clear breakout above resistance. 📈",
//     timestamp: '10:30 AM',
//     reactions: [
//       { emoji: '🚀', count: 5, reacted: true },
//       { emoji: '👀', count: 3, reacted: false }
//     ]
//   }
// ];

// const bobDirectMessages = [
//   {
//     id: '1',
//     sender: mockUsers[1], // Bob
//     content: "Hey! Just wanted to share my latest trade analysis. Looking at some interesting setups in the DeFi sector. 📊",
//     timestamp: '11:15 AM'
//   }
// ];

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState<'group' | 'p2p'>('group');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isCreateGroupActive, setIsCreateGroupActive] = useState(false);
  const [isEditProfileActive, setIsEditProfileActive] = useState(false);
  const [isChatGroupModalActive, setIsChatGroupModalActive] = useState(false);
  const [isSendModalActive, setIsSendModalActive] = useState(false);
  const { signer, address } = useContext(Web3AuthContext);
  const { setChatUser, chatUser } = useStore();
  const toast = useToast()

  const [loading, setLoading] = useState(false);
  const [ownProfile, setOwnProfile] = useState<ProfileType | null>(null);
  const [groupList, setGroupList] = useState<Array<IGroup>>([]);
  const [connectedUsers, setConnectedUsers] = useState<Array<IUser>>([]);
  const [searchedUser, setSearchedUser] = useState<IUser | null>(null);
  const [searchedGroup, setSearchedGroup] = useState<IGroup | null>(null);
  const [requestUsers, setRequestUsers] = useState<Array<IUser>>([]);
  const [requestGroups, setRequestGroups] = useState<Array<IGroup>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<IChat>>([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);
  const [isFailedSent, setIsFailedSent] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(false);
  const [loadingPrevChat, setLoadingPrevChat] = useState(false);
  const [toBottom, setToBottom] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isHandlingRequest, setIsHandlingRequest] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const emojiPickRef = useRef<HTMLDivElement>(null);
  const gifPickRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const gifBtnRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // const [currentUserNfts] = useState([
  //   {
  //     collection: 'Bored Ape Yacht Club',
  //     tokenId: '#1234',
  //     image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=256',
  //     verified: true
  //   }
  // ]);

  const handleScroll = useCallback(() => {
    if (chatScrollRef.current) {
      setIsScrollTop(chatScrollRef.current.scrollTop === 0);
    }
  }, []);

  useEffect(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener("scroll", handleScroll);

    // return () => {
    //   scrollElement.removeEventListener("scroll", handleScroll);
    // };
  }, [handleScroll]);

  const setProfile = useCallback(async () => {
    const profile = await chatUser.profile.info()

    setOwnProfile({
      name: profile?.name || "",
      desc: profile?.desc || "",
      picture: profile.picture
    })
  }, [chatUser])

  const getChatInformation = useCallback(async () => {
    setLoading(true)
    setGroupList([])
    setConnectedUsers([])

    const chatData = await getAllChatData(chatUser)
    console.log('chatdata = ', chatData)

    let groupInformation: IGroup[] = []
    let userInformation: IUser[] = []

    chatData.forEach((data: any) => {
      if (data.groupInformation) {
        groupInformation = [...groupInformation, {
          groupId: data.groupInformation.chatId,
          name: data.groupInformation.groupName,
          description: data.groupInformation.groupDescription,
          public: data.groupInformation.isPublic,
          image: data.groupInformation.groupImage,
          erc20: data.groupInformation.contractAddressERC20,
          nft: data.groupInformation.contractAddressNFT,
          members: data.groupInformation.members,
          pendingMembers: data.groupInformation.pendingMembers,
          type: "Connected",
          lastTimestamp: Number(data.msg.timestamp),
          lastMessage: setLastMessage(data.msg.messageType, data.msg.messageContent)
        }]
      } else {
        userInformation = [...userInformation, {
          name: data.name,
          ensName: "",
          profilePicture: data.profilePicture,
          address: extractAddress(data.wallets),
          chatId: data.chatId,
          type: "Connected",
          lastTimestamp: data.msg.timestamp,
          lastMessage: setLastMessage(data.msg.messageType, data.msg.messageContent),
          unreadMessages: 0
        }]
      }
    });
    console.log('groupInformation = ', groupInformation)

    if (groupInformation.length > 0) {
      setGroupList(groupInformation.sort((a, b) => b.lastTimestamp - a.lastTimestamp))
    }
    if (userInformation.length > 0) {
      const sorted = userInformation.sort((a, b) => b.lastTimestamp - a.lastTimestamp)
      setConnectedUsers(sorted)
      updateEnsName("connected", undefined, undefined, sorted)
    }

    //get chat request
    const requests = await chatUser.chat.list('REQUESTS')
    console.log('requests = ', requests)
    if (requests.length > 0) {
      let directRequests: IUser[] = []
      let groupRequests: IGroup[] = []

      requests.forEach((request: any) => {
        if (!request.groupInformation) {
          directRequests = [...directRequests, {
            name: request.name,
            ensName: "",
            profilePicture: request.profilePicture,
            address: extractAddress(request.wallets),
            chatId: request.chatId,
            type: "Request",
            unreadMessages: 0,
            lastTimestamp: request.msg?.timestamp ? Number(request.msg?.timestamp) : 0,
            lastMessage: request.msg?.messageContent ? request.msg?.messageContent : ""
          }]
        } else if (request.groupInformation) {
          groupRequests = [...groupRequests, {
            groupId: request.groupInformation.chatId,
            name: request.groupInformation.groupName,
            description: request.groupInformation.groupDescription,
            public: request.groupInformation.isPublic,
            image: request.groupInformation.groupImage,
            erc20: request.groupInformation.contractAddressERC20,
            nft: request.groupInformation.contractAddressNFT,
            members: request.groupInformation.members,
            pendingMembers: request.groupInformation.pendingMembers,
            type: "Request",
            lastTimestamp: request.msg?.timestamp ? Number(request.msg?.timestamp) : 0,
            lastMessage: request.msg?.messageContent ? request.msg?.messageContent : ""
          }]
        }
      })

      if (directRequests.length > 0) {
        setRequestUsers(directRequests)
        updateEnsName("request", undefined, undefined, directRequests)
      }
      if (groupRequests.length > 0) {
        setRequestGroups(groupRequests)
      }
    }

    setLoading(false)
  }, [chatUser])

  const clearValues = useCallback(() => {
    setSearchQuery("")
    setChatHistory([])
    setRequestUsers([])
    setRequestGroups([])
    setSelectedUser(null)
    setSearchedUser(null)
    setSelectedGroup(null)
    setSearchedGroup(null)
    setIsEmojiOpen(false)
    setIsGifOpen(false)
  }, [])

  useEffect(() => {
    if (isOpen && chatUser?.uid) {
      console.log('get chat user')
      setProfile()
      getChatInformation()
      // const profile = await getWalletProfile(chatUser, searchQuery)
    } else {
      clearValues()
    }
  }, [isOpen, chatUser, setProfile, getChatInformation, clearValues])

  useEffect(() => {
    setSearchQuery("")
    setChatHistory([])
    setSelectedUser(null)
    setSearchedUser(null)
    setSelectedGroup(null)
    setSearchedGroup(null)
    setIsEmojiOpen(false)
    setIsGifOpen(false)
  }, [chatMode])

  useEffect(() => {
    console.log('isScrollTop')
    if (isScrollTop) {
      console.log('selected user = ', selectedUser)
      console.log('selected group = ', selectedGroup)
      console.log('chat history = ', chatHistory)

      if (selectedUser && chatHistory.length > 0 && chatHistory[0].link) {
        getPrevChatHistory(selectedUser.address, chatHistory[0].chatId)
      } else if ((selectedGroup && chatHistory.length > 0 && chatHistory[0].link)) {
        getPrevChatHistory(selectedGroup.groupId, chatHistory[0].chatId)
      }
    }
  }, [isScrollTop])

  useEffect(() => {
    if (!message) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "40px";
      }
    }
  }, [message])

  useEffect(() => {
    setMessage("")
  }, [selectedUser, selectedGroup])

  const scrollBottom = useCallback(() => {
    if (chatScrollRef.current) {
      // chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    console.log('chat history = ', chatHistory)
    if (toBottom) {
      scrollBottom()
      setToBottom(false)
    }
  }, [chatHistory, toBottom, scrollBottom])

  useEffect(() => {
    handleReceiveMsg()
  }, [receivedMessage])

  useEffect(() => {
    if (isFailedSent) {
      toast({
        status: 'error',
        description: `Can't send a message. Please try again.`,
        duration: 3500
      })
    }
  }, [isFailedSent])

  // useEffect(() => {
  //   console.log('request users = ', requestUsers)
  // }, [requestUsers])

  const initStream = async (user: any) => {
    const stream = await user.initStream(
      [
        CONSTANTS.STREAM.CHAT, // Listen for chat messages
        CONSTANTS.STREAM.NOTIF, // Listen for notifications
        CONSTANTS.STREAM.CONNECT, // Listen for connection events
        CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
      ],
      {
        // Filter options:
        filter: {
          // Listen to all channels and chats (default):
          channels: ['*'],
          chats: ['*'],

          // Listen to specific channels and chats:
          // channels: ['channel-id-1', 'channel-id-2'],
          // chats: ['chat-id-1', 'chat-id-2'],

          // Listen to events with a specific recipient:
          // recipient: '0x...' (replace with recipient wallet address)
        },
        // Connection options:
        connection: {
          retries: 3, // Retry connection 3 times if it fails
        },
        raw: false, // Receive events in structured format
      }
    );

    // Stream connection established:
    stream.on(CONSTANTS.STREAM.CONNECT, async (a: any) => {
      console.log('Stream Connected ', a);

      // // Send initial message to PushAI Bot:
      // console.log('Sending message to PushAI Bot');

      // await userAlice.chat.send(pushAIWalletAddress, {
      //   content: 'Hello, from Alice',
      //   type: 'Text',
      // });

      // console.log('Message sent to PushAI Bot');
    });

    stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {
      console.log('Encrypted Message Received');
      console.log(message); // Log the message payload
      setReceivedMessage(message)
    });

    // Setup event handling
    stream.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
      console.log('notify data = ', data);
    });

    // Chat operation received:
    stream.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
      console.log('Chat operation received.');
      console.log(data); // Log the chat operation data
    });

    await stream.connect(); // Establish the connection after setting up listeners
    // Stream disconnection:
    stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
      console.log('Stream Disconnected');
    });
  }

  const handleReceiveMsg = async () => {
    console.log('handle receive message')

    // handle group messages
    if (receivedMessage?.meta?.group == true) {
      if (receivedMessage.origin == "other") {
        if (receivedMessage.event == "chat.request") {
          const found = requestGroups.find((group: IGroup) => group.groupId == receivedMessage.chatId)

          if (!found) {
            const profile = await chatUser.chat.group.info(receivedMessage.chatId)
            console.log('group profile = ', profile)

            setRequestGroups(prev =>
              [...prev, {
                groupId: profile.chatId,
                name: profile.groupName,
                description: profile.groupDescription,
                public: profile.isPublic,
                image: profile.groupImage,
                erc20: profile.contractAddressERC20,
                nft: profile.contractAddressNFT,
                members: profile.members,
                pendingMembers: profile.pendingMembers,
                type: "Request",
                lastTimestamp: receivedMessage?.timestamp ? Number(receivedMessage.timestamp) : 0,
                lastMessage: receivedMessage.message?.content ? receivedMessage.message.content : ""
              }]
            )
          }

          updateLastMessageInfo(receivedMessage.chatId, receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp), true, true)
        } else if (receivedMessage.event == "chat.message") {
          if (selectedGroup?.groupId == receivedMessage.chatId) {
            const found = selectedGroup?.members.find(member => extractAddress(member.wallet) == extractAddress(receivedMessage.from))

            if (receivedMessage.message.type == "Reaction") {
              setChatHistory(prev => prev.map(chat => chat.chatId == receivedMessage.message.reference ? { ...chat, reaction: receivedMessage.message.content } : chat))
            } else {
              setToBottom(true)
              setChatHistory(prevChat =>
                [...prevChat, {
                  timestamp: Number(receivedMessage.timestamp),
                  type: receivedMessage.message.type,
                  content: receivedMessage.message.content,
                  fromAddress: extractAddress(receivedMessage.from),
                  toAddress: "",
                  chatId: receivedMessage.reference,
                  link: null,
                  image: found?.image || "",
                  reaction: ""
                }]
              )
            }
          }

          updateLastMessageInfo(receivedMessage.chatId, receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp), true, false)
        } else if (receivedMessage.event == "chat.accept") {
          // add a member
          const profile = await getWalletProfile(chatUser, receivedMessage.from)
          console.log('received message from = ', receivedMessage.from)
          console.log('chat accept profile = ', profile)
          const newMember = {
            image: profile.picture,
            isAdmin: false,
            wallet: receivedMessage.from
          }

          if (selectedGroup && selectedGroup?.groupId == receivedMessage.chatId) {
            setSelectedGroup({
              ...selectedGroup,
              members: [...selectedGroup.members, newMember],
              pendingMembers: selectedGroup.pendingMembers.length > 0 ? selectedGroup.pendingMembers.filter(member => member.wallet != receivedMessage.from) : []
            });
          }
          if (requestGroups.find(group => group.groupId == receivedMessage.chatId)) {
            setRequestGroups(prev => {
              const updated = prev.map(group => group.groupId == receivedMessage.chatId ?
                { ...group, members: [...group.members, newMember], pendingMembers: group.pendingMembers.length > 0 ? group.pendingMembers.filter(member => member.wallet != receivedMessage.from) : [] }
                : group)

              return [...updated]
            })
          } else {
            setGroupList(prev => {
              const updated = prev.map(group => group.groupId == receivedMessage.chatId ?
                { ...group, members: [...group.members, newMember], pendingMembers: group.pendingMembers.length > 0 ? group.pendingMembers.filter(member => member.wallet != receivedMessage.from) : [] }
                : group)

              return [...updated]
            })
          }
        } else if (receivedMessage.event == "chat.reject") {
          if (selectedGroup && selectedGroup.groupId == receivedMessage.chatId) {
            setSelectedGroup({
              ...selectedGroup,
              pendingMembers: selectedGroup.pendingMembers.length > 0 ? selectedGroup.pendingMembers.filter(member => member.wallet != receivedMessage.from) : []
            })
          }

          setGroupList(prev => {
            const updated = prev.map(group => group.groupId == receivedMessage.chatId ? {
              ...group, pendingMembers: group.pendingMembers.length > 0 ? group.pendingMembers.filter(member => member.wallet != receivedMessage.from) : []
            } : group)

            return [...updated]
          })
        }
      } else if (receivedMessage.origin == "self") {
        if (receivedMessage.event == "chat.message") {
          updateLastMessageInfo(receivedMessage.chatId, receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp), true, false)
        }
      }
    }

    // handle p2p messages
    else if (receivedMessage?.meta?.group == false) {
      if (receivedMessage.origin == "other") {
        console.log('receive other')
        if (receivedMessage.event == "chat.request") {
          const found = requestUsers.find(user => user.address == extractAddress(receivedMessage.from))

          if (!found) {
            const profile = await getWalletProfile(chatUser, receivedMessage.from)

            if (profile) {
              const users = [...requestUsers, {
                name: profile.name,
                ensName: "",
                profilePicture: profile.picture,
                address: extractAddress(receivedMessage.from),
                chatId: receivedMessage.chatId,
                type: "Request",
                unreadMessages: 0,
                lastTimestamp: 0,
                lastMessage: ""
              }] as Array<IUser>
              setRequestUsers(users)

              updateEnsName("request", undefined, undefined, users)
            }
          } else if (selectedUser?.address == extractAddress(receivedMessage.from)) {
            setChatHistory(prev =>
              [...prev, {
                timestamp: Number(receivedMessage.timestamp),
                type: receivedMessage.message.type,
                content: receivedMessage.message.content,
                fromAddress: extractAddress(receivedMessage.from),
                toAddress: extractAddress(receivedMessage.to[0]),
                chatId: receivedMessage.chatId,
                link: null,
                reaction: ""
              }]
            )
          }

          updateLastMessageInfo(extractAddress(receivedMessage.from), receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp), false, true)
        } else if (receivedMessage.event == "chat.message") {
          console.log('chat.message')
          if (extractAddress(receivedMessage.from) == selectedUser?.address) {
            if (receivedMessage.message.type == "Reaction") {
              setChatHistory(prev => prev.map(chat => chat.chatId == receivedMessage.message.reference ? { ...chat, reaction: receivedMessage.message.content } : chat))
            } else {
              setToBottom(true)
              setChatHistory(prev =>
                [...prev, {
                  timestamp: Number(receivedMessage.timestamp),
                  type: receivedMessage.message.type,
                  content: receivedMessage.message.content,
                  fromAddress: extractAddress(receivedMessage.from),
                  toAddress: extractAddress(receivedMessage.to[0]),
                  chatId: receivedMessage.chatId,
                  link: null,
                  reaction: ""
                }]
              )
            }

            updateLastMessageInfo(extractAddress(receivedMessage.from), receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp), false, false)
          } else {
            addUnreadMessagesCount(extractAddress(receivedMessage.from), receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp))
          }
        }
      } else if (receivedMessage.origin == "self") {
        if (receivedMessage.event == "chat.message" || receivedMessage.event == "chat.request") {
          updateLastMessageInfo(extractAddress(receivedMessage.to[0]), receivedMessage.message.type, receivedMessage.message.content, Number(receivedMessage.timestamp), false, false)
        }
      }
    }

    if (receivedMessage?.event == "chat.group.participant.join" && receivedMessage.origin == "other") {
      console.log('chat.group.participant.join------------')
      // add a member
      const profile = await getWalletProfile(chatUser, receivedMessage.from)
      const newMember = {
        image: profile.picture,
        isAdmin: false,
        wallet: receivedMessage.from
      }

      console.log('participate profile = ', profile)
      if (selectedGroup && selectedGroup?.groupId == receivedMessage.chatId) {
        setSelectedGroup({
          ...selectedGroup,
          members: [...selectedGroup.members, newMember],
          pendingMembers: selectedGroup.pendingMembers.length > 0 ? selectedGroup.pendingMembers.filter(member => member.wallet != receivedMessage.from) : []
        });
      }

      setGroupList(prev => {
        const updated = prev.map(group => group.groupId == receivedMessage.chatId ? { ...group, members: [...group.members, newMember] } : group)
        return [...updated]
      })
    } else if (receivedMessage?.event == "chat.group.participant.remove" && receivedMessage.origin == "other") {
      if (selectedGroup?.groupId == receivedMessage.chatId) {
        setSearchedGroup(null)
        setChatHistory([])
      }

      setGroupList(prev => {
        const updated = prev.filter(group => group.groupId != receivedMessage.chatId)
        return [...updated]
      })
    }
  }

  const getPrevChatHistory = async (address: string, chatId: string) => {
    setLoadingPrevChat(true)
    const prevHistory = await chatUser.chat.history(address, { reference: chatId, limit: LIMIT })
    console.log('prev history = ', prevHistory)

    if (prevHistory.length > 0) {
      let chats: IChat[] = []
      let reactions: any[] = []

      // todo should add reactions more
      prevHistory.forEach((data: any) => {
        if (data.messageType == "Reaction") {
          reactions = [...reactions, data.messageObj]
        } else {
          chats = [...chats, {
            timestamp: data.timestamp,
            type: data.messageType,
            content: data.messageContent,
            fromAddress: extractAddress(data.fromDID),
            toAddress: extractAddress(data.toDID),
            chatId: data.cid,
            link: data.link,
            image: selectedGroup ? selectedGroup?.members.find(member => member.wallet == data.fromDID)?.image : undefined
          } as IChat]
        }
      })

      if (reactions.length > 0) {
        chats = chats.map(chat => {
          const found = reactions.find(e => e.reference == chat.chatId)
          if (found) {
            return {
              ...chat,
              reaction: found.content
            }
          }
          return chat
        })
      }

      chats.shift()

      if (chats.length > 0) {
        setChatHistory(prev => [...chats.reverse(), ...prev])
      }
    }

    setLoadingPrevChat(false)
  }

  const setLastMessage = (type: ChatType, content: string) => {
    if (type === "Text" || type === "Reaction") {
      return content
    } else {
      return "💻Media"
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const updateOneGroup = (group: IGroup) => {
    setGroupList(prev => {
      const updated = prev.map(e => e.groupId == group.groupId ? group : e)
      return updated
    })
    setSelectedGroup(group)
  }

  const handleUnlock = async () => {
    if (!chatUser?.uid) {
      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.PROD,
      });

      setChatUser(user)
      initStream(user)
    }
  }

  const onMakeGroup = (group: any) => {
    console.log('on make group : ', group)
    setGroupList(prev => [{
      groupId: group.chatId,
      name: group.groupName,
      description: group.groupDescription,
      public: group.isPublic,
      image: group.groupImage,
      erc20: group.contractAddressERC20,
      nft: group.contractAddressNFT,
      members: group.members,
      pendingMembers: group.pendingMembers,
      type: "Connected",
      lastTimestamp: 0,
      lastMessage: ""
    }, ...prev])
  }

  const handleAcceptChat = async () => {
    try {
      setIsHandlingRequest(true)
      const acceptRequest = await chatUser.chat.accept(selectedUser?.address)
      console.log('accept request = ', acceptRequest)

      setRequestUsers(prev => {
        const updated = prev.filter((item) => item.chatId !== selectedUser?.chatId)
        return [...updated]
      })

      if (selectedUser) {
        const newUser = { ...selectedUser, unreadMessages: 0, type: "Connected" } as IUser
        setConnectedUsers(prev => [newUser, ...prev])
        setSelectedUser(newUser)
      }

    } catch (err) {
      console.log('request accept error: ', err)
    }

    setIsHandlingRequest(false)
  }

  const handleRejectChat = async () => {
    try {
      setIsHandlingRequest(true)
      const rejectRequest = await chatUser.chat.reject(selectedUser?.address)

      console.log('rejectRequest = ', rejectRequest)

      setRequestUsers(prev => {
        const updated = prev.filter((item) => item.chatId !== selectedUser?.chatId)
        return [...updated]
      })
      setSelectedUser(null)
    } catch (err) {
      console.log('request reject error: ', err)
    }

    setIsHandlingRequest(false)
  }

  const handleAcceptGroupRequest = async () => {
    try {
      setIsHandlingRequest(true)

      const acceptGroup = await chatUser.chat.group.join(selectedGroup?.groupId);
      console.log('acceptGroup = ', acceptGroup)

      if (selectedGroup) {
        setRequestGroups(prev => {
          const updated = prev.filter(group => group.groupId != selectedGroup.groupId)
          return [...updated]
        })
        setGroupList(prev => [{ ...selectedGroup, type: "Connected" }, ...prev])
        setSelectedGroup({
          ...selectedGroup,
          type: "Connected",
          members: acceptGroup?.members
        })
      }
    } catch (err) {
      console.log('request accept error: ', err)
    }

    setIsHandlingRequest(false)
  }

  const handleRejectRequest = async () => {
    try {
      setIsHandlingRequest(true)

      const rejectGroup = await chatUser.chat.group.reject(selectedGroup?.groupId);
      console.log('rejectGroup = ', rejectGroup)

      if (selectedGroup) {
        setRequestGroups(prev => {
          const updated = prev.filter(group => group.groupId != selectedGroup.groupId)
          return [...updated]
        })
        setSelectedGroup(null)
      }
    } catch (err) {
      console.log('request accept error: ', err)
    }

    setIsHandlingRequest(false)
  }

  const handleReaction = async (chatId: string, content: string) => {
    // console.log('reference: ', chatId)
    // console.log('address: ', address)
    // console.log('content: ', content)

    const receipient = selectedGroup ? selectedGroup.groupId : selectedUser ? selectedUser.address : ""

    if (!receipient) return

    try {
      setChatHistory(prev => {
        const updated = prev.map(chat => chat.chatId == chatId ? { ...chat, reaction: content } : chat)
        return [...updated]
      })

      const sentReaction = await chatUser.chat.send(receipient, {
        type: 'Reaction',
        content,
        reference: chatId
      })

      console.log('sent reaction = ', sentReaction)
    } catch (err) {
      console.log('reaction err: ', err)
      setChatHistory(prev => {
        const updated = prev.map(chat => chat.chatId == chatId ? { ...chat, reaction: "" } : chat)
        return [...updated]
      })
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (sendingMessage) return;

    if (isFailedSent) {
      setIsFailedSent(false)
    }

    setSendingMessage(true)
    setToBottom(true)

    if (chatMode === "p2p" && selectedUser) {
      const updatedChat: IChat[] = [...chatHistory, {
        timestamp: Math.floor(Date.now()),
        type: "Text",
        content: message.trim(),
        fromAddress: address,
        toAddress: selectedUser.address,
        chatId: "",
        link: null,
        reaction: ""
      }]
      setChatHistory(updatedChat)

      try {
        console.log(selectedUser)
        const sentMsg = await chatUser.chat.send(selectedUser.address, {
          type: 'Text',
          content: message.trim()
        })

        setMessage("")
        if (searchedUser?.address == selectedUser.address) {
          setSearchedUser(null)
          setConnectedUsers(prev => [{ ...searchedUser, unreadMessages: 0 }, ...prev])
        }
        // console.log('sent msg = ', sentMsg)

        setChatHistory(updatedChat.map((chat, index) => index == updatedChat.length - 1 ? { ...chat, chatId: sentMsg.cid } : chat))
      } catch (err) {
        setIsFailedSent(true)
        setChatHistory(prev => [...prev.slice(0, prev.length - 1)])
        console.log('sent msg err: ', err)
      }
    } else if (chatMode === "group") {
      const found = selectedGroup?.members.find(member => extractAddress(member.wallet) == address)
      const updatedChat: IChat[] = [...chatHistory, {
        timestamp: Math.floor(Date.now()),
        type: "Text",
        content: message.trim(),
        fromAddress: address,
        toAddress: "",
        chatId: "",
        link: null,
        image: found?.image || "",
        reaction: ""
      }]
      setChatHistory(updatedChat)

      try {
        const sentMsg = await chatUser.chat.send(selectedGroup?.groupId, {
          type: 'Text',
          content: message.trim()
        })

        setMessage("")

        console.log('sent msg = ', sentMsg)
        setChatHistory(updatedChat.map((chat, index) => index == updatedChat.length - 1 ? { ...chat, chatId: sentMsg.cid } : chat))
      } catch (err) {
        setIsFailedSent(true)
        setChatHistory(prev => [...prev.slice(0, prev.length - 1)])
        console.log('sent msg err: ', err)
      }
    }

    setSendingMessage(false)
  };

  const handleSelectUser = async (user: IUser) => {
    setLoadingChatHistory(true)
    setChatHistory([])
    setSelectedUser(user)
    console.log('user = ', user)

    try {
      const history = await chatUser.chat.history(user.address, { limit: LIMIT })

      if (history.length > 0) {
        console.log('history = ', history)
        let chats: IChat[] = []
        let reactions: any[] = []

        history.forEach((data: any) => {
          if (data.messageType == "Reaction") {
            reactions = [...reactions, data.messageObj]
          } else {
            chats = [...chats, {
              timestamp: data.timestamp,
              type: data.messageType,
              content: data.messageContent,
              fromAddress: extractAddress(data.fromDID),
              toAddress: extractAddress(data.toDID),
              chatId: data.cid,
              link: data.link,
            } as IChat]
          }
        })

        if (reactions.length > 0) {
          chats = chats.map(chat => {
            const found = reactions.find(e => e.reference == chat.chatId)
            if (found) {
              return {
                ...chat,
                reaction: found.content
              }
            }
            return chat
          })
        }

        setToBottom(true)
        setChatHistory(chats.reverse())
        clearUnreadMessages(user.address)
      }
    } catch (err) {
      console.log('load chat history err: ', err)
    }

    setLoadingChatHistory(false)
  }

  const handleTextChange = (e: any) => {
    setMessage(e.target.value)
    adjustHeight()
  }

  const adjustHeight = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const handleSearch = async () => {
    if (!searchQuery || searchQuery == address) return
    setIsSearching(true)
    setChatHistory([])

    if (chatMode == "p2p") {
      try {
        const profile = await getWalletProfile(chatUser, searchQuery)

        if (profile) {
          const found = connectedUsers.find((user: IUser) => extractAddress(user.address) == searchQuery)

          if (found) {
            handleSelectUser(found)
          } else {
            const user = {
              name: profile.name,
              ensName: "",
              profilePicture: profile.picture,
              address: searchQuery,
              chatId: "",
              type: "Searched",
              unreadMessages: 0,
              lastTimestamp: 0,
              lastMessage: ""
            } as IUser

            setSearchedUser(user)
            updateEnsName("search", address, user)
          }
        }
      } catch (err) {
        console.log('get user profile err: ', err)
      }
    } else if (chatMode == "group") {
      try {
        const profile = await chatUser.chat.group.info(searchQuery)

        console.log('gropuProfile = ', profile)
        if (profile) {
          const found = groupList.find((group: IGroup) => group.groupId == searchQuery)

          if (found) {
            handleSelectGroup(found)
          } else {
            setSearchedGroup({
              groupId: profile.chatId,
              name: profile.groupName,
              description: profile.groupDescription,
              public: profile.isPublic,
              image: profile.groupImage,
              erc20: profile.contractAddressERC20,
              nft: profile.contractAddressNFT,
              members: profile.members,
              pendingMembers: profile.pendingMembers,
              type: "Searched",
              lastTimestamp: 0,
              lastMessage: ""
            })
          }
        }
      } catch (err) {
        console.log('get chat group err: ', err)
      }
    }

    setIsSearching(false)
  }

  const handleSelectRequestUser = async (user: IUser) => {
    setLoadingChatHistory(true)
    setChatHistory([])
    setSelectedUser(user)

    console.log('request user = ', user)
    const history = await chatUser.chat.history(user.address)
    if (history.length > 0) {
      const tmp: IChat[] = history.map((data: any) => {
        return {
          timestamp: data.timestamp,
          type: data.messageType,
          content: data.messageContent,
          fromAddress: extractAddress(data.fromDID),
          toAddress: extractAddress(data.toDID),
          chatId: data.cid,
          link: data.link
        }
      })
      setToBottom(true)
      setChatHistory(tmp.reverse())
    }

    setLoadingChatHistory(false)
  }

  const handleSelectGroup = async (group: IGroup) => {
    setLoadingChatHistory(true)
    setChatHistory([])
    setSelectedGroup(group)

    console.log('selected group = ', group)
    const history = await chatUser.chat.history(group.groupId, { limit: LIMIT })
    // console.log('group history = ', history)
    if (history.length > 0) {
      let chats: IChat[] = []
      let reactions: any[] = []

      history.forEach((data: any) => {
        if (data.messageType == "Reaction") {
          reactions = [...reactions, data.messageObj]
        } else {
          const found = group?.members.find(member => extractAddress(member.wallet) == extractAddress(data.fromDID))
          chats = [...chats, {
            timestamp: data.timestamp,
            type: data.messageType,
            content: data.messageContent,
            fromAddress: extractAddress(data.fromDID),
            toAddress: extractAddress(data.toDID),
            chatId: data.cid,
            link: data.link,
            image: found?.image || ""
          } as IChat]
        }
      })

      if (reactions.length > 0) {
        chats = chats.map(chat => {
          const found = reactions.find(e => e.reference == chat.chatId)
          if (found) {
            return {
              ...chat,
              reaction: found.content
            }
          }
          return chat
        })
      }

      setToBottom(true)
      setChatHistory(chats.reverse())
    }

    setLoadingChatHistory(false)
  }

  const handleJoinGroup = async () => {
    setIsJoiningGroup(true)

    try {
      const joinGroup = await chatUser.chat.group.join(selectedGroup?.groupId);
      console.log('joingroup = ', joinGroup)

      if (searchedGroup) {
        setSearchedGroup(null)
      }

      if (selectedGroup) {
        const newGroup: IGroup = {
          ...selectedGroup,
          type: "Connected",
          members: joinGroup.members
        }
        setGroupList(prev => [{ ...newGroup, type: "Connected" }, ...prev])
        setSelectedGroup(newGroup)
      }
    } catch (err) {
      console.log('join group err: ', err)
    }

    setIsJoiningGroup(false)
  }

  const handleClickModal = (e: any) => {
    if (emojiBtnRef.current && emojiBtnRef.current.contains(e.target as Node)) {
      if (isGifOpen) {
        setIsGifOpen(false)
      }
      return
    }

    if (gifBtnRef.current && gifBtnRef.current.contains(e.target as Node)) {
      if (isEmojiOpen) {
        setIsEmojiOpen(false)
      }
      return
    }

    if (gifPickRef.current && !gifPickRef.current.contains(e.target as Node)) {
      setIsGifOpen(false)
    }

    if (emojiPickRef.current && !emojiPickRef.current.contains(e.target as Node)) {
      setIsEmojiOpen(false)
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    console.log('emoji = ', emojiData.emoji)
    setMessage(message + emojiData.emoji)
    setIsEmojiOpen(false)
  }

  const sendMedia = async (content: string, type: ChatType) => {
    setToBottom(true)

    try {
      if (chatMode === "group" && selectedGroup) {
        const found = selectedGroup?.members.find(member => extractAddress(member.wallet) == address)
        setChatHistory(prev => [...prev, {
          timestamp: Math.floor(Date.now()),
          type,
          content,
          fromAddress: address,
          toAddress: "",
          chatId: "",
          link: null,
          image: found?.image || "",
          reaction: ""
        }])

        const sentMedia = await chatUser.chat.send(selectedGroup?.groupId, {
          type,
          content
        })

        setMessage("")
        console.log('sent media: ', sentMedia)
      } else if (chatMode === "p2p" && selectedUser) {
        setChatHistory(prev => [...prev, {
          timestamp: Math.floor(Date.now()),
          type,
          content,
          fromAddress: address,
          toAddress: selectedUser?.address,
          chatId: "",
          link: null,
          reaction: ""
        }])

        const sentMedia = await chatUser.chat.send(selectedUser?.address, {
          type,
          content
        })

        setMessage("")
        if (searchedUser?.address == selectedUser.address) {
          setSearchedUser(null)
          setConnectedUsers(prev => [{ ...searchedUser, unreadMessages: 0 }, ...prev])
        }
        console.log('sent media: ', sentMedia)
      }
    } catch (err) {
      console.log('send gif err: ', err)
      setChatHistory(prev => [...prev.slice(0, prev.length - 1)])
    }
  }

  const handleGifClick = async (gifData: any) => {
    setIsGifOpen(false)
    sendMedia(gifData.url, "MediaEmbed")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      console.log('file = ', file)
      setSelectedFile(file)
      setIsSendModalActive(true)
      event.target.value = "";
    }
  }

  const handleSendFile = (type: string, base64: string) => {
    console.log('file type ', type)
    console.log('base64 ', base64)
    sendMedia(base64, type as ChatType)
  }

  const updateEnsName = async (type: string, address?: string, user?: IUser, userList?: Array<IUser>) => {
    console.log('update ens name')
    if (type === "connected" && userList) {
      const updated = await Promise.all(
        userList?.map(async (user) => {
          const ensName: string = await getEnsName(user.address);
          return ensName ? { ...user, ensName } : user;
        })
      );

      setConnectedUsers(updated)
    } else if (type === "search" && address) {
      const ensName: string = await getEnsName(address)
      if (ensName && user) {
        setSearchedUser({
          ...user,
          ensName
        })
      }
    } else if (type === "request" && userList) {
      const updated = await Promise.all(
        userList?.map(async (user) => {
          const ensName: string = await getEnsName(user.address);
          return ensName ? { ...user, ensName } : user;
        })
      );

      setRequestUsers(updated)
    }
  }

  const updateLastMessageInfo = (address: string, type: ChatType, msg: string, timestamp: number, isGroup: boolean, isRequest: boolean) => {
    console.log('updateLastMessageInfo ')
    const lastMessage = (type === "Text" || type === "Reaction" ? msg : "💻Media")

    if (!isGroup) {
      if (isRequest) {
        requestUsers.length > 0 && setRequestUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.address === address
              ? { ...user, lastMessage, lastTimestamp: timestamp }
              : user
          );
          // console.log("Previous Users: ", prevUsers);
          // console.log("Updated Users: ", updatedUsers);
          return updatedUsers.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
        });
      } else {
        connectedUsers.length > 0 && setConnectedUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.address === address
              ? { ...user, lastMessage, lastTimestamp: timestamp }
              : user
          );
          // console.log("Previous Users: ", prevUsers);
          // console.log("Updated Users: ", updatedUsers);
          return updatedUsers.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
        });
      }
    } else {
      if (isRequest) {
        requestGroups.length > 0 && setRequestGroups((prevGroups) => {
          const updatedGroups = prevGroups.map((group) =>
            group.groupId === address
              ? { ...group, lastMessage, lastTimestamp: timestamp }
              : group
          );
          // console.log("Previous Groups: ", prevGroups);
          // console.log("Updated Groups: ", updatedGroups);
          return updatedGroups;
        });
      } else {
        groupList.length > 0 && setGroupList((prevGroups) => {
          const updatedGroups = prevGroups.map((group) =>
            group.groupId === address
              ? { ...group, lastMessage, lastTimestamp: timestamp }
              : group
          );
          // console.log("Previous Groups: ", prevGroups);
          // console.log("Updated Groups: ", updatedGroups);
          return updatedGroups.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
        });
      }
    }
  }

  const addUnreadMessagesCount = (address: string, type: ChatType, msg: string, timestamp: number) => {
    const lastMessage = (type === "Text" || type === "Reaction" ? msg : "💻Media")

    if (connectedUsers.length > 0) {
      setConnectedUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.address === address
            ? { ...user, lastMessage, lastTimestamp: timestamp, unreadMessages: ++user.unreadMessages }
            : user
        );

        return updatedUsers.sort((a, b) => b.lastTimestamp - a.lastTimestamp)
      });
    }
  }

  const downloadBase64File = (base64Data: string, fileName: string, fileType: string) => {
    // Convert Base64 to a Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    // Create a temporary link element and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const clearUnreadMessages = (address: string) => {
    if (connectedUsers.length > 0) {
      setConnectedUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.address === address && user.unreadMessages > 0
            ? { ...user, unreadMessages: 0 }
            : user
        );
        return updatedUsers;
      });
    }
  }

  const canAccessChat = (user: IUser | null, group: IGroup | null) => {
    if (!user && !group) return false;

    if (user?.type === "Request") return false;

    if (group?.type === "Searched") return false;

    if (group?.type === "Request") return false;
    // if (group?.type === 'public') return true;
    // if (group?.type === 'nft-gated') {
    //   return currentUserNfts.some(nft =>
    //     nft.collection === group.requiredNft?.collection
    //   );
    // }
    // if (user?.nftAccess) {
    //   return currentUserNfts.some(userNft =>
    //     user.nftAccess?.some(requiredNft =>
    //       requiredNft.collection === userNft.collection
    //     )
    //   );
    // }
    return true;
  };

  const renderAccessBadge = (user: IUser | null, group: IGroup | null) => {
    if (!user && !group) return null;

    // const hasAccess = canAccessChat(user, group);
    // const requiredNft = group?.type === 'nft-gated' ? group.requiredNft :
    //   user?.nftAccess?.[0];

    // if (!requiredNft) return null;

    // return (
    //   <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${hasAccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    //     }`}>
    //     {hasAccess ? (
    //       <>
    //         <ShieldCheck className="w-4 h-4" />
    //         <span>Access Granted</span>
    //       </>
    //     ) : (
    //       <>
    //         <ShieldAlert className="w-4 h-4" />
    //         <span>Requires {requiredNft.collection}</span>
    //       </>
    //     )}
    //   </div>
    // );
    return null
  };

  const renderDirectRequests = () => {
    return <>
      {
        requestUsers.length > 0 && requestUsers.map(user => <div key={user.chatId} className={`flex p-3 hover:bg-white/5 ${user.address == selectedUser?.address && 'bg-white/10'}`}>
          <button className={`flex-1 py-2 flex justify-between items-center`}
            onClick={() => handleSelectRequestUser(user)}>

            {user?.profilePicture ? <img src={user.profilePicture} className='w-10 h-10 rounded-full' /> : <User />}
            <div className='flex flex-col text-left'>
              <span>{user.ensName ? user.ensName : user?.name || shrinkAddress(user.address)}</span>
              {user.lastMessage ? <div className="text-sm text-white/60 truncate">{user.lastMessage.slice(0, 20)}</div> : <></>}
            </div>

            {user?.lastTimestamp ? <span className='w-[64px] text-xs text-white/40'>{getChatHistoryDate(user?.lastTimestamp)}</span> : <></>}
            <Info className='text-red-500' />
          </button>
        </div>
        )
      }
    </>
  }

  const renderGroupsAndUsers = () => {
    if (chatMode === 'group') {
      return <>
        {
          requestGroups.length > 0 && requestGroups.map(group => <button
            key={group.groupId}
            onClick={() => handleSelectGroup(group)}
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${selectedGroup?.groupId === group.groupId
              ? 'bg-white/10'
              : 'hover:bg-white/5'
              }`}>
            <img src={group.image} alt="WOW" className="w-14 h-14 rounded-lg" />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.name}</span>
              </div>
              {group.lastMessage ? <div className="text-sm text-white/60 truncate">{group.lastMessage.slice(0, 20)}</div> : <></>}
            </div>
            {group?.lastTimestamp ? <span className='w-[64px] text-xs text-white/40'>{getChatHistoryDate(group?.lastTimestamp)}</span> : <></>}
            <Info className='text-red-500' />
          </button>)
        }

        {searchedGroup && <div className={`flex border-b-2 hover:bg-white/5 ${searchedGroup.groupId == selectedGroup?.groupId && 'bg-white/10'}`}>
          <button className={`flex-1 py-2 flex gap-8 items-center`}
            onClick={() => handleSelectGroup(searchedGroup)}>
            <img src={searchedGroup.image} className='w-14 h-14 rounded-lg' />
            <div className='flex flex-col'>
              <span>{searchedGroup.name}</span>
              <span className='text-sm text-gray-400'>Join Group!</span>
            </div>
          </button>
          <button className='mx-2' onClick={() => { setSearchedGroup(null); setSelectedGroup(null); }}>
            <X className="w-4 h-4" />
          </button>
        </div>}

        {groupList.length > 0 && groupList.map((group: IGroup) => <button
          key={group.groupId}
          onClick={() => handleSelectGroup(group)}
          className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${selectedGroup?.groupId === group.groupId
            ? 'bg-white/10'
            : 'hover:bg-white/5'
            }`}>
          <img src={group.image} alt="WOW" className="w-14 h-14 rounded-lg" />
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium">{group.name}</span>
            </div>
            {group.lastMessage ? <div className="text-sm text-white/60 truncate">{group.lastMessage.slice(0, 20)}</div> : <></>}
          </div>
          {group?.lastTimestamp ? <span className='w-[64px] text-xs text-white/40'>{getChatHistoryDate(group?.lastTimestamp)}</span> : <></>}
          {/* {group?.unreadMessages > 0 ? <span className='text-red-500 text-xs'>{group?.unreadMessages}</span> : <></>} */}
          {/* {group?.unreadMessages > 0 ? <CheckCircle className='text-red-500 w-4 h-4' /> : <></>} */}
        </button>)}
      </>
    } else if (chatMode === 'p2p') {
      return <>
        {renderDirectRequests()}

        {searchedUser && <div className={`flex border-b-2 hover:bg-white/5 ${searchedUser.address == selectedUser?.address && 'bg-white/10'}`}>
          <button className={`flex-1 py-2 flex gap-8 items-center`}
            onClick={() => setSelectedUser(searchedUser)}>
            {searchedUser?.profilePicture ? <img src={searchedUser.profilePicture} className='w-10 h-10 rounded-full' /> : <User />}
            <div className='flex flex-col'>
              <span>{searchedUser?.ensName ? searchedUser?.ensName : searchedUser?.name || shrinkAddress(searchedUser.address)}</span>
              <span className='text-sm text-white/40'>Start Chat!</span>
            </div>
          </button>
          <button className='mx-2' onClick={() => { setSearchedUser(null); setSelectedUser(null); }}>
            <X className="w-4 h-4" />
          </button>
        </div>}

        {connectedUsers.length > 0 && connectedUsers.map((user: IUser) => <button key={user.chatId}
          onClick={() => handleSelectUser(user)}
          className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${selectedUser?.address === extractAddress(user?.address)
            ? 'bg-white/10'
            : 'hover:bg-white/5'
            }`}
        >
          {
            user?.profilePicture ? <img src={user?.profilePicture} className='w-10 h-10 rounded-full' /> : <User className='w-10 h-10' />
          }
          <div className='flex flex-col flex-1'>
            <span className='text-left'>{user.ensName ? user.ensName : user?.name || shrinkAddress(extractAddress(user?.address))}</span>
            <span className='text-left text-sm text-white/40'>{user?.lastMessage ? user?.lastMessage.slice(0, 20) : ""}</span>
          </div>
          {user?.lastTimestamp && <span className='w-[64px] text-xs text-white/40'>{getChatHistoryDate(user?.lastTimestamp)}</span>}
          {/* {user?.unreadMessages > 0 ? <span className='text-red-500 text-xs'>{user?.unreadMessages}</span> : <></>} */}
          {user?.unreadMessages > 0 ? <CheckCircle className='text-red-500 w-4 h-4' /> : <></>}
        </button>)}
      </>
    }

    // {
    //   chatMode === 'group' ? (
    //     mockGroups.map((group) => (
    //       <button
    //         key={group.id}
    //         onClick={() => {
    //           setSelectedGroup(group);
    //           setSelectedUser(null);
    //         }}
    //         className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedGroup?.id === group.id
    //           ? 'bg-white/10'
    //           : 'hover:bg-white/5'
    //           }`}
    //       >
    //         {group.id === 'wow' ? (
    //           <img src={group.icon} alt="WOW" className="w-10 h-10" />
    //         ) : (
    //           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
    //             {group.icon}
    //           </div>
    //         )}
    //         <div className="flex-1 text-left">
    //           <div className="flex items-center gap-2">
    //             <span className="font-medium">{group.name}</span>
    //             {group.type === 'private' && (
    //               <Lock className="w-3 h-3 text-white/40" />
    //             )}
    //             {group.type === 'nft-gated' && (
    //               <Shield className="w-3 h-3 text-white/40" />
    //             )}
    //           </div>
    //           <div className="text-sm text-white/60 truncate">
    //             {group.members.length} members
    //           </div>
    //         </div>
    //       </button>
    //     ))
    //   ) : (
    //     mockUsers.map((user) => (
    //       <button
    //         key={user.id}
    //         onClick={() => {
    //           setSelectedUser(user);
    //           setSelectedGroup(null);
    //         }}
    //         className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedUser?.id === user.id
    //           ? 'bg-white/10'
    //           : 'hover:bg-white/5'
    //           }`}
    //       >
    //         <div className="relative">
    //           <img
    //             src={user.avatar}
    //             alt={user.name}
    //             className="w-10 h-10 rounded-full"
    //           />
    //           <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0c] ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'
    //             }`} />
    //         </div>
    //         <div className="flex-1 text-left">
    //           <div className="flex items-center gap-2">
    //             <span className="font-medium">{user.name}</span>
    //             {user.nftAccess && (
    //               <Shield className="w-3 h-3 text-white/40" />
    //             )}
    //           </div>
    //           <div className="text-sm text-white/60">
    //             {user.isOnline ? user.status || user.ens : user.lastSeen}
    //           </div>
    //         </div>
    //       </button>
    //     ))
    //   )
    // }
  }

  const renderChatBox = (chatId: string, type: ChatType, isOwner: boolean, content: string, address: string, reaction?: string) => {
    let messageContent = content
    let fileName = ""
    let fileSize = ""
    let fileType = ""

    try {
      if (type === "File") {
        const parsed = JSON.parse(content)
        // console.log('parsed = ', parsed)
        if (parsed) {
          messageContent = parsed.content.split(",")[1]
          fileName = parsed.name
          fileSize = parsed.size
          fileType = parsed.type
        }
      } else if (type === "Image") {
        const parsed = JSON.parse(content)
        if (parsed) {
          messageContent = parsed.content
        }
      }
    } catch (err) {
      // console.log('file content parse err')
    }

    const renderReactionBtn = () => <div className={`absolute ${!isOwner ? 'right-[-20px]' : 'left-[-20px]'} bottom-[2px]`}>
      <Popover>
        <PopoverTrigger>
          <Smile className={`text-white/50 w-4 h-4 cursor-pointer`} />
        </PopoverTrigger>
        <PopoverContent className='!bg-transparent !border-transparent !w-[200px]'>
          <div className='flex gap-1'>
            <button onClick={() => handleReaction(chatId, '👍')}>👍</button>
            <button onClick={() => handleReaction(chatId, '👎')}>👎</button>
            <button onClick={() => handleReaction(chatId, '❤️')}>❤️</button>
            <button onClick={() => handleReaction(chatId, '🔥')}>🔥</button>
            <button onClick={() => handleReaction(chatId, '😲')}>😲</button>
            <button onClick={() => handleReaction(chatId, '😂')}>😂</button>
            <button onClick={() => handleReaction(chatId, '😢')}>😢</button>
          </div>
        </PopoverContent>
      </Popover>
    </div>

    const reactionIcon = () => reaction ? <span className={`absolute ${!isOwner ? 'right-[8px]' : 'left-[8px]'} bottom-[-10px]`}>{reaction}</span> : null

    if (type === "Text") {
      return <div className={`flex ${!isOwner ? 'justify-start' : 'justify-end'}`}>
        <div className={`relative rounded-lg p-3 max-w-[480px] inline-block ${!isOwner ? 'bg-white/5' : 'bg-blue-500/20 ml-auto'}`}>
          {messageContent}
          {renderReactionBtn()}
          {reactionIcon()}
        </div>
      </div>
    } else if (type === "MediaEmbed") {
      return <div className={`relative w-52 ${!isOwner ? '' : 'ml-auto'}`}>
        <img className={`w-52 h-auto`} src={messageContent} />
        {renderReactionBtn()}
        {reactionIcon()}
      </div>
    } else if (type === "Image") {
      return <div className={`relative w-52 ${!isOwner ? '' : 'ml-auto'}`}>
        <img className={`w-52 h-auto`} src={messageContent} />
        {renderReactionBtn()}
        {reactionIcon()}
      </div>
    } else if (type === "File") {
      return <div className={`relative flex flex-col gap-4 items-center w-56 h-20 rounded-lg justify-center  ${!isOwner ? 'bg-white/5' : 'bg-blue-500/20 ml-auto'}`}>
        <div className='flex gap-4 items-center'>
          <File className='w-10 h-10 text-white/50' />
          <div className='flex flex-col text-white/50'>
            <span className='text-md'>{fileName}</span>
            <span className='text-sm text-center'>{fileSize}B</span>
          </div>
          <Download className='w-5 h-5 cursor-pointer' onClick={() => downloadBase64File(messageContent, fileName, fileType)} />
        </div>
        {renderReactionBtn()}
        {reactionIcon()}
      </div>
    }
  }

  const renderChatHistory = () => {
    if (chatMode === "p2p") {
      return chatHistory.map((msg: IChat) => (
        msg.type !== "Reaction" ? <div key={msg.timestamp} className={`flex items-start gap-3 group`}>
          {
            msg.fromAddress == selectedUser?.address &&
            < img
              src={selectedUser.profilePicture}
              className="w-8 h-8 rounded-full mt-1"
            />
          }
          <div className="flex-1 min-w-0">
            <div className={`${msg.fromAddress == selectedUser?.address ? "" : "justify-end"} flex items-center gap-2 mb-1`}>
              {/* <span className="text-sm text-white/60">{"sender ens"}</span> */}
              <span className="font-medium text-white/70">{msg.fromAddress == selectedUser?.address ? shrinkAddress(extractAddress(msg.fromAddress)) : ""}</span>
              <span className={`text-sm text-white/40`}>{getChatHistoryDate(msg.timestamp)}</span>
            </div>
            {
              renderChatBox(msg.chatId, msg.type, msg.fromAddress != selectedUser?.address, msg.content, msg.fromAddress, msg.reaction)
            }
          </div>
        </div> : null
      ))
    } else if (chatMode === "group") {
      return chatHistory.map((msg) => (
        <div key={msg.timestamp} className={`flex items-start gap-3 group`}>
          {
            msg.fromAddress != address ? msg.image ?
              < img
                src={msg.image}
                className="w-8 h-8 rounded-full mt-1"
              />
              : null : null
          }
          <div className="flex-1 min-w-0">
            <div className={`${msg.fromAddress != address ? "" : "justify-end"} flex items-center gap-2 mb-1`}>
              {/* <span className="text-sm text-white/60">{"sender ens"}</span> */}
              <span className="font-medium text-white/70">{msg.fromAddress != address ? shrinkAddress(extractAddress(msg.fromAddress)) : ""}</span>
              <span className={`text-sm text-white/40`}>{getChatHistoryDate(msg.timestamp)}</span>
            </div>
            {
              renderChatBox(msg.chatId, msg.type, msg.fromAddress == address, msg.content, "", msg.reaction)
            }
          </div>
          {
            msg.fromAddress == address ? msg.image ?
              < img
                src={msg.image}
                className="w-8 h-8 rounded-full mt-1"
              />
              : null : null
          }
        </div>
      ))
    }
  }

  const isUserRequest = useMemo(() => selectedUser?.type === "Request", [selectedUser])
  const isGroupRequest = useMemo(() => selectedGroup?.type === "Request", [selectedGroup])
  const isGroupSearch = useMemo(() => selectedGroup?.type === "Searched", [selectedGroup])

  const renderButtonsInHistory = () => {
    if (isUserRequest) {
      return <div className='w-full flex justify-center'>
        <div className='w-[320px] rounded-lg p-3 bg-white/5'>
          <span className='text-white/40'>This wallet wants to chat with you! Please accept to continue or reject to decline.</span>
          <div className='mt-2 flex gap-4 justify-center'>
            {
              isHandlingRequest ? <Spinner className='w-10 h-10' /> : <>
                <button onClick={handleAcceptChat}>
                  <CheckCircle className='text-blue-500 w-10 h-10' />
                </button>
                <button onClick={handleRejectChat}>
                  <XCircle className='text-white/40 w-10 h-10' />
                </button>
              </>
            }
          </div>
        </div>
      </div>
    }

    if (isGroupRequest) {
      console.log('group request')
      return <div className='w-full flex justify-center'>
        <div className='w-[320px] rounded-lg py-5 px-3 bg-white/5'>
          <div className='text-white/40 text-center'>You were invited to this group. Please accept to continue messaging in this group.</div>
          <div className='mt-2 flex gap-4 justify-center'>
            {
              isHandlingRequest ? <Spinner className='w-10 h-10' /> : <>
                <button onClick={handleAcceptGroupRequest}>
                  <CheckCircle className='text-blue-500 w-10 h-10' />
                </button>
                <button onClick={handleRejectRequest}>
                  <XCircle className='text-white/40 w-10 h-10' />
                </button>
              </>
            }
          </div>
        </div>
      </div>
    }

    if (isGroupSearch) {
      return <div className='w-full flex justify-center'>
        <div className='w-[320px] rounded-lg py-5 px-3 bg-white/5'>
          <div className='text-white/40 text-center'>Click on the button to join the group.</div>
          <div className='mt-2 flex gap-4 justify-center'>
            {
              !isJoiningGroup ?
                <button
                  className='py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg'
                  onClick={handleJoinGroup}>
                  Join Group
                </button> :
                <Spinner />
            }
          </div>
        </div>
      </div>
    }

    return null
  }

  const renderMessages = () => {
    if (!selectedGroup && !selectedUser) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <MessageSquare className="w-12 h-12 mb-4" />
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      );
    }

    if (loadingChatHistory) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner />
        </div>
      )
    }

    if (chatHistory && chatHistory.length > 0) {
      return (
        <div className="space-y-4">
          {
            loadingPrevChat && <div className='w-full flex justify-center'>
              <Spinner />
            </div>
          }
          {
            renderChatHistory()
          }
          {
            renderButtonsInHistory()
          }
        </div>
      )
    } else {
      return (
        renderButtonsInHistory() ||
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <MessageSquare className="w-12 h-12 mb-4" />
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      )
    }

    // // Check access before showing messages
    // if (!canAccessChat(selectedUser, selectedGroup)) {
    //   return (
    //     <div className="flex flex-col items-center justify-center h-full text-center p-6">
    //       <Shield className="w-16 h-16 text-red-400 mb-4" />
    //       <h3 className="text-xl font-medium mb-2">NFT Required</h3>
    //       <p className="text-white/60 mb-4">
    //         This {selectedGroup ? 'group' : 'chat'} requires ownership of{' '}
    //         {selectedGroup?.requiredNft?.collection || selectedUser?.nftAccess?.[0].collection}
    //       </p>
    //       <div className="flex items-center gap-4">
    //         <img
    //           src={selectedGroup?.requiredNft?.image || selectedUser?.nftAccess?.[0].image}
    //           alt="Required NFT"
    //           className="w-24 h-24 rounded-lg"
    //         />
    //         <div className="text-left">
    //           <h4 className="font-medium mb-2">Required NFT</h4>
    //           <p className="text-sm text-white/60">
    //             You need to own at least one NFT from this collection to access the chat
    //           </p>
    //           <a
    //             href="https://opensea.io"
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm"
    //           >
    //             <span>Buy on OpenSea</span>
    //             <ExternalLink className="w-4 h-4" />
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    // // Show trading group messages
    // if (selectedGroup?.id === 'trading') {
    //   return (
    //     <div className="space-y-4">
    //       {tradingGroupMessages.map((msg) => (
    //         <div key={msg.id} className="flex items-start gap-3 group">
    //           <img
    //             src={msg.sender.avatar}
    //             alt={msg.sender.name}
    //             className="w-8 h-8 rounded-full mt-1"
    //           />
    //           <div className="flex-1 min-w-0">
    //             <div className="flex items-center gap-2 mb-1">
    //               <span className="font-medium">{msg.sender.name}</span>
    //               <span className="text-sm text-white/60">{msg.sender.ens}</span>
    //               <span className="text-sm text-white/40">{msg.timestamp}</span>
    //             </div>
    //             <div className="bg-white/5 rounded-lg p-3">
    //               {msg.content}
    //             </div>
    //             {msg.reactions && (
    //               <div className="flex items-center gap-2 mt-2">
    //                 {msg.reactions.map((reaction, index) => (
    //                   <button
    //                     key={index}
    //                     className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${reaction.reacted ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 hover:bg-white/10'
    //                       } transition-colors`}
    //                   >
    //                     <span>{reaction.emoji}</span>
    //                     <span>{reaction.count}</span>
    //                   </button>
    //                 ))}
    //                 <button className="p-1 rounded-full bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
    //                   <Plus className="w-3 h-3" />
    //                 </button>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }

    // // Show Bob's direct messages
    // if (selectedUser?.id === '2') { // Bob's ID
    //   const chatMessages = messages['bob'] || [];
    //   return (
    //     <div className="space-y-4">
    //       {chatMessages.map((msg) => (
    //         <div key={msg.id} className="flex items-start gap-3 group">
    //           <img
    //             src={msg.sender.avatar}
    //             alt={msg.sender.name}
    //             className="w-8 h-8 rounded-full mt-1"
    //           />
    //           <div className="flex-1 min-w-0">
    //             <div className="flex items-center gap-2 mb-1">
    //               <span className="font-medium">{msg.sender.name}</span>
    //               <span className="text-sm text-white/60">{msg.sender.ens}</span>
    //               <span className="text-sm text-white/40">{msg.timestamp}</span>
    //             </div>
    //             <div className={`rounded-lg p-3 ${msg.sender.id === 'me' ? 'bg-blue-500/20 ml-auto' : 'bg-white/5'
    //               }`}>
    //               {msg.content}
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }

    // Empty state for other chats
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div
          className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out flex ${isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
            }`}
          onClick={handleClickModal}
        >
          {!chatUser?.uid && <div className='absolute top-0 right-0 bottom-0 left-0 inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10'>
            <button className="py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium text-sm" onClick={handleUnlock}>
              Unlock Profile
            </button>
          </div>}

          {loading && <div className='absolute top-0 right-0 bottom-0 left-0 inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10'>
            <Spinner />
          </div>}

          {/* Left Sidebar */}
          <div className="w-80 border-r border-white/10 relative">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setChatMode('group')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${chatMode === 'group' ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Groups</span>
                </button>
                <button
                  onClick={() => setChatMode('p2p')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${chatMode === 'p2p' ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /> */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder={`Search ${chatMode === 'group' ? 'groups' : 'users'}...`}
                  className="w-full bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40 mr-4"
                />
                {
                  isSearching ? <Spinner size={'sm'} /> :
                    <button onClick={handleSearch}>
                      <Search className='w-4 h-4' />
                    </button>
                }
              </div>

              {chatMode === 'group' && (
                <button
                  onClick={() => setIsCreateGroupActive(true)}
                  className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Group</span>
                </button>
              )}
            </div>

            <div className={`p-2 overflow-y-auto ai-chat-scrollbar ${chatMode === "group" ? "max-h-[calc(100%-238px)]" : "max-h-[calc(100%-188px)]"}`}>
              {renderGroupsAndUsers()}
            </div>

            <div className='border-t border-white/10 absolute left-0 right-0 bottom-[12px] pt-2 px-4'>
              {ownProfile && <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center gap-4'>
                  <img src={ownProfile.picture} className='rounded-full w-10 h-10' />
                  <Clipboard address={address} ensName='' />
                </div>
                <Edit className='text-white/50 w-4 h-4 cursor-pointer' onClick={() => setIsEditProfileActive(true)} />
              </div>}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {selectedUser ? (
                  <>
                    <div className="relative flex items-center">
                      {/* <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0c] ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`} /> */}
                      {
                        selectedUser?.profilePicture ? <img src={selectedUser?.profilePicture} className='w-10 h-10 mr-4 rounded-full' /> : <User className='w-10 h-10 mr-4' />
                      }
                      {
                        selectedUser?.name ?
                          <div className='flex flex-col'>
                            <div>{selectedUser?.name}</div>
                            <Clipboard address={selectedUser.address} ensName={selectedUser.ensName} />
                          </div>
                          :
                          <Clipboard address={selectedUser.address} ensName={selectedUser.ensName} />
                      }
                    </div>
                    {/* <div>
                      <div className="font-medium">{selectedUser.name}</div>
                      <div className="text-sm text-white/60">
                        {selectedUser.isOnline ? selectedUser.status || selectedUser.ens : selectedUser.lastSeen}
                      </div>
                    </div> */}
                  </>
                ) : selectedGroup ? (
                  <div className='flex items-center'>
                    <img src={selectedGroup?.image} className='w-10 h-10 mr-2 rounded-lg' />
                    <div className='flex flex-col'>
                      {selectedGroup?.name}
                      <Clipboard address={selectedGroup.groupId} ensName='' />
                    </div>
                    {/* {selectedGroup.id === 'wow' ? (
                      <img src={selectedGroup.icon} alt="WOW" className="w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {selectedGroup.icon}
                      </div>
                    )} */}
                    {/* <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedGroup.name}</span>
                        {selectedGroup.public && (
                          <Lock className="w-3 h-3 text-white/40" />
                        )}
                        {selectedGroup.type === 'nft-gated' && (
                          <Shield className="w-3 h-3 text-white/40" />
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {selectedGroup.members.length} members
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <div className="text-white/40">Select a chat to start messaging</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {renderAccessBadge(selectedUser, selectedGroup)}
                {/* {selectedUser?.isOnline && (
                  <>
                    <button
                      onClick={() => setIsVideoCallActive(true)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </>
                )} */}
                {
                  selectedGroup?.public == true ? <Tooltip label="Public"><Eye className='w-4 h-4 text-white/50' /></Tooltip> :
                    selectedGroup?.public == false ? <Tooltip label="Private"><Lock className='w-4 h-4 text-white/50' /></Tooltip> : null
                }
                {selectedGroup && (
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsChatGroupModalActive(true)}>
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatScrollRef} className="flex-1 p-4 overflow-x-hidden overflow-y-auto ai-chat-scrollbar">
              {renderMessages()}
            </div>

            {/* Chat Input */}
            {canAccessChat(selectedUser, selectedGroup) && (
              <div className="p-4 border-t border-white/10 relative">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors" ref={emojiBtnRef} onClick={() => setIsEmojiOpen(!isEmojiOpen)}>
                    <Smile className="w-5 h-5" />
                  </button>

                  <div ref={emojiPickRef}
                    className='!absolute bottom-[62px] left-[16px]'>
                    <EmojiPicker open={isEmojiOpen}
                      onEmojiClick={handleEmojiClick}
                      theme={Theme.DARK}
                    />
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 px-4 py-2 rounded-lg outline-none resize-none overflow-hidden"
                    rows={1} // Adjust rows dynamically
                  />

                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" ref={gifBtnRef} onClick={() => setIsGifOpen(!isGifOpen)}>
                    Gif
                  </button>

                  {isGifOpen && <div ref={gifPickRef}
                    className='!absolute bottom-[62px] right-[16px]'>
                    <GifPicker
                      tenorApiKey={"AIzaSyBxr4hrP59kdbQV4xJ-t2CSQX0Y6q4gcbA"}
                      theme={GifTheme.DARK}
                      onGifClick={handleGifClick}
                    />
                  </div>}

                  <label className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                  {
                    !sendingMessage ? <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={`p-2 rounded-lg transition-colors ${message.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
                        }`}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button> : <Spinner />
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupActive}
        onClose={() => setIsCreateGroupActive(false)}
        onMakeGroup={onMakeGroup}
      />

      <SendFileModal
        isOpen={isSendModalActive}
        onClose={() => { setIsSendModalActive(false); setSelectedFile(null); }}
        file={selectedFile}
        onSendFile={handleSendFile}
      />

      <VideoCallModal
        isOpen={isVideoCallActive}
        onClose={() => setIsVideoCallActive(false)}
        user={null}
      />

      <EditChatProfileModal
        isOpen={isEditProfileActive}
        onClose={() => setIsEditProfileActive(false)}
        profile={ownProfile}
        setProfile={setOwnProfile}
      />

      <ChatGroupModal
        isOpen={isChatGroupModalActive}
        onClose={() => setIsChatGroupModalActive(false)}
        group={selectedGroup}
        updateOneGroup={updateOneGroup}
      />
    </>
  );
};