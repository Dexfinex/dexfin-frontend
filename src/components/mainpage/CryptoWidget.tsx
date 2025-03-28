import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Tab,
  TabList,
  Tabs,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bitcoin as BitcoinIcon, Coins as EthereumIcon, Gem as SolanaIcon } from 'lucide-react';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  chartData: { time: string; price: number }[];
  icon: React.ElementType;
}

const generateMockChartData = () => {
  const data = [];
  const basePrice = Math.random() * 1000;
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      price: basePrice + Math.random() * 100 - 50,
    });
  }
  return data;
};

const cryptoList: CryptoData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 48235.12,
    change24h: 2.34,
    chartData: generateMockChartData(),
    icon: BitcoinIcon,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2298.76,
    change24h: 1.56,
    chartData: generateMockChartData(),
    icon: EthereumIcon,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.45,
    change24h: 4.23,
    chartData: generateMockChartData(),
    icon: SolanaIcon,
  },
];

const CryptoWidget = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCrypto = cryptoList[selectedIndex];

  return (
    <Box
      position="fixed"
      top="60px"
      right="440px"
      w="350px"
      bg="rgba(0, 0, 0, 0.75)"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      p={4}
      color="white"
      zIndex={100}
      border="1px solid rgba(255, 255, 255, 0.1)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
    >
      <Tabs
        variant="soft-rounded"
        colorScheme="whiteAlpha"
        index={selectedIndex}
        onChange={setSelectedIndex}
        mb={4}
      >
        <TabList>
          {cryptoList.map((crypto, index) => (
            <Tab
              key={crypto.symbol}
              _selected={{ bg: 'whiteAlpha.200' }}
              px={3}
              py={1}
              fontSize="sm"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              <HStack spacing={2}>
                <Box color="white">
                  <crypto.icon size={18} strokeWidth={2.5} />
                </Box>
                <Text>{crypto.symbol}</Text>
              </HStack>
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <VStack align="stretch" spacing={4}>
        <Flex justify="space-between" align="center">
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              ${selectedCrypto.price.toLocaleString()}
            </Text>
            <Text
              fontSize="sm"
              color={selectedCrypto.change24h >= 0 ? 'green.300' : 'red.300'}
              fontWeight="500"
            >
              {selectedCrypto.change24h >= 0 ? '↑' : '↓'} {Math.abs(selectedCrypto.change24h)}%
            </Text>
          </VStack>
          <Text fontSize="sm" color="whiteAlpha.700">
            24h Change
          </Text>
        </Flex>

        <Box h="150px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedCrypto.chartData}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                interval={6}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#fff"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
};

export default CryptoWidget;