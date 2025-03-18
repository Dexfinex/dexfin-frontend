import React, { useContext, useMemo, useState } from "react";
import { Search, ChevronDown } from 'lucide-react';
import { mapChainId2ChainName } from "../../config/networks";
import { TokenIcon } from "../swap/components/TokenIcon";
import { getChainIcon } from "../../utils/defi.util";
import { Web3AuthContext } from "../../providers/Web3AuthContext";

interface SelectChainProps {
    chainList: number[],
    selectedChain: number,
    setSelectedChain: (selectedChain: number) => void,
}

const SelectChain: React.FC<SelectChainProps> = ({ chainList, selectedChain, setSelectedChain }) => {
    const { chainId, switchChain } = useContext(Web3AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [showChainSelector, setShowChainSelector] = useState(false);

    const chainInfoList = useMemo(() => {
        return chainList.map((chainId) => {
            const chainName = mapChainId2ChainName[chainId];
            return {
                name: chainName,
                id: chainId,
                icon: <TokenIcon src={getChainIcon(chainId) || ""} alt={chainName} size="sm" />
            }
        })
    }, [chainList]);

    const selectedChainInfo = useMemo(() => {
        const chainName = mapChainId2ChainName[selectedChain];
        return {
            name: chainName,
            id: selectedChain,
            icon: <TokenIcon src={getChainIcon(selectedChain) || ""} alt={chainName} size="sm" />
        }
    }, [selectedChain])

    return (
        <div>
            <label className="block text-sm text-white/60 mb-2">Select Chain</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowChainSelector(!showChainSelector)}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {selectedChainInfo.icon}
                    <div className="flex-1 text-left">
                        <div className="font-medium">
                            {selectedChainInfo.name}
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                </button>

                {
                    showChainSelector && <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowChainSelector(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                                <Search className="w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search networks..."
                                    className="bg-transparent outline-none flex-1 text-sm"
                                />
                            </div>

                            <div className="max-h-48 overflow-y-auto">
                                {chainInfoList.map((chain) => (
                                    <button
                                        key={chain.name}
                                        type="button"
                                        onClick={async () => {
                                            setSelectedChain(chain.id)
                                            setShowChainSelector(false);
                                            setSearchQuery("");
                                            if (Number(chainId) !== Number(chain.id)) {
                                                await switchChain(Number(chain.id));
                                            }
                                        }}
                                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        {chain.icon}
                                        <div className="flex-1 text-left">
                                            <div className="font-medium">
                                                {chain.name}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default SelectChain;