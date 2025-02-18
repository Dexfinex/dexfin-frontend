import React, { useEffect, useState, useContext } from 'react';
import { Plus, Search, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { Spinner, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getWalletProfile } from '../../utils/chatApi';
import { IUser } from '../../types/chat.type';
import { getEnsName, shrinkAddress } from '../../utils/common.util';

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  content: string;
  timestamp: string;
  isMe?: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      name: 'Bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      isOnline: true
    },
    content: "Hey! Just wanted to share my latest trade analysis. Looking at some interesting setups in the DeFi sector. 📊",
    timestamp: '11:15 AM'
  },
  {
    id: '2',
    sender: {
      name: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      isOnline: true
    },
    content: "Thanks for sharing! What specific protocols are you looking at?",
    timestamp: '11:16 AM',
    isMe: true
  },
  {
    id: '3',
    sender: {
      name: 'Bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      isOnline: true
    },
    content: "Mainly focusing on Aave and Compound. The lending rates are looking attractive right now.",
    timestamp: '11:17 AM'
  }
];

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: IUser | null;
  setSelectedUser: (user: IUser) => void;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, selectedUser, setSelectedUser }) => {
  const { chatUser } = useStore();
  const { address } = useContext(Web3AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchedUser, setSearchedUser] = useState<IUser | null>(null);

  const handleSearch = async () => {
    if (!searchQuery || searchQuery == address) return
    if (selectedUser?.address == searchQuery) return
    setSearching(true)

    try {
      const profile = await getWalletProfile(chatUser, searchQuery)

      if (profile) {
        console.log('profile = ', profile)
        const ensName = await getEnsName(searchQuery)

        console.log('ens name = ', ensName)
        const user = {
          name: profile.name,
          ensName,
          profilePicture: profile.picture,
          address: searchQuery,
          chatId: "",
          type: "Connected",
          unreadMessages: 0,
          lastTimestamp: 0,
          lastMessage: ""
        } as IUser

        setSearchedUser(user)
      }
    } catch (err) {
      console.log('get user profile err: ', err)
    }

    setSearching(false)
  }

  return (
    isOpen && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/90 p-3 rounded-lg shadow-lg w-[320px]"
          initial={{ y: "-100%", opacity: 0 }}  // Start from top (hidden)
          animate={{ y: 0, opacity: 1 }}       // Animate to visible position
          exit={{ y: "-100%", opacity: 0 }}    // Slide out to the top
          transition={{ type: "spring", stiffness: 300, damping: 25 }}  // Smooth transition
          onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside
        >
          <div className='w-full flex items-center'>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search Address"
              className="flex-1 bg-black/80 px-3 py-1.5 rounded-lg outline-none text-sm"
            />

            {
              searching ? <Spinner className='ml-2 text-black/80' /> :
                <button className='ml-2' onClick={handleSearch}>
                  <Search className='text-black/80 w-5 h-5 hover:text-black' />
                </button>
            }
          </div>
          {
            searchedUser && <div className='py-2 my-2 cursor-pointer hover:bg-white/70 rounded-lg' onClick={() => setSelectedUser(searchedUser as IUser)}>
              <div className='flex items-center gap-4 text-black'>
                <img src={searchedUser.profilePicture} className='rounded-full w-10 h-10' />
                <div className='flex items-start flex-col'>
                  {searchedUser?.name && <div>{searchedUser?.name}</div>}
                  <div>{searchedUser?.ensName ? searchedUser?.ensName + " | " + shrinkAddress(searchedUser.address) : shrinkAddress(searchedUser.address)}</div>
                </div>
              </div>
            </div>
          }
        </motion.div>
      </motion.div >
    )
  );
};

export const DirectMessagesWidget: React.FC = () => {
  const { chatUser, setChatUser } = useStore();
  const { signer, address } = useContext(Web3AuthContext);
  const [receivedMessage, setReceivedMessage] = useState<any>(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const toast = useToast()

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log('direct message compoment did amount')
    console.log('chat user = ', chatUser)
  }, [])


  useEffect(() => {
    handleReceiveMsg()
  }, [receivedMessage])

  const handleReceiveMsg = () => {
    console.log('handle receive message ', receivedMessage)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        isOnline: true
      },
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

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

  const handleUnlock = async () => {
    if (!signer) {
      toast({
        status: 'info',
        description: `Please connect your wallet first.`,
        duration: 3500
      })

      return
    }

    if (!chatUser?.uid) {
      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.PROD,
      });

      const encryption = await user.encryption.info()

      if (encryption?.decryptedPgpPrivateKey) {
        setChatUser(user)
        initStream(user)
      }
    }
  }

  return (
    <div className="p-2 h-full flex flex-col">
      {!chatUser?.uid && <div className='absolute top-[49px] right-0 bottom-0 left-0 inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10'>
        <button className="py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium text-sm" onClick={handleUnlock}>
          Unlock Profile
        </button>
      </div>}

      {/* Search */}
      <button className='absolute right-0 hover:bg-white/10 p-2 rounded-lg' onClick={() => setIsOverlay(true)}>
        <Search className='w-4 h-4' />
      </button>
      {isOverlay && <Overlay isOpen={isOverlay} onClose={() => setIsOverlay(false)} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto ai-chat-scrollbar space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${message.isMe ? 'flex-row-reverse' : ''}`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={message.sender.avatar}
                alt={message.sender.name}
                className="w-6 h-6 rounded-full"
              />
              {message.sender.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0c]" />
              )}
            </div>
            <div className={`max-w-[75%] ${message.isMe ? 'items-end' : 'items-start'}`}>
              <div className={`p-2 rounded-lg text-sm ${message.isMe ? 'bg-blue-500/20' : 'bg-white/5'
                }`}>
                {message.content}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-2 flex items-center gap-2">
        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 px-3 py-1.5 rounded-lg outline-none text-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`p-1.5 rounded-lg transition-colors ${newMessage.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
            }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};