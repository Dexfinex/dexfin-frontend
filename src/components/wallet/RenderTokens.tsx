import React from "react";
import { Skeleton } from '@chakra-ui/react';

import { formatNumberByFrac } from "../../utils/common.util";
import { formatUsdValue, } from '../../lib/wallet';
import { TokenChainIcon } from "../swap/components/TokenIcon";
import PNLPercent from "../common/PNLPercent";
import { useWalletBalance } from "../../hooks/useBalance";
import useTokenBalanceStore, { TokenBalance } from "../../store/useTokenBalanceStore";


interface RenderTokensProps {
    handleAsset: (token: TokenBalance) => void;
}

const RenderTokens: React.FC<RenderTokensProps> = ({ handleAsset }) => {
    const { isLoading: isLoadingBalance } = useWalletBalance();
    const { tokenBalances } = useTokenBalanceStore();

    return (
        <div className="flex-1 space-y-2 mt-4 sm:mt-5 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-360px)] max-h-[calc(100vh-296px)] mx-4">
            {
                isLoadingBalance ?
                    <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'4rem'}></Skeleton>
                    : tokenBalances.map((token, index) => (
                        <button
                            key={token.chain + token.symbol + index}
                            className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => handleAsset(token)}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <TokenChainIcon src={token.logo} alt={token.name} size={"lg"} chainId={Number(token.chain)} />
                                    <div className='flex flex-col justify-start items-start'>
                                        <div className="font-medium text-sm sm:text-md">{token.symbol.toUpperCase()}</div>
                                        <div className="text-xs sm:text-sm text-white/60">
                                            {`${formatNumberByFrac(token.balance, 5)} ${token.symbol.toUpperCase()}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm md:text-md">
                                    <span>{formatUsdValue(token.usdValue)}</span>
                                    <PNLPercent pnlPercent={token.usdPrice24hrUsdChange * 100 / (token.usdPrice - token.usdPrice24hrUsdChange)} />
                                </div>
                            </div>
                        </button>
                    ))
            }
        </div>
    )
}

export default RenderTokens;