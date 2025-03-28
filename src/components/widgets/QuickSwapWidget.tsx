import React, {useState} from 'react';
import {Box, Flex} from '@chakra-ui/react';
import {TokenType} from "../../types/swap.type";
import {NULL_ADDRESS} from "../../constants";
import {SolanaSwapBox} from "../swap/components/SolanaSwapBox.tsx";
import {CrossChainSwapBox} from "../swap/components/CrossChainSwapBox.tsx";
import {SOLANA_CHAIN_ID} from "../../constants/solana.constants.ts";
import {SwapBox} from "../swap/components/SwapBox.tsx";

export const QuickSwapWidget: React.FC = () => {
    const [fromToken, setFromToken] = useState<TokenType | null>({
        symbol: 'ETH',
        name: 'Ethereum',
        address: NULL_ADDRESS,
        chainId: 1,
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    });
    const [toToken, setToToken] = useState<TokenType | null>({
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chainId: 1,
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    });
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');

    const handleSwitch = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const onFromTokenSelect = (token: TokenType) => {
        setFromToken(token)
    }

    const onToTokenSelect = (token: TokenType) => {
        setToToken(token)
    }

    return (
        <>
            <Flex h="full" direction={{base: "column", md: "row"}} maxH="90vh">
                {/* Right Side - Swap Interface */}
                <Box minW={["100%", "400px"]} p={1}>
                    <div
                        className="p-2.5 border border-white/5 relative z-50 w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-auto overflow-y-auto overflow-x-hidden custom-scrollbar-blue">
                        {fromToken?.chainId !== toToken?.chainId ? (
                            <CrossChainSwapBox
                                fromToken={fromToken}
                                toToken={toToken}
                                fromAmount={fromAmount}
                                toAmount={toAmount}
                                onFromTokenSelect={onFromTokenSelect}
                                onToTokenSelect={onToTokenSelect}
                                onFromAmountChange={setFromAmount}
                                onToAmountChange={setToAmount}
                                onSwitch={handleSwitch}
                            />
                        ) : (
                            fromToken?.chainId === SOLANA_CHAIN_ID ? (
                                <SolanaSwapBox
                                    fromToken={fromToken}
                                    toToken={toToken}
                                    fromAmount={fromAmount}
                                    toAmount={toAmount}
                                    onFromTokenSelect={onFromTokenSelect}
                                    onToTokenSelect={onToTokenSelect}
                                    onFromAmountChange={setFromAmount}
                                    onToAmountChange={setToAmount}
                                    onSwitch={handleSwitch}
                                />
                            ) : (
                                <SwapBox
                                    fromToken={fromToken}
                                    toToken={toToken}
                                    fromAmount={fromAmount}
                                    toAmount={toAmount}
                                    onFromTokenSelect={onFromTokenSelect}
                                    onToTokenSelect={onToTokenSelect}
                                    onFromAmountChange={setFromAmount}
                                    onToAmountChange={setToAmount}
                                    onSwitch={handleSwitch}
                                />
                            ))}
                    </div>
                </Box>
            </Flex>
        </>
    );
};