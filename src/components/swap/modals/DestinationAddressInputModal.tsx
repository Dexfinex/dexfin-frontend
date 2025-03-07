import {Alert, AlertIcon, Text} from '@chakra-ui/react';
import {ArrowLeft, History, Wallet} from 'lucide-react';
import {useContext, useState} from "react";
import {isValidAddress} from "../../../utils/common.util.ts";
import {type NETWORK} from "../../../config/networks.ts";
import ReactDOM from "react-dom";
import {Web3AuthContext} from "../../../providers/Web3AuthContext.tsx";
import {SOLANA_CHAIN_ID} from "../../../constants/solana.constants.ts";

interface ModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setAddress: (address: string) => void;
    address: string;
    destinationNetwork: NETWORK;
}

export const DestinationAddressInputModal = ({open, setOpen, destinationNetwork, address, setAddress}: ModalProps) => {
    const { address: evmAddress, solanaWalletInfo } = useContext(Web3AuthContext);
    const [currentModalView, setCurrentModalView] = useState<'main' | 'recent'>('main');
    const [addressError, setAddressError] = useState<string>('');
    const [addressInput, setAddressInput] = useState<string>(address);

    const handleAddressSubmit = () => {
        if (isValidAddress(addressInput, destinationNetwork.chainId)) {
            setAddress(addressInput);
            setAddressError('');
            setOpen(false);
            setAddressInput('');
            setCurrentModalView('main');
        } else {
            setAddressError(`Wallet address or domain name is invalid for selected destination chain ${destinationNetwork.name}`);
        }
    };

    const handleOnClickConnectedWallet = () => {
        if (destinationNetwork.chainId === SOLANA_CHAIN_ID && solanaWalletInfo) {
            setAddressInput(solanaWalletInfo.publicKey)
        } else if (evmAddress) {
            setAddressInput(evmAddress)
        }
    }

    return open && (ReactDOM.createPortal(
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[10000]">
                <div className="glass rounded-2xl w-full max-w-md border border-white/5 shadow-2xl">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {
                                    currentModalView === 'recent' ? (
                                        <>
                                            <button
                                                onClick={() => setCurrentModalView('main')}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors mr-4"
                                            >
                                                <ArrowLeft size={20}/>
                                            </button>
                                            <h3 className="text-xl font-semibold flex-1">Recent wallets</h3>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setOpen(false)}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors mr-4"
                                            >
                                                <ArrowLeft size={20}/>
                                            </button>
                                            <h3 className="text-xl font-semibold flex-1">Destination Address</h3>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-2xl text-gray-400 hover:text-white"
                        >
                            ×
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {
                            currentModalView === 'recent' ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-white">
                                    <div className="rounded-full p-6 mb-4">
                                        <History size={32}/>
                                    </div>
                                    <p className="text-lg">No recent wallets</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div className={`relative`}>
                                            <div
                                                className={`relative rounded-2xl ${addressError ? 'border-1 border-red-500' : ''}`}>
                                                <input
                                                    type="text"
                                                    value={addressInput}
                                                    onChange={(e) => setAddressInput(e.target.value)}
                                                    placeholder="Enter address or wallet domain"
                                                    className={`w-full bg-white/5 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-24 ${
                                                        addressError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                                                    } text-gray-900`}
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                                    <button
                                                        onClick={handleAddressSubmit}
                                                        className="font-medium text-gray-400"
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            </div>
                                            {addressError && (
                                                <Alert status="error" bg="red.900" color="white" borderRadius="md"
                                                       mt="4">
                                                    <AlertIcon/>
                                                    <Text fontSize="sm" width={'calc(100% - 2rem)'}>
                                                        {addressError}
                                                    </Text>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2 mt-6">
                                            <button
                                                onClick={handleOnClickConnectedWallet}
                                                className="w-full flex items-center justify-between p-4 hover:bg-white/10 rounded-2xl transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Wallet className="text-white" size={20}/>
                                                    <span className="font-medium">Connected wallets</span>
                                                </div>
                                                <span className="text-white">{(evmAddress && solanaWalletInfo) ? 2 : 1}</span>
                                            </button>
                                        </div>

                                        <div className="space-y-2 mt-6">
                                            <button
                                                onClick={() => setCurrentModalView('recent')}
                                                className="w-full flex items-center justify-between p-4 hover:bg-white/10 rounded-2xl transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <History className="text-white" size={20}/>
                                                    <span className="font-medium">Recent wallets</span>
                                                </div>
                                            </button>
                                        </div>

                                        {/*
                                    {filteredSavedAddresses.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {filteredSavedAddresses.map((saved) => (
                                                <div
                                                    key={saved.address}
                                                    onClick={() => handleAddressSelect(saved.address)}
                                                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img src={destChain.icon} alt={destChain.name}
                                                             className="w-6 h-6"/>
                                                        <div>
                                                            <p className="font-medium">{saved.label}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {saved.address.slice(0, 6)}...{saved.address.slice(-4)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {saved.isBookmarked && (
                                                        <Star size={16} className="text-yellow-500"/>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
*/}
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}