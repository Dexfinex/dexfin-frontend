import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { Plus, Search, Send, MessageSquare, Smile, File, Download } from 'lucide-react';
import { useInView } from "react-intersection-observer";
import { useStore } from '../../store/useStore';
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { Spinner, useToast, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getWalletProfile } from '../../utils/chatApi';
import { IUser, IChat, ChatType } from '../../types/chat.type';
import { getEnsName, shrinkAddress, extractAddress, getChatHistoryDate, downloadBase64File } from '../../utils/common.util';
import { LIMIT } from '../../utils/chatApi';

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

  const handleSelectUser = () => {
    setSelectedUser(searchedUser as IUser)
    onClose()
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
            searchedUser && <div className='py-2 my-2 cursor-pointer hover:bg-white/70 rounded-lg' onClick={handleSelectUser}>
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
  const [chatHistory, setChatHistory] = useState<Array<IChat>>([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);
  const [loadingPrevChat, setLoadingPrevChat] = useState(false);
  const [toBottom, setToBottom] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [firstLoadTop, setFirstLoadTop] = useState(true);
  const toast = useToast()

  const { ref: topRef, inView: topInView } = useInView({ threshold: 1 }); // Detect top scroll

  useEffect(() => {
    console.log('selectedUser = ', selectedUser)
    if (selectedUser) {
      handleSelectUser()
    }
  }, [selectedUser])

  useEffect(() => {
    handleReceiveMsg()
  }, [receivedMessage])

  useEffect(() => {
    if (firstLoadTop) {
      setFirstLoadTop(false);
      return; // 🚀 Prevent fetching old messages on first render
    }

    if (topInView) {
      console.log('fetch old messages in topInView')
      if (selectedUser && chatHistory.length > 0 && chatHistory[0].link) {
        getPrevChatHistory(selectedUser.address, chatHistory[0].chatId)
      }
    }
  }, [topInView])

  const scrollBottom = useCallback(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    if (toBottom) {
      scrollBottom()
      setToBottom(false)
    }
  }, [chatHistory, toBottom, scrollBottom])

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
        const updatedChat = [...chats.reverse(), ...chatHistory]
        setChatHistory(updatedChat)
      }
    }

    setLoadingPrevChat(false)
  }

  const handleSelectUser = async () => {
    setLoadingChatHistory(true)

    const history = await chatUser.chat.history(selectedUser?.address, { limit: LIMIT })

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
    }

    setLoadingChatHistory(false)
  }

  const handleReceiveMsg = () => {
    console.log('handle receive message ', receivedMessage)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

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

    const handleReaction = async (chatId: string, content: string) => {
      const receipient = selectedUser ? selectedUser.address : ""

      if (!receipient) return

      try {
        const updatedChat = chatHistory.map(chat => chat.chatId == chatId ? { ...chat, reaction: content } : chat)
        setChatHistory([...updatedChat])

        const sentReaction = await chatUser.chat.send(receipient, {
          type: 'Reaction',
          content,
          reference: chatId
        })

        console.log('sent reaction = ', sentReaction)
      } catch (err) {
        console.log('reaction err: ', err)
        const updated = chatHistory.map(chat => chat.chatId == chatId ? { ...chat, reaction: "" } : chat)
        setChatHistory([...updated])
      }
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
        <div className={`relative rounded-lg p-2 text-sm max-w-[480px] inline-block ${!isOwner ? 'bg-white/5' : 'bg-blue-500/20 ml-auto'}`}>
          {messageContent}
          {renderReactionBtn()}
          {reactionIcon()}
        </div>
      </div>
    } else if (type === "MediaEmbed") {
      return <div className={`relative w-44 ${!isOwner ? '' : 'ml-auto'}`}>
        <img className={`w-44 h-auto`} src={messageContent} />
        {renderReactionBtn()}
        {reactionIcon()}
      </div>
    } else if (type === "Image") {
      return <div className={`relative w-44 ${!isOwner ? '' : 'ml-auto'}`}>
        <img className={`w-44 h-auto`} src={messageContent} />
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
      <button className='absolute top-8 right-2 hover:bg-white/10 p-2 rounded-lg' onClick={() => setIsOverlay(true)}>
        <Search className='w-4 h-4' />
      </button>
      {isOverlay && <Overlay isOpen={isOverlay} onClose={() => setIsOverlay(false)} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}

      {/* Messages */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto ai-chat-scrollbar space-y-2" ref={chatScrollRef} >
        {
          loadingChatHistory ?
            <div className='flex items-center justify-center h-full'>
              <Spinner />
            </div>
            :
            chatHistory.length > 0 ? <>
              <div ref={topRef}></div>
              {loadingPrevChat && <div className='w-full flex justify-center'>
                <Spinner />
              </div>}
              {chatHistory.map((msg: IChat) => (
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
                      <span className="text-xs font-small text-white/70">{msg.fromAddress == selectedUser?.address ? shrinkAddress(extractAddress(msg.fromAddress)) : ""}</span>
                      <span className={`text-xs text-white/40`}>{getChatHistoryDate(msg.timestamp)}</span>
                    </div>
                    {
                      renderChatBox(msg.chatId, msg.type, msg.fromAddress != selectedUser?.address, msg.content, msg.fromAddress, msg.reaction)
                    }
                  </div>
                </div> : null
              ))}
            </>
              :
              !selectedUser ?
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  Please select a user
                </div> :
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <MessageSquare className="w-12 h-12 mb-4" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start a conversation!</p>
                  <p className='text-sm'>{shrinkAddress(selectedUser.address)}</p>
                </div>
        }
      </div>

      {/* Input */}
      {selectedUser && <div className="mt-2 flex items-center gap-2">
        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
      </div>}
    </div>
  );
};