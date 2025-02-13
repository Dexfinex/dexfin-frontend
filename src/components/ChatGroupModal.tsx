import React, { useState, useEffect, useContext } from 'react';
import { Web3AuthContext } from '../providers/Web3AuthContext';
import { X, File, Camera, Eye, Lock, Plus, Search, Edit } from 'lucide-react';
import { Badge, Button, Spinner } from '@chakra-ui/react';
import { IGroup, IMember } from '../types/chat.type';
import { Clipboard } from './common/Clipboard';
import { extractAddress, shrinkAddress } from '../utils/common.util';
import { useStore } from '../store/useStore';
import { getWalletProfile } from '../utils/chatApi';

interface ChatGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: IGroup | null;
    updateOneGroup: (group: IGroup) => void;
}

interface AddWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    addPendings: (members: IMember[]) => void;
    groupId: string;
}

type SubMemberType = {
    address: string,
    image: string
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ isOpen, onClose, groupId, addPendings }) => {
    const [members, setMembers] = useState<Array<string>>([]);
    const [subMembers, setSumbMembers] = useState<Array<SubMemberType>>([]);
    const [isSearch, setIsSearch] = useState(false);
    const [searchAddress, setSearchAddress] = useState("");
    const [creating, setCreating] = useState(false);
    const { chatUser } = useStore();
    const { address } = useContext(Web3AuthContext);

    useEffect(() => {
        setMembers([])
        setSumbMembers([])
        setSearchAddress("")
    }, [isOpen])

    const handleAddMembers = async () => {
        setCreating(true)
        // await createGroup()
        if (groupId) {
            console.log('added members = ', members)
            try {
                const added = await chatUser.chat.group.add(groupId, {
                    role: 'MEMBER', // 'ADMIN' or 'MEMBER'
                    accounts: members
                })

                console.log('added ', added)
                addPendings(added.pendingMembers)
                onClose()
            } catch (err) {
                console.log('add peding members err: ', err)
            }
        }
        setCreating(false)
    }

    const handleSearch = async () => {
        if (!searchAddress) return
        setIsSearch(true)
        if (address != searchAddress && !subMembers.find(member => member.address === searchAddress)) {
            const profile = await getWalletProfile(chatUser, searchAddress)
            if (profile) {
                setSumbMembers([...subMembers, { address: searchAddress, image: profile.picture }])
            }
        }

        setIsSearch(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSearch()
        }
    }

    const addMember = (one: string) => {
        setMembers([...members, one])
    }

    const removeMember = (one: string) => {
        setMembers(members.filter(item => item !== one))
    }

    if (!isOpen) return null

    return (

        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-[520px] glass border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Group Info</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className='w-full p-4 text-center'>
                    <div className='w-full flex justify-between'>
                        <label className='text-gray-400'>Add Wallets</label>
                    </div>
                    <div className='flex mt-3 items-center justify-center gap-4'>
                        <input
                            type="text"
                            value={searchAddress}
                            onChange={(e) => setSearchAddress(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            placeholder="Search Web3 domain or 0x123..."
                            className={`w-full bg-white/5 px-4 py-2 rounded-lg outline-none placeholder:text-white/40`}
                        />
                        {
                            isSearch ? <Spinner className='w-4 h-4' /> :
                                <button onClick={handleSearch}>
                                    <Search className='w-4 h-4' />
                                </button>
                        }
                    </div>
                    {
                        subMembers.map((e, i) =>
                            <div key={i} className='flex items-center justify-between mt-1 bg-gray-800 px-4 py-3 rounded-lg outline-none'>
                                <div className='flex items-center'>
                                    {/* <User className='mr-3' /> */}
                                    <img src={e.image} className='w-6 h-6 mr-3 rounded-full' />
                                    <span>{shrinkAddress(e.address)}</span>
                                </div>
                                {
                                    !members.includes(e.address) ? <button onClick={() => addMember(e.address)}>Add</button> : <button onClick={() => removeMember(e.address)}>Remove</button>
                                }
                            </div>)
                    }

                    {
                        creating ? <Spinner className='mt-4' /> :
                            <Button className='mt-4' variant={'solid'} colorScheme='teal' onClick={handleAddMembers}>Create Group</Button>
                    }
                </div>
            </div>
        </div>
    )
}

export const ChatGroupModal: React.FC<ChatGroupModalProps> = ({ isOpen, onClose, group, updateOneGroup }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const { address } = useContext(Web3AuthContext);
    const [addWalletActive, setAddWalletActive] = useState(false);
    const [isHanding, setIsHandling] = useState(false);
    const { chatUser } = useStore();

    useEffect(() => {
        if (group?.members && group?.members.length > 0) {
            const member: any = group.members.find((member: IMember) => extractAddress(member.wallet) == address)
            console.log('member = ', member)
            if (member) {
                setIsAdmin(member.isAdmin)
            } else {
                setIsAdmin(false)
            }
        }
    }, [group])

    const handleAddWallets = () => {
        setAddWalletActive(true)
    }

    const handleMakeAdmin = async (address: string) => {
        setIsHandling(true)
        console.log('make admin = ', address)
        try {
            const makeAdmins = await chatUser.chat.group.modify(group?.groupId, {
                role: 'ADMIN', // Specify the new role here: "ADMIN" or "MEMBER"
                accounts: [extractAddress(address)], // Array of wallet addresses for the members whose roles are being changed
            })

            console.log('make Admins = ', makeAdmins)

            const newGroup: IGroup = {
                ...group,
                members: group?.members ? group?.members.map(member => member.wallet == address ? {...member, isAdmin: true} : member) : []
            } as IGroup

            updateOneGroup(newGroup)
        } catch (err) {
            console.log('make member admin err: err')
        }

        setIsHandling(false)
    }

    const handleRemoveMember = async (address: string) => {
        console.log('remove member = ', address)
        setIsHandling(true)
        try {
            const removed = await chatUser.chat.group.remove(group?.groupId, {
                accounts: [extractAddress(address)],
            });
            console.log('removed = ', removed)

            const newGroup: IGroup = {
                ...group,
                members: group?.members ? group?.members.filter(member => member.wallet != address) : []
            } as IGroup

            updateOneGroup(newGroup)
        } catch (err) {
            console.log('remove member err: ', err)
        }
        setIsHandling(false)
    }

    const addPendings = (pendings: IMember[]) => {
        const newGroup: IGroup = {
            ...group,
            pendingMembers: pendings
        } as IGroup

        updateOneGroup(newGroup)
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-[520px] glass border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-semibold">Group Info</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {group && <div className='px-8 pt-8 pb-4 flex justify-center flex-col items-center'>
                    <div className='flex items-center justify-start gap-4 w-full'>
                        <img src={group.image} className='w-16 rounded-xl' />
                        <span className='text-lg text-white/80'>{group.name}</span>
                    </div>
                    <div className='w-full flex items-end justify-start gap-2 mt-4'>
                        <span className='text-xl'>Chat Id: </span> <Clipboard address={group.groupId} ensName='' />
                    </div>
                    <div className='w-full flex items-center mt-4 p-2 rounded-lg bg-white/10 gap-4'>
                        {
                            group.public ? <>
                                <Eye className='w-8 h-8' />
                                <div className='flex flex-col'>
                                    <span className='text-xl'>Open</span>
                                    <span className='text-sm text-white/50'>Chats are not encrypted</span>
                                </div>
                            </>
                                : <>
                                    <Lock className='w-8 h-8' />
                                    <div className='flex flex-col'>
                                        <span className='text-xl'>Encrypted</span>
                                        <span className='text-sm text-white/50'>Chats are end-to-end encrypted</span>
                                    </div>
                                </>
                        }
                    </div>
                    {isAdmin && <div className='w-full mt-4'>
                        <Button className='w-full' onClick={handleAddWallets}>
                            Add more wallets
                            <Plus className='w-4 h-4' />
                        </Button>
                    </div>}

                    <div className='w-full mt-4 overflow-y-auto ai-chat-scrollbar max-h-[200px]'>
                        {group.pendingMembers.length > 0 && <>
                            <p className='text-white/80'>Pending Members</p>
                            {
                                group.pendingMembers.map(member => <div key={member.wallet} className='border-b border-white/20 p-2 flex items-center gap-4 justify-between'>
                                    <div className='flex items-center gap-4'>
                                        <img src={member.image} className='w-10 h-10 rounded-full' />
                                        <span className='text-white/80'>{shrinkAddress(extractAddress(member.wallet))}</span>
                                    </div>
                                    <span></span>
                                </div>)
                            }
                        </>}
                    </div>

                    <div className='w-full mt-4 overflow-y-auto ai-chat-scrollbar max-h-[320px]'>
                        <p className='text-white/80'>Members</p>
                        {
                            group.members.length > 0 && group.members.map(member => <div key={member.wallet} className='border-b border-white/20 p-2 flex items-center gap-4 justify-between'>
                                <div className='flex items-center gap-4'>
                                    <img src={member.image} className='w-10 h-10 rounded-full' />
                                    <span className='text-white/80'>{shrinkAddress(extractAddress(member.wallet))}</span>
                                </div>
                                {
                                    member.isAdmin ? <Badge colorScheme='red' className='p-2'>Admin</Badge> :
                                        isAdmin ? !isHanding ? <div>
                                            <Button colorScheme='blue' variant='ghost' size={'xs'} onClick={() => handleMakeAdmin(member.wallet)}>
                                                Make Admin
                                            </Button>
                                            <Button colorScheme='red' variant='ghost' size={'xs'} onClick={() => handleRemoveMember(member.wallet)}>
                                                Remove
                                            </Button>
                                        </div> : <Spinner />
                                            : <span></span>
                                }
                            </div>)
                        }
                    </div>
                </div>}
            </div>

            <AddWalletModal
                isOpen={addWalletActive}
                onClose={() => setAddWalletActive(false)}
                groupId={group?.groupId || ""}
                addPendings={addPendings}
            />
        </div >
    )
}