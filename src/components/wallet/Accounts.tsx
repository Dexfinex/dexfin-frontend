import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, } from '@chakra-ui/react';
import { CheckCircle, Copy } from "lucide-react";

import { useStore } from "../../store/useStore";
import { shrinkAddress } from "../../utils/common.util";
import {mapChainId2Network} from "../../config/networks.ts";
import {SOLANA_CHAIN_ID} from "../../constants/solana.constants.ts";

const Accounts: React.FC<{ evmAddress: string, solAddress: string }> = ({ evmAddress, solAddress }) => {
    const [evmCopied, setEvmCopied] = useState(false);
    const [solCopied, setSolCopied] = useState(false);
    const { theme } = useStore();

    const handleEvmCopy = () => {
        navigator.clipboard.writeText(evmAddress);
        setEvmCopied(true);
        setTimeout(() => setEvmCopied(false), 1000);
    }

    const handleSolCopy = () => {
        navigator.clipboard.writeText(solAddress);
        setSolCopied(true);
        setTimeout(() => setSolCopied(false), 1000);
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="flex items-center text-white/90 hover:text-white/70 gap-1 cursor-pointer">
                    <span>Account</span>
                    <Copy className="w-3 h-3" />
                </div>
            </PopoverTrigger>
            <PopoverContent className={`!w-[244px] !border-1 !border-transparent ${theme === "dark" ? "!bg-black" : "!bg-white"} !p-2`}>
                <div className="flex items-center justify-between p-1 text-white/90 hover:text-white/70 cursor-pointer" onClick={handleEvmCopy}>
                    <span className="flex items-center gap-1">
                        <img src="https://cdn.moralis.io/eth/0x.png" className="w-4 h-4 mr-1" />
                        <span>Ethereum</span>
                    </span>
                    {evmCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(evmAddress)}</span>}
                </div>
                {solAddress && <div className="flex items-center justify-between p-1 text-white/90 hover:text-white/70 cursor-pointer" onClick={handleSolCopy}>
                    <span className="flex items-center gap-1">
                        <img src={mapChainId2Network[SOLANA_CHAIN_ID].icon} className="w-4 h-4 mr-1" />
                        <span>Solana</span>
                    </span>
                    {solCopied ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span>{shrinkAddress(solAddress)}</span>}
                </div>}
            </PopoverContent>
        </Popover>
    )
}

export default Accounts;