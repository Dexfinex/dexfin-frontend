import React, { useState, useEffect, useContext } from 'react';
import { X, File, Camera, Eye, Lock, Plus, Search, Edit } from 'lucide-react';

interface ChatHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChatHelpModal: React.FC<ChatHelpModalProps> = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-[520px] glass border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Help</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className='p-8'>
                    <p className='text-xl text-white/90 font-bold mb-4'>Dexfin Chat is a decentralized messaging platform that allows users to communicate securely using their Ethereum addresses.</p>

                    <p className='mt-2 text-white/80'>1. Searching for Users
                        To start a chat, enter the Ethereum address of the person you want to message in the search bar.
                        If they are already using Dexfin Chat, their profile will appear.</p>
                    <p className='mt-2 text-white/80'>2. Sending a Chat Request
                        Before starting a conversation, the other user must accept your chat request.
                        This prevents spam and ensures secure communication.</p>
                    <p className='mt-2 text-white/80'>3. Receiving and Accepting Requests
                        If someone messages you first, you will see a chat request notification.
                        You must approve the request before the conversation can begin.</p>
                    <p className='mt-2 text-white/80'>4. Managing Conversations
                        Once the request is accepted, you can send and receive messages in real-time.
                        Chats are decentralized and secure, ensuring privacy.</p>
                    <p className='mt-2 text-white/80'>5. Using Group Chats
                        You can also join or create group chats with multiple Ethereum users.</p>
                </div>
            </div>

        </div >
    )
}