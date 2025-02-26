import type React from "react"
import { useState, useEffect } from "react"
import { Box, Flex, HStack, Modal, ModalContent, ModalOverlay, Text, useBreakpointValue } from "@chakra-ui/react"
import { Maximize2, X } from "lucide-react"
import { SellBox } from "./components/SellBox"
import { BuyBox } from "./components/BuyBox"
import { SwapBox } from "./components/SwapBox"
import type { ChartType, SlippageOption, TokenType, TransactionType } from "../../types/swap.type"
import { SlippageSettings } from "./SlippageSettings"
import { Chart } from "./components/chart/Chart.tsx"
import { ConfirmSwapModal } from "./modals/ConfirmSwapModal.tsx"
import { NULL_ADDRESS } from "../../constants"
import { SolanaSwapBox } from "./components/SolanaSwapBox.tsx"

interface SwapModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any
}

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose }) => {
    // State
    const [isMaximized, setIsMaximized] = useState(false)
    const [activeTab] = useState<TransactionType>("swap")
    const [fromToken, setFromToken] = useState<TokenType | null>({
        symbol: "ETH",
        name: "Ethereum",
        address: NULL_ADDRESS,
        chainId: 1,
        decimals: 18,
        logoURI: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    })
    const [toToken, setToToken] = useState<TokenType | null>({
        symbol: "USDT",
        name: "Tether USD",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        chainId: 1,
        decimals: 6,
        logoURI: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    })
    const [fromAmount, setFromAmount] = useState("")
    const [toAmount, setToAmount] = useState("")
    const [usdAmount, setUsdAmount] = useState("")
    const [slippage, setSlippage] = useState<SlippageOption>(0.5)
    const [chartType, setChartType] = useState<ChartType>("tradingview")
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Responsive layout
    const isMobile = useBreakpointValue({ base: true, md: false })
    const [showChart, setShowChart] = useState(true)

    // Set default view based on screen size
    useEffect(() => {
        setShowChart(!isMobile)
    }, [isMobile])

    const handleSwitch = () => {
        setFromToken(toToken)
        setToToken(fromToken)
        setFromAmount(toAmount)
        setToAmount(fromAmount)
    }

    const handleConfirmSwap = () => {
        // TODO: Implement actual swap logic
        console.log("Swap confirmed:", {
            fromToken,
            toToken,
            fromAmount,
            toAmount,
            slippage,
        })
        setShowConfirmModal(false)
    }

    const onFromTokenSelect = (token: TokenType) => {
        if (toToken && toToken.chainId != token.chainId) {
            setToToken(null)
            setToAmount("")
        }
        setFromToken(token)
    }

    const onToTokenSelect = (token: TokenType) => {
        if (fromToken && fromToken.chainId != token.chainId) {
            setFromToken(null)
            setFromAmount("")
        }
        setToToken(token)
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size={isMaximized ? "full" : "6xl"}>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent
                    className="border glass border-white/10 shadow-lg transition-all duration-300 ease-in-out"
                    borderRadius="xl"
                    p={0}
                    m={isMaximized ? 0 : { base: 2, md: 4 }}
                    maxH={{ base: "95vh", md: "90vh" }}
                    overflow="hidden"
                >
                    <Flex h="full" direction={{ base: "column", md: "row" }} maxH={{ base: "95vh", md: "90vh" }}>
                        {/* Chart Section - Hidden on mobile by default */}
                        {showChart && (
                            <Box
                                h={{ base: "400px", md: "450px" }}
                                minH={{ base: "400px", md: "450px" }}
                                position="relative"
                                borderBottom="1px solid"
                                borderColor="whiteAlpha.100"
                            >
                                <Chart
                                    type={chartType}
                                    onTypeChange={setChartType}
                                    token={fromToken as TokenType}
                                    // timeRange={timeRange}
                                    // onTimeRangeChange={setTimeRange}
                                />
                            </Box>
                        )}

                        {/* Swap Interface */}
                        <Box
                            w={{ base: "full", md: "400px" }}
                            p={{ base: 4, md: 6 }}
                            maxH={{ base: "calc(95vh - 300px)", md: "90vh" }}
                            overflow="auto"
                            display="flex"
                            flexDirection="column"
                        >
                            {/* Header */}
                            <Flex justify="space-between" align="center" mb={6}>
                                <Flex align="center" gap={2}>
                                    <Text fontSize="xl" fontWeight="bold">
                                        Swap
                                    </Text>
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
                                    <SlippageSettings value={slippage} onChange={setSlippage} />
                                    <button
                                        onClick={() => setIsMaximized(!isMaximized)}
                                        className="p-2 rounded-lg hover:bg-white/5 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <Maximize2 size={16} />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-white/5 transition-all hover:scale-110 active:scale-95"
                                    >
                                        <X size={16} />
                                    </button>
                                </HStack>
                            </Flex>

                            {/* Swap Interface */}
                            <div
                                className="p-2.5 border border-white/5 relative z-50 w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-y-auto overflow-x-hidden custom-scrollbar-blue"
                                style={{
                                    maxHeight: isMobile ? "calc(100% - 80px)" : "calc(90vh - 120px)",
                                    flex: 1,
                                }}
                            >
                                {activeTab === "buy" ? (
                                    <BuyBox
                                        selectedToken={fromToken}
                                        onTokenSelect={setFromToken}
                                        usdAmount={usdAmount}
                                        onUsdAmountChange={setUsdAmount}
                                    />
                                ) : activeTab === "sell" ? (
                                    <SellBox
                                        selectedToken={fromToken}
                                        onTokenSelect={setFromToken}
                                        amount={fromAmount}
                                        usdAmount={usdAmount}
                                        onAmountChange={setFromAmount}
                                    />
                                ) : fromToken?.chainId === 900 ? (
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
        </>
    )
}

export default SwapModal

