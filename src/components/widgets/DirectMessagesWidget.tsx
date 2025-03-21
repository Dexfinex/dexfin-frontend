import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CheckCircle, Download, File, MessageSquare, Search, Send, Share2, Smile, XCircle } from 'lucide-react';
import { useInView } from "react-intersection-observer";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import GifPicker, { Theme as GifTheme } from 'gif-picker-react';
import { useStore } from '../../store/useStore';
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { Popover, PopoverContent, PopoverTrigger, Spinner, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BIG_IMAGE_WIDHT, getWalletProfile, initStream, LIMIT } from '../../utils/chat.util.ts';
import { ChatType, IChat, IUser } from '../../types/chat.type';
import { downloadBase64File, extractAddress, getEnsName, getHourAndMinute, shrinkAddress } from '../../utils/common.util';
import { ImageWithSkeleton } from '../common/ImageWithSkeleton';
import { WalletTypeEnum } from "../../types/wallet.type";
import { LOCAL_STORAGE_PUSH_KEY, LOCAL_STORAGE_LAST_CHAT_USER } from '../../constants';
import useLocalStorage from '../../hooks/useLocalStorage.ts';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: IUser | null;
  setSelectedUser: (user: IUser) => void;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, selectedUser, setSelectedUser }) => {
  const { chatUser, theme } = useStore();
  const { address } = useContext(Web3AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchedUser, setSearchedUser] = useState<IUser | null>(null);
  const [_, setLastChatUser] = useLocalStorage<IUser | null>(LOCAL_STORAGE_LAST_CHAT_USER, {} as IUser);

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
        setLastChatUser(user)
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
        className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-10 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`${theme === "dark" ? 'bg-black/90 border border-white/30' : 'bg-white/90'} p-3 rounded-lg shadow-lg w-[320px]`}
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
              className={`${theme === "dark" ? "bg-white/20 caret-white placeholder-white text-white" : ""} flex-1 px-3 py-1.5 rounded-lg outline-none text-sm caret:black text-black`}
            />

            {
              searching ? <Spinner className={`${theme === "dark" ? "text-white/80" : "text-black/80"} ml-2`} /> :
                <button className='ml-2' onClick={handleSearch}>
                  <Search className={`${theme === "dark" ? "text-white hover:text-white/80" : "text-black/80 hover:text-black"}  w-5 h-5`} />
                </button>
            }
          </div>
          {
            searchedUser && <div className={`${theme === "dark" ? "hover:bg-white/10" : "hover:bg-white/70"} p-2 my-2 cursor-pointer rounded-lg`} onClick={handleSelectUser}>
              <div className='flex items-center gap-4 text-black'>
                <img src={searchedUser.profilePicture} className='rounded-full w-10 h-10' />
                <div className={`${theme === "dark" ? "text-white/80" : ""} text-sm flex items-start flex-col`}>
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
  const { chatUser, setChatUser, receivedMessage, isChatOpen, theme } = useStore();
  const { address, signer, walletType } = useContext(Web3AuthContext);
  const [isOverlay, setIsOverlay] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<IChat>>([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);
  const [loadingPrevChat, setLoadingPrevChat] = useState(false);
  const [toBottom, setToBottom] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isRequestUser, setIsRequestUser] = useState(false);
  const [isHandlingRequest, setIsHandlingRequest] = useState(false);
  const [firstLoadTop, setFirstLoadTop] = useState(true);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  // const [lastChatUser, _] = useLocalStorage<IUser | null>(LOCAL_STORAGE_LAST_CHAT_USER, {} as IUser);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const emojiPickRef = useRef<HTMLDivElement>(null);
  const gifPickRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const gifBtnRef = useRef<HTMLButtonElement>(null);
  const toast = useToast()

  const { ref: topRef, inView: topInView } = useInView({ threshold: 1 }); // Detect top scroll

  const handleClickOutside = (e: any) => {
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen && chatUser) {
      const lastChatUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LAST_CHAT_USER) || "{}")

      if (!selectedUser) {
        setSelectedUser(lastChatUser)
        // handleSelectUser()
      } else if (selectedUser.address != lastChatUser?.address) {
        setSelectedUser(lastChatUser)
        // handleSelectUser()
      } else {
        handleSelectUser()
      }
    }
  }, [isChatOpen, chatUser])

  useEffect(() => {
    // console.log('selectedUser = ', selectedUser)
    if (selectedUser) {
      handleSelectUser()
    }
  }, [selectedUser])

  useEffect(() => {
    handleReceiveMsg()
  }, [receivedMessage])

  useEffect(() => {
    if (!newMessage) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "32px";
      }
    }
  }, [newMessage])

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

  useLayoutEffect(() => {
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
    if (!selectedUser) return
    setLoadingChatHistory(true)

    const history = await chatUser.chat.history(selectedUser?.address, { limit: LIMIT })

    if (history.length > 0) {
      console.log('history = ', history)
      if (history[0].listType == "REQUESTS" && extractAddress(history[0].toDID) == address) {
        setIsRequestUser(true)
      } else if (isRequestUser) {
        setIsRequestUser(false)
      }

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
    console.log('--------handle receive message in DirectMessageWidget------------')

    if (receivedMessage?.meta?.group == false) {
      if (receivedMessage.origin == "other") {
        if (receivedMessage.event == "chat.request") {
          if (selectedUser?.address == extractAddress(receivedMessage.from)) {
            setChatHistory(prev =>
              [...prev, {
                timestamp: Number(receivedMessage.timestamp),
                type: receivedMessage.message.type,
                content: receivedMessage.message.content,
                fromAddress: extractAddress(receivedMessage.from),
                toAddress: extractAddress(receivedMessage.to[0]),
                chatId: receivedMessage.reference,
                link: null,
                reaction: ""
              }]
            )
          }
        } else if (receivedMessage.event == "chat.message") {
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
                  chatId: receivedMessage.reference,
                  link: null,
                  reaction: ""
                }]
              )
            }
          }
        }
      } else if (receivedMessage.origin == "self") {
        //
      }
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (sendingMessage) return;

    setSendingMessage(true)
    setToBottom(true)

    if (selectedUser) {
      const updatedChat: IChat[] = [...chatHistory, {
        timestamp: Math.floor(Date.now()),
        type: "Text",
        content: newMessage.trim(),
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
          content: newMessage.trim()
        })

        setNewMessage("")
        setChatHistory(updatedChat.map((chat, index) => index == updatedChat.length - 1 ? { ...chat, chatId: sentMsg.cid } : chat))
      } catch (err) {
        toast({
          status: 'error',
          description: `Can't send a message. Please try again.`,
          duration: 3500
        })
        setChatHistory(prev => [...prev.slice(0, prev.length - 1)])
        console.log('sent msg err: ', err)
      }
    }

    setSendingMessage(false)
  }

  const handleTextChange = (e: any) => {
    setNewMessage(e.target.value)
    adjustHeight()
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const adjustHeight = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

  const sendMedia = async (content: string, type: ChatType) => {
    setToBottom(true)

    try {
      if (selectedUser) {
        const updated = [...chatHistory, {
          timestamp: Math.floor(Date.now()),
          type,
          content,
          fromAddress: address,
          toAddress: selectedUser?.address,
          chatId: "",
          link: null,
          reaction: ""
        }]
        setChatHistory(updated)

        const sentMedia = await chatUser.chat.send(selectedUser?.address, {
          type,
          content
        })
        console.log('sent media: ', sentMedia)

        setNewMessage("")
        setChatHistory(updated.map((chat, index) => index == updated.length - 1 ? { ...chat, chatId: sentMedia.cid } : chat))
      }
    } catch (err) {
      console.log('send media err: ', err)
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
      if (file.size > 1 * 1024 * 1024) {
        toast({
          status: 'error',
          description: `Please select a file smaller than 1MB.`,
          duration: 3500
        })
        return
      }

      setSendingMessage(true)
      const reader = new FileReader()
      reader.readAsDataURL(file); // Convert file to Base64
      reader.onload = async () => {
        console.log("Base64:", reader.result); // Base64 string
        const fileType = (file.type.startsWith("image/") ? "Image" : "File")
        const content = {
          content: reader.result,
          name: file.name,
          size: file.size,
          type: file.type
        }

        event.target.value = "";

        await sendMedia(JSON.stringify(content), fileType)
        setSendingMessage(false)
      };
      reader.onerror = (err) => {
        console.log("Base64 err:", err)
      };
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    setNewMessage(newMessage + emojiData.emoji)
    setIsEmojiOpen(false)
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
      if (!canAccessChat()) return
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
          <Smile className={`w-4 h-4 cursor-pointer`} />
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
        <div className={`relative rounded-lg p-2 text-sm max-w-[368px] inline-block ${!isOwner ? 'bg-white/5' : 'bg-blue-500/20 ml-auto'}`}>
          {messageContent}
          {renderReactionBtn()}
          {reactionIcon()}
        </div>
      </div>
    } else if (type === "MediaEmbed") {
      return <div className={`relative w-52 ${!isOwner ? '' : 'ml-auto'}`}>
        <ImageWithSkeleton src={messageContent} width={BIG_IMAGE_WIDHT} />
        {renderReactionBtn()}
        {reactionIcon()}
      </div>
    } else if (type === "Image") {
      return <div className={`relative w-52 ${!isOwner ? '' : 'ml-auto'}`}>
        <ImageWithSkeleton src={messageContent} width={BIG_IMAGE_WIDHT} />
        {renderReactionBtn()}
        {reactionIcon()}
      </div>
    } else if (type === "File") {
      return <div className={`relative flex flex-col gap-4 items-center w-56 h-20 rounded-lg justify-center  ${!isOwner ? 'bg-white/5' : 'bg-blue-500/20 ml-auto'}`}>
        <div className='flex gap-4 items-center'>
          <File className='w-10 h-10' />
          <div className='flex flex-col'>
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
      try {
        if (walletType === WalletTypeEnum.EOA) {
          const user = await PushAPI.initialize(signer, {
            env: CONSTANTS.ENV.PROD,
          });

          const encryption = await user.encryption.info()

          if (encryption?.decryptedPgpPrivateKey) {
            const pk = {
              account: user.account,
              decryptedPgpPrivateKey: encryption.decryptedPgpPrivateKey
            }
            localStorage.setItem(LOCAL_STORAGE_PUSH_KEY, JSON.stringify(pk))

            setChatUser(user)
            initStream(user)
          }
        } else if (walletType === WalletTypeEnum.EMBEDDED) {
          // const user = await PushAPI.initialize(signer, {
          //   env: CONSTANTS.ENV.PROD,
          // });

          // setChatUser(user)
          // initStream(user)
        }
      } catch (err) {
        console.log('initialize err: ', err)
        toast({
          status: 'error',
          description: `Something went wrong. :(`,
          duration: 3500
        })
      }
    }
  }

  const handleUserRequest = async (isAccept: boolean) => {
    setIsHandlingRequest(true)

    if (isAccept) {
      try {
        const acceptRequest = await chatUser.chat.accept(selectedUser?.address)
        console.log('accept request = ', acceptRequest)
        setIsRequestUser(false)
      } catch (err) {
        console.log('request accept error: ', err)
      }
    } else {
      try {
        const rejectRequest = await chatUser.chat.reject(selectedUser?.address)
        console.log('rejectRequest = ', rejectRequest)
        setIsRequestUser(false)
        setSelectedUser(null)
        setChatHistory([])
      } catch (err) {
        console.log('request reject error: ', err)
      }
    }

    setIsHandlingRequest(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
  }

  const renderChatHistory = () => {
    let lastDate: any = null;

    return chatHistory.map((msg: IChat) => {
      const messageDate = formatDate(new Date(msg.timestamp))
      const showDateSeparator = lastDate != messageDate;
      lastDate = messageDate;

      return <div key={msg.timestamp}>
        {showDateSeparator && <div className='w-full text-center my-5'>
          <span className='text-sm bg-white/10 py-1 px-2 rounded-xl'>{messageDate}</span>
        </div>}
        <div className={`flex items-start gap-3 group`}>
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
              <span className="text-xs text-white/40">{msg.fromAddress == selectedUser?.address ? shrinkAddress(extractAddress(msg.fromAddress)) : ""}</span>
              <span className={`text-xs text-white/40`}>{getHourAndMinute(msg.timestamp)}</span>
            </div>
            {
              renderChatBox(msg.chatId, msg.type, msg.fromAddress != selectedUser?.address, msg.content, msg.fromAddress, msg.reaction)
            }
          </div>
        </div>
      </div>
    })
  }

  const canAccessChat = () => {
    if (!selectedUser) {
      return false
    }

    if (isRequestUser) {
      return false
    }

    return true
  }

  /*
    useEffect(() => {
      if (walletType === WalletTypeEnum.EMBEDDED) {
        handleUnlock()
      }
    }, [handleUnlock, walletType])
  */

  return (
    <div className="p-2 h-full flex flex-col">
      {!chatUser?.uid && <div className='absolute top-[49px] right-0 bottom-0 left-0 inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-10'>
        <button className="py-1.5 px-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium text-sm" onClick={handleUnlock}>
          Unlock Profile
        </button>
      </div>}

      {isOverlay && <Overlay isOpen={isOverlay} onClose={() => setIsOverlay(false)} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}

      {/* Search */}
      {/* {chatUser?.uid && <button className='absolute top-8 right-2 hover:bg-white/10 p-2 rounded-lg' onClick={() => setIsOverlay(true)}>
        <Search className='w-4 h-4' />
      </button>} */}

      <div className={`border-b ${theme == "dark" ? "border-white/30" : "border-black/30"}  mx-4 flex items-center justify-between p-2`}>
        <div className='flex-1'>
          {
            selectedUser && <div className='flex items-center gap-4'>
              <img src={selectedUser?.profilePicture} className='rounded-full w-6 h-6' />
              <span className={`text-sm ${theme == "dark" ? "text-white/50" : "text-black/50"} `}>
                {selectedUser.name ? selectedUser.name + " | " + shrinkAddress(selectedUser.address) : shrinkAddress(selectedUser.address)}
              </span>
            </div>
          }
        </div>
        <button className='hover:bg-white/10 p-2 rounded-lg' onClick={() => setIsOverlay(true)}>
          <Search className='w-4 h-4' />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto ai-chat-scrollbar space-y-2" ref={chatScrollRef} >
        {
          loadingChatHistory ?
            <div className='flex items-center justify-center h-full'>
              <Spinner />
            </div>
            :
            (selectedUser && chatHistory.length > 0) ? <>
              <div ref={topRef}></div>
              {
                loadingPrevChat && <div className='w-full flex justify-center'>
                  <Spinner />
                </div>
              }
              {
                renderChatHistory()
              }
              {
                isRequestUser && <div className='w-full flex justify-center'>
                  <div className='w-[320px] rounded-lg p-3 bg-white/5'>
                    <span className='text-white/40 text-sm'>This wallet wants to chat with you! Please accept to continue or reject to decline.</span>
                    <div className='mt-2 flex gap-4 justify-center'>
                      {
                        isHandlingRequest ? <Spinner className='w-6 h-6' /> : <>
                          <button onClick={() => handleUserRequest(true)}>
                            <CheckCircle className='text-blue-500 w-6 h-6' />
                          </button>
                          <button onClick={() => handleUserRequest(false)}>
                            <XCircle className='text-white/40 w-6 h-6' />
                          </button>
                        </>
                      }
                    </div>
                  </div>
                </div>
              }
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
      {
        canAccessChat() && <div className="mt-2 flex items-center gap-2">
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors" ref={emojiBtnRef} onClick={() => setIsEmojiOpen(!isEmojiOpen)}>
            <Smile className="w-4 h-4" />
          </button>

          <div ref={emojiPickRef}
            className='!absolute bottom-[62px] left-[16px]'>
            <EmojiPicker open={isEmojiOpen}
              onEmojiClick={handleEmojiClick}
              theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 px-3 py-1.5 rounded-lg outline-none text-sm resize-none"
            rows={1}
          />

          <button className="p-1 text-sm hover:bg-white/10 rounded-lg transition-colors" ref={gifBtnRef} onClick={() => setIsGifOpen(!isGifOpen)}>
            Gif
          </button>

          {isGifOpen && <div ref={gifPickRef}
            className='!absolute bottom-[62px] right-[16px]'>
            <GifPicker
              tenorApiKey={"AIzaSyBxr4hrP59kdbQV4xJ-t2CSQX0Y6q4gcbA"}
              theme={theme === "dark" ? GifTheme.DARK : GifTheme.LIGHT}
              onGifClick={handleGifClick}
            />
          </div>}

          <label className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          {!sendingMessage ? <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-1.5 rounded-lg transition-colors ${newMessage.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
              }`}
          >
            <Send className="w-4 h-4" />
          </button> : <Spinner size={"sm"} />}
        </div>
      }
    </div>
  );
};