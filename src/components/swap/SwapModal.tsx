import  {useState} from 'react';
import {Box, Flex, HStack, IconButton, Modal, ModalContent, ModalOverlay, Text,} from '@chakra-ui/react';
import {Maximize2, Settings2, X} from 'lucide-react';
import {SellBox} from "./components/SellBox";
import {BuyBox} from "./components/BuyBox";
import {SwapBox} from "./components/SwapBox";
import {ChartType, SlippageOption, TokenType, TransactionType} from "../../types/swap.type";
import {SlippageSettings} from "./SlippageSettings";
import {Chart} from "./components/chart/Chart.tsx";
import {ConfirmSwapModal} from "./modals/ConfirmSwapModal.tsx";
import {NULL_ADDRESS} from "../../constants";

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

const SwapModal: React.FC<SwapModalProps> = ({isOpen, onClose}) => {
    // State
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<TransactionType>('swap');
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
    const [chartType, setChartType] = useState<ChartType>('line');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSwitch = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

/*
    const handleSwap = () => {
        if (!fromAmount || !toAmount) return;
        setShowConfirmModal(true);
    };
*/

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
        if (toToken && toToken.chainId != token.chainId) {
            setToToken(null)
            setToAmount('')
        }
        setFromToken(token)
    }

    const onToTokenSelect = (token: TokenType) => {
        if (fromToken && fromToken.chainId != token.chainId) {
            setFromToken(null)
            setFromAmount('')
        }
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
                    className="border border-white/10 shadow-lg transition-all duration-300 ease-in-out"
                    bg="#0f1012"
                    color="white"
                    borderRadius="xl"
                    p={0}
                    m={isMaximized ? 0 : 4}
                    maxH="90vh"
                    overflow="hidden"
                >
                    <Flex h="full">
                        {/* Left Side - Token Info */}
                        <Box flex={2} p={2} borderRight="1px" borderColor="whiteAlpha.200">
                            <div className="w-full h-full">
                                <Chart
                                    type={chartType}
                                    onTypeChange={setChartType}
                                    token={(fromToken ? fromToken : toToken) as TokenType}
                                />
                            </div>
                        </Box>

                        {/* Right Side - Swap Interface */}
                        <Box w="400px" p={6}>
                            {/* Header */}
                            <Flex justify="space-between" align="center" mb={6}>
                                <Text fontSize="xl" fontWeight="bold">Swap</Text>
                                <HStack spacing={2}>
                                    <IconButton
                                        aria-label="Settings"
                                        icon={<Settings2 size={16}/>}
                                        variant="ghost"
                                        size="sm"
                                        color="white"
                                        _hover={{bg: 'whiteAlpha.200'}}
                                    />
                                    <IconButton
                                        aria-label="Maximize"
                                        icon={<Maximize2 size={16}/>}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsMaximized(!isMaximized)}
                                        color="white"
                                        _hover={{bg: 'whiteAlpha.200'}}
                                    />
                                    <IconButton
                                        aria-label="Close"
                                        icon={<X size={16}/>}
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        color="white"
                                        _hover={{bg: 'whiteAlpha.200'}}
                                    />
                                </HStack>
                            </Flex>

                            {/* Tabs */}
                            {/* Swap Interface and Wallet */}
                            <div
                                className="p-2.5 border border-white/5 relative z-50 w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden custom-scrollbar-blue">
                                <div className="flex items-center justify-between mb-4 bg-[#1d2837] rounded-lg p-1">
                                    <div className="flex items-center gap-2 w-full me-2">
                                        <button
                                            onClick={() => setActiveTab('buy')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === 'buy'
                                                    ? 'bg-[#111] text-blue-400'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('sell')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === 'sell'
                                                    ? 'bg-[#111] text-blue-400'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('swap')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeTab === 'swap'
                                                    ? 'bg-[#111] text-blue-400'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Swap
                                        </button>
                                        <div className="flex items-center justify-end w-full">
                                            <SlippageSettings value={slippage} onChange={setSlippage}/>
                                        </div>
                                    </div>
                                </div>

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
                                )}
                            </div>


                        </Box>
                    </Flex>
                    {/*
          <TokenSelectorModal
              isOpen={true}
              selectedToken={fromToken}
              onSelect={() => {}}
              onClose={() => {}}
          />
*/}

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

                    {/*
      <BuySuccessModal
        isOpen={true}
        onClose={() => {}}
        selectedTokens={[]}
        buyAmount={toAmount}
        cryptoAmount={fromAmount}
      />
*/}
                    {/*
      <BuySuccessModal
        isOpen={true}
        onClose={() => setShowSuccessModal(false)}
        selectedTokens={selectedHoldings}
        buyAmount={buyAmount}
        cryptoAmount={cryptoAmount}
      />
*/}


                </ModalContent>
            </Modal>


            {/*
      <TokenSelector
        isOpen={isTokenSelectorOpen}
        onClose={() => setIsTokenSelectorOpen(false)}
        onSelect={handleTokenSelect}
      />
*/}
        </>
    );
};

export default SwapModal;