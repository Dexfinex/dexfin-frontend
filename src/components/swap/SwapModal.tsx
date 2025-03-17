import React, {useEffect, useState} from 'react';
import {Box, Flex, HStack, Modal, ModalContent, ModalOverlay, Text, useBreakpointValue,} from '@chakra-ui/react';
import {Maximize2, X} from 'lucide-react';
import {SellBox} from "./components/SellBox";
import {BuyBox} from "./components/BuyBox";
import {SwapBox} from "./components/SwapBox";
import {ChartType, SlippageOption, TokenType, TransactionType} from "../../types/swap.type";
import {SlippageSettings} from "./SlippageSettings";
import {Chart} from "./components/chart/Chart.tsx";
import {ConfirmSwapModal} from "./modals/ConfirmSwapModal.tsx";
import {NULL_ADDRESS} from "../../constants";
import {SolanaSwapBox} from "./components/SolanaSwapBox.tsx";
import {ChartDrawer} from "./components/chart/ChartDrawer.tsx";
import {CrossChainSwapBox} from "./components/CrossChainSwapBox.tsx";

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

const SwapModal: React.FC<SwapModalProps> = ({isOpen, onClose}) => {
    // State
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab] = useState<TransactionType>('swap');
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
    const [usdAmount, setUsdAmount] = useState('');
    const [slippage, setSlippage] = useState<SlippageOption>(0.5);
    const [chartType, setChartType] = useState<ChartType>('tradingview');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Responsive layout
    const isMobile = useBreakpointValue({base: true, md: false})
    const [showChart, setShowChart] = useState(false)

    // Set default view based on screen size
    useEffect(() => {
        setShowChart(!isMobile)
    }, [isMobile])


    const handleSwitch = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const handleConfirmSwap = () => {
        // TODO: Implement actual swap logic
        console.log('Swap confirmed:', {
            fromToken,
            toToken,
            fromAmount,
            toAmount,
            slippage,
        });
        setShowConfirmModal(false);
    };

    const onFromTokenSelect = (token: TokenType) => {
/*
        if (toToken && toToken.chainId != token.chainId) {
            setToToken(null)
            setToAmount('')
        }
*/
        setFromToken(token)
    }

    const onToTokenSelect = (token: TokenType) => {
/*
        if (fromToken && fromToken.chainId != token.chainId) {
            setFromToken(null)
            setFromAmount('')
        }
*/
        setToToken(token)
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={isMaximized ? "full" : "6xl"}
            >
                <ModalOverlay backdropFilter="blur(4px)"/>
                <ModalContent
                    className="border glass border-white/10 shadow-lg transition-all duration-300 ease-in-out"
                    borderRadius="xl"
                    p={0}
                    m={isMaximized ? 0 : 4}
                    maxH="90vh"
                    overflow="hidden"
                >
                    <Flex h="full" direction={{base: "column", md: "row"}} maxH={{base: "95vh", md: "90vh"}}>
                        {/* Left Side - Token Info */}
                        {!isMobile && (
                            <Box flex={2} p={2} borderRight="1px" borderColor="whiteAlpha.200">
                                <div className="w-full h-full">
                                    <Chart
                                        type={chartType}
                                        onTypeChange={setChartType}
                                        isMaximized={isMaximized}
                                        token={(fromToken ? fromToken : toToken) as TokenType}
                                    />
                                </div>
                            </Box>
                        )}

                        {/* Right Side - Swap Interface */}
                        <Box minW={["100%", "400px"]} maxW={["100%", "100%", "400px"]} p={6}>
                            {/* Header */}
                            <Flex justify="space-between" align="center" mb={6}>
                                <Flex align="center" gap={2}>
                                    <Text fontSize="xl" fontWeight="bold">Swap</Text>
                                    {/* Toggle chart button on mobile */}
                                    {isMobile && (
                                        <button
                                            onClick={() => setShowChart(!showChart)}
                                            className="p-2 rounded-lg bg-white/5 text-xs text-blue-400"
                                        >
                                            {showChart ? "Hide Chart" : "Show Chart"}
                                        </button>
                                    )}
                                </Flex>

                                <HStack spacing={2}>
                                    <SlippageSettings value={slippage} onChange={setSlippage}/>
                                    <button
                                        onClick={() => setIsMaximized(!isMaximized)}
                                        className="p-2 rounded-lg hover:bg-white/5 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <Maximize2 size={16}/>
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-white/5 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <X size={16}/>
                                    </button>
                                </HStack>
                            </Flex>

                            {/* Tabs */}
                            {/* Swap Interface and Wallet */}
                            <div
                                className="p-2.5 border border-white/5 relative z-50 w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden custom-scrollbar-blue">
                                {/*
                            <div className="flex items-center justify-between mb-4 rounded-lg p-1">
                                    <div className="flex items-center gap-2 w-full me-2">
                                        <button
                                            onClick={() => setActiveTab('buy')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === 'buy'
                                                    ? 'text-blue-400'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('sell')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === 'sell'
                                                    ? 'text-blue-400'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('swap')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === 'swap'
                                                    ? 'text-blue-400'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Swap
                                        </button>
                                    </div>
                                </div>
*/}

                                {activeTab === 'buy' ? (
                                    <BuyBox
                                        selectedToken={fromToken}
                                        onTokenSelect={setFromToken}
                                        usdAmount={usdAmount}
                                        onUsdAmountChange={setUsdAmount}
                                        // onSwap={handleSwap}
                                    />
                                ) : activeTab === 'sell' ? (
                                    <SellBox
                                        selectedToken={fromToken}
                                        onTokenSelect={setFromToken}
                                        amount={fromAmount}
                                        usdAmount={usdAmount}
                                        onAmountChange={setFromAmount}
                                    />
                                ) : (
                                    fromToken?.chainId !== toToken?.chainId ? (
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
                                            slippage={slippage}
                                        />
                                    ) : (
                                        fromToken?.chainId === 900 ? (
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
                                                slippage={slippage}
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
                                                slippage={slippage}
                                            />
                                        )

                                    )
                                )}
                            </div>


                        </Box>
                    </Flex>
                    {showConfirmModal && (
                        <ConfirmSwapModal
                            fromToken={fromToken as TokenType}
                            toToken={toToken as TokenType}
                            fromAmount={fromAmount}
                            toAmount={toAmount}
                            priceImpact={-0.5} // TODO: Calculate actual price impact
                            slippage={slippage}
                            onConfirm={handleConfirmSwap}
                            onClose={() => setShowConfirmModal(false)}
                        />
                    )}
                </ModalContent>
            </Modal>
            {isMobile && (
                <ChartDrawer
                    type={chartType}
                    onTypeChange={setChartType}
                    isMaximized={isMaximized}
                    token={(fromToken ? fromToken : toToken) as TokenType}
                    isOpen={showChart}
                    setOpen={setShowChart}/>
            )}
        </>
    );
};

export default SwapModal;
