import React, { useContext, useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { useInView } from "react-intersection-observer";
import { useStore } from '../store/useStore';
import { IGroup, IUser, IChat, ChatModeType, ChatType, ReactionType } from '../types/chat.type';
import { MessageSquare, Smile, File, Download, CheckCircle, XCircle } from 'lucide-react';
import { Spinner, Popover, PopoverTrigger, PopoverContent, Box, Divider, AbsoluteCenter } from '@chakra-ui/react';
import { downloadBase64File, shrinkAddress, getChatHistoryDate, extractAddress, getHourAndMinute } from '../utils/common.util';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import { LIMIT, BIG_IMAGE_WIDHT } from '../utils/chatApi';
import { ImageWithSkeleton } from './common/ImageWithSkeleton';

interface ChatMessagesProps {
    selectedGroup: IGroup | null;
    selectedUser: IUser | null;
    chatHistory: Array<IChat>;
    reactions: ReactionType[];
    chatMode: ChatModeType;
    handleUserRequest: (isAccept: boolean) => Promise<void>;
    handleGroupRequest: (isAccept: boolean) => Promise<void>;
    handleJoinGroup: () => void;
    isHandlingRequest: boolean;
    isJoiningGroup: boolean;
    loadingChatHistory: boolean;
    toBottom: boolean;
    setToBottom: (is: boolean) => void;
    setChatHistory: (history: IChat[]) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
    selectedGroup, selectedUser, chatHistory, chatMode, isHandlingRequest, isJoiningGroup, loadingChatHistory,
    handleUserRequest, handleGroupRequest, handleJoinGroup, setChatHistory, toBottom, setToBottom, reactions
}) => {
    const { ref: topRef, inView: topInView } = useInView(); // Detect top scroll

    const { address } = useContext(Web3AuthContext);
    const chatScrollRef = useRef<HTMLDivElement>(null);
    const { chatUser } = useStore();

    const [loadingPrevChat, setLoadingPrevChat] = useState(false);
    const [firstLoadTop, setFirstLoadTop] = useState(true);

    // Fetch older messages when user scrolls to the top
    useEffect(() => {
        if (firstLoadTop) {
            setFirstLoadTop(false);
            return; // 🚀 Prevent fetching old messages on first render
        }

        if (topInView) {
            console.log('fetch old messages in topInView')
            if (selectedUser && chatHistory.length > 0 && chatHistory[0].link) {
                getPrevChatHistory(selectedUser.address, chatHistory[0].chatId)
            } else if ((selectedGroup && chatHistory.length > 0 && chatHistory[0].link)) {
                getPrevChatHistory(selectedGroup.groupId, chatHistory[0].chatId)
            }
        }
    }, [topInView])

    const scrollBottom = useCallback(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight })
        }
    }, [])

    useLayoutEffect(() => {
        console.log('chat history = ', chatHistory)
        if (toBottom) {
            scrollBottom()
            setToBottom(false)
        }
    }, [chatHistory, toBottom, scrollBottom])

    const getPrevChatHistory = async (address: string, chatId: string) => {
        setLoadingPrevChat(true)
        try {

            const prevHistory = await chatUser.chat.history(address, { reference: chatId, limit: LIMIT })
            console.log('prev history = ', prevHistory)

            if (prevHistory.length > 0) {
                let chats: IChat[] = []
                let prevReactions: ReactionType[] = []

                prevHistory.forEach((data: any) => {
                    if (data.messageType == "Reaction") {
                        prevReactions = [...prevReactions, data.messageObj]
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

                const totalReactions: ReactionType[] = [...reactions, ...prevReactions]
                if (totalReactions.length > 0) {
                    chats = chats.map(chat => {
                        const found = totalReactions.find(e => e.reference == chat.chatId)
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
        } catch (err) {
            console.log('get prev chat err: ', err)
        }

        setLoadingPrevChat(false)
    }

    const handleReaction = async (chatId: string, content: string) => {
        console.log('reference: ', chatId)
        console.log('address: ', address)
        console.log('content: ', content)

        const receipient = selectedGroup ? selectedGroup.groupId : selectedUser ? selectedUser.address : ""

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

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
    }

    const renderChatHistory = () => {
        let lastDate: any = null;

        if (chatMode === "p2p") {
            return chatHistory.map((msg: IChat) => {
                const messageDate = formatDate(new Date(msg.timestamp))
                const showDateSeparator = lastDate != messageDate;
                lastDate = messageDate;

                return <div key={msg.timestamp}>
                    {showDateSeparator && <div className='w-full text-center my-5'>
                        <span className='text-sm bg-white/10 py-2 px-4 rounded-xl'>{messageDate}</span>
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
                                <span className="text-sm text-white/40">{msg.fromAddress == selectedUser?.address ? shrinkAddress(extractAddress(msg.fromAddress)) : ""}</span>
                                <span className={`text-sm text-white/40`}>{getHourAndMinute(msg.timestamp)}</span>
                            </div>
                            {
                                renderChatBox(msg.chatId, msg.type, msg.fromAddress != selectedUser?.address, msg.content, msg.fromAddress, msg.reaction)
                            }
                        </div>
                    </div>
                </div>
            })
        } else if (chatMode === "group") {
            return chatHistory.map((msg) => {
                const messageDate = formatDate(new Date(msg.timestamp))
                const showDateSeparator = lastDate != messageDate;
                lastDate = messageDate;

                return <div key={msg.timestamp}>
                    {showDateSeparator && <div className='w-full text-center my-5'>
                        <span className='text-sm bg-white/10 py-2 px-4 rounded-xl'>{messageDate}</span>
                    </div>}
                    <div className={`flex items-start gap-3 group`}>
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
                                <span className="text-sm text-white/40">{msg.fromAddress != address ? shrinkAddress(extractAddress(msg.fromAddress)) : ""}</span>
                                <span className={`text-sm text-white/40`}>{getHourAndMinute(msg.timestamp)}</span>
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
                </div>
            })
        }
    }

    const isUserRequest = useMemo(() => selectedUser?.type === "Request", [selectedUser])
    const isGroupRequest = useMemo(() => selectedGroup?.type === "Request", [selectedGroup])
    const isGroupSearch = useMemo(() => selectedGroup?.type === "Searched", [selectedGroup])

    const renderRequestButtons = () => {
        if (isUserRequest) {
            return <div className='w-full flex justify-center'>
                <div className='w-[320px] rounded-lg p-3 bg-white/5'>
                    <span className='text-white/40'>This wallet wants to chat with you! Please accept to continue or reject to decline.</span>
                    <div className='mt-2 flex gap-4 justify-center'>
                        {
                            isHandlingRequest ? <Spinner className='w-10 h-10' /> : <>
                                <button onClick={() => handleUserRequest(true)}>
                                    <CheckCircle className='text-blue-500 w-10 h-10' />
                                </button>
                                <button onClick={() => handleUserRequest(false)}>
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
                                <button onClick={() => handleGroupRequest(true)}>
                                    <CheckCircle className='text-blue-500 w-10 h-10' />
                                </button>
                                <button onClick={() => handleGroupRequest(false)}>
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
                <div className={`relative rounded-lg p-3 max-w-[360px] md:max-w-[480px] inline-block ${!isOwner ? 'bg-white/5' : 'bg-blue-500/20 ml-auto'}`}>
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
                    <div ref={topRef} className="loading"></div>
                    {
                        loadingPrevChat && <div className='w-full flex justify-center'>
                            <Spinner />
                        </div>
                    }
                    {
                        renderChatHistory()
                    }
                    {
                        renderRequestButtons()
                    }
                </div>
            )
        } else {
            return (
                renderRequestButtons() ||
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

    return (
        <div ref={chatScrollRef} className="flex-1 p-2 sm:p-4 overflow-x-hidden overflow-y-auto ai-chat-scrollbar">
            {renderMessages()}
        </div>
    )
}