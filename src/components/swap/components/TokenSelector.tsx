import {useState} from 'react';
import {ChevronDown, Search} from 'lucide-react';
import {TokenType} from "../../../types/swap.type";
import {TokenSelectorModal} from "./TokenSelectorModal.tsx";
import {Skeleton} from "@chakra-ui/react";
import {formatNumberByFrac} from "../../../utils/common.util.ts";

interface TokenSelectorProps {
    selectedToken?: TokenType | null;
    selectedChainId?: number | null;
    onSelect: (token: TokenType) => void;
    amount: string;
    usdAmount: string;
    onAmountChange: (amount: string) => void;
    label: string;
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
    balance?: string;
    isBalanceLoading?: boolean;
}

export function TokenSelector({
                                  selectedToken,
                                  selectedChainId,
                                  onSelect,
                                  amount,
                                  usdAmount,
                                  onAmountChange,
                                  label,
                                  disabled = false,
                                  className = '',
                                  isLoading = false,
                                  balance,
                                  isBalanceLoading = false,
                              }: TokenSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={`rounded-xl p-4 w-full border border-white/5 hover:border-blue-500/20 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)] ${className}`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <label
                            className="text-blue-400/90 text-[10px] font-semibold tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">{label}</label>
                        {selectedToken?.price && (
                            <span
                                className="text-[10px] text-blue-400/90 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                ≈ ${(Number(amount || '0') * (selectedToken.price || 0)).toFixed(2)}
              </span>
                        )}
                    </div>
                    {
                        isBalanceLoading ? (
                            <div className="flex justify-end items-center">
                                <Skeleton
                                    className=""
                                    startColor="#444"
                                    endColor="#1d2837"
                                    w={'3rem'}
                                    h={'1rem'}
                                />
                            </div>
                        ) : (
                            <span className="text-gray-400 text-[10px] font-medium tracking-wide flex items-center gap-2">
                                Balance: {balance ? formatNumberByFrac(Number(balance), 7) : '0'} {selectedToken?.symbol}
                                {(Number(balance) > 0) && !disabled && (
                                    <button
                                        className="text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-md hover:bg-blue-500/20 transition-all hover:scale-105 active:scale-95"
                                        onClick={() => {
                                            onAmountChange(balance!)
                                        }}
                                    >
                                        MAX
                                    </button>
                                )}
                      </span>

                        )
                    }
                </div>
                <div className="flex items-center gap-3 mt-2 group/input">
                    <div
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all cursor-pointer w-[140px] shrink-0 group ring-1 ring-white/10 hover:ring-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover-effect glass-effect relative overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 group-hover:translate-x-full duration-1000 transition-transform ease-in-out"/>
                        {selectedToken ? (
                            <>
                                <img
                                    src={selectedToken.logoURI}
                                    alt={selectedToken.symbol}
                                    className="w-7 h-7 rounded-full ring-1 ring-white/10 group-hover:ring-primary-500/20 transition-all duration-300 group-hover:scale-110"
                                />
                                <div className="flex flex-col">
                                    <span
                                        className="font-semibold text-white tracking-wide text-sm whitespace-nowrap text-ellipsis overflow-hidden w-[60px]">{selectedToken.symbol}</span>
                                    <span
                                        className="text-xs text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden w-[80px]">{selectedToken.name}</span>
                                </div>
                                <ChevronDown
                                    className="w-4 h-4 text-gray-400 absolute right-2 top-2 group-hover:text-primary-400 transition-all duration-300"/>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-gray-400"/>
                                </div>
                                <span className="text-gray-300 font-medium">Select Token</span>
                                <ChevronDown
                                    className="w-4 h-4 text-gray-400 absolute right-2 top-2 group-hover:text-primary-400 transition-all duration-300"/>
                            </div>
                        )}
                    </div>
                    {
                        isLoading ? (
                            <div className="flex justify-end w-full items-center">
                                <Skeleton
                                    className=""
                                    startColor="#444"
                                    endColor="#1d2837"
                                    w={'3rem'}
                                    h={'3rem'}
                                />
                            </div>
                        ) : (
                            <input
                                type="number"
                                value={disabled ? formatNumberByFrac(Number(amount), 7) : amount}
                                min="0"
                                step="any"
                                onChange={(e) => onAmountChange(e.target.value)}
                                disabled={disabled}
                                placeholder="0"
                                className={`w-0 flex-1 bg-transparent text-white text-right text-2xl font-medium outline-none placeholder-gray-500 focus:placeholder-primary-400/50 transition-all group-focus-within/input:placeholder-primary-400/30 ${
                                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            />
                        )
                    }
                </div>
                <div className="flex justify-end items-center mt-2">
                    {selectedToken && (
                        isLoading ? (
                            <div className="flex justify-end w-full items-center">
                                <Skeleton
                                    className=""
                                    startColor="#444"
                                    endColor="#1d2837"
                                    w={'3rem'}
                                    h={'1rem'}
                                />
                            </div>
                        ) : (
                            <span className={`text-xs px-2 py-0.5 rounded-full text-gray-400`}>
                                    ${formatNumberByFrac(Number(usdAmount), 2)}
                                </span>
                        )
                    )}
                </div>
            </div>
            {isOpen && (
                <TokenSelectorModal
                    isOpen={isOpen}
                    selectedToken={selectedToken}
                    selectedChainId={selectedChainId}
                    onSelect={onSelect}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}