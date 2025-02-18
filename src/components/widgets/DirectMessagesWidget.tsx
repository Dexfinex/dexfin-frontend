import React, { useEffect, useState, useContext } from 'react';
import { Plus, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { Spinner, useToast } from '@chakra-ui/react';

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

export const DirectMessagesWidget: React.FC = () => {
  const { chatUser, setChatUser } = useStore();
  const { signer, address } = useContext(Web3AuthContext);
  const [receivedMessage, setReceivedMessage] = useState<any>(null);
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