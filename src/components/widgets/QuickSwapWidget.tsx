import React, { useEffect, useState } from 'react';
import { Box, Flex, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { SwapBox } from "../swap/components/SwapBox";
import { SlippageOption, TokenType } from "../../types/swap.type";
import { SlippageSettings } from "../swap/SlippageSettings";
import { ConfirmSwapModal } from "../swap/modals/ConfirmSwapModal.tsx";
import { NULL_ADDRESS } from "../../constants";

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
  const [slippage, setSlippage] = useState<SlippageOption>(0.5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showChart, setShowChart] = useState(false);

  // Set default view based on screen size
  useEffect(() => {
    setShowChart(!isMobile);
  }, [isMobile]);

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
    if (toToken && toToken.chainId != token.chainId) {
      setToToken(null);
      setToAmount('');
    }
    setFromToken(token);
  };

  const onToTokenSelect = (token: TokenType) => {
    if (fromToken && fromToken.chainId != token.chainId) {
      setFromToken(null);
      setFromAmount('');
    }
    setToToken(token);
  };

  return (
    <>
      <Flex h="full" direction={{ base: "column", md: "row" }}  maxH="90vh">
        {/* Right Side - Swap Interface */}
        <Box minW={["100%", "400px"]} p={6}>
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
              <SlippageSettings value={slippage} onChange={setSlippage} />
            </HStack>
          </Flex>

          {/* Swap Interface and Wallet */}
          <div
            className="p-2.5 border border-white/5 relative z-50 w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden custom-scrollbar-blue">
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
    </>
  );
};