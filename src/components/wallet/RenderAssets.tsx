import React, {useContext} from 'react';
import {Skeleton} from '@chakra-ui/react';
import {ArrowDown, CreditCard, Send, TrendingUp} from 'lucide-react';
import {formatUsdValue} from "../../utils/defi.util.ts";
import {formatNumberByFrac} from '../../utils/common.util.ts';
import {Web3AuthContext} from "../../providers/Web3AuthContext.tsx";
import {TokenChainIcon} from '../swap/components/TokenIcon.tsx';
import useTokenBalanceStore from '../../store/useTokenBalanceStore.ts';
import {useWalletBalance} from '../../hooks/useBalance.tsx';

interface RenderAssetsProps {
    setShowSendDrawer: (showSendDrawer: boolean) => void;
    setShowReceiveDrawer: (showReceiveDrawer: boolean) => void;
    setShowBuyDrawer: (showBuyDrawer: boolean) => void;
    setSelectedBalanceIndex: (selectedBalanceIndex: number) => void;
}

const RenderAssets: React.FC<RenderAssetsProps> = ({
                                                       setShowSendDrawer,
                                                       setShowReceiveDrawer,
                                                       setShowBuyDrawer,
                                                       setSelectedBalanceIndex
                                                   }) => {

    const {isLoading: isLoadingBalance} = useWalletBalance();
    const {totalUsdValue, tokenBalances} = useTokenBalanceStore();

    const {chainId, switchChain} = useContext(Web3AuthContext);

    return (
        <div className="space-y-4">
            {/* Total Balance */}
            <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm text-white/60">Total Balance</div>
                <div className="text-3xl font-bold mt-1">
                    {
                        isLoadingBalance ? <Skeleton startColor="#444" endColor="#1d2837" w={'5rem'}
                                                     h={'2rem'}></Skeleton> : formatUsdValue(totalUsdValue)
                    }
                </div>
                <div className="flex items-center gap-1 mt-1 text-green-400">
                    <TrendingUp className="w-4 h-4"/>
                    <span>+1.57% TODAY</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
                <button
                    disabled={tokenBalances.length === 0}
                    onClick={() => setShowSendDrawer(true)}
                    className={`flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors ${tokenBalances.length === 0 ? "opacity-[0.6] disabled:pointer-events-none disabled:cursor-default" : ""}`}
                >
                    <Send className="w-5 h-5"/>
                    <span>Send</span>
                </button>
                <button
                    onClick={() => setShowReceiveDrawer(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                >
                    <ArrowDown className="w-5 h-5"/>
                    <span>Receive</span>
                </button>
                <button
                    disabled={true}
                    onClick={() => setShowBuyDrawer(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors opacity-[0.7]"
                >
                    <CreditCard className="w-5 h-5"/>
                    <span>Buy</span>
                </button>
            </div>

            {/* Assets List */}
            <div className="space-y-2">
                {
                    isLoadingBalance ?
                        <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'4rem'}></Skeleton>
                        : tokenBalances.map((position, index) => (
                            <button
                                key={position.chain + position.symbol}
                                className="flex w-full items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                onClick={async () => {
                                    if (Number(chainId) !== Number(position.chain)) {
                                        await switchChain(Number(position.chain));
                                    }
                                    setSelectedBalanceIndex(index);
                                    setShowSendDrawer(true);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <TokenChainIcon src={position.logo} alt={position.name} size={"lg"}
                                                    chainId={Number(position.chain)}/>
                                    <div className='flex flex-col justify-start items-start'>
                                        <div className="font-medium">{position.symbol}</div>
                                        <div className="text-sm text-white/60">
                                            {`${formatNumberByFrac(position.balance)} ${position.symbol}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div>{formatUsdValue(position.usdValue)}</div>
                                </div>
                            </button>
                        ))
                }
            </div>
        </div>
    )
};

export default RenderAssets;