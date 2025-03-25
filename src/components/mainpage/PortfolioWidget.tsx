import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Flex,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, ChevronDown, ArrowUpRight } from 'lucide-react';

const mockData = {
  totalValue: 15432.67,
  pnl24h: 234.56,
  pnlPercentage: 1.54,
  distribution: [
    { name: 'Staked', value: 45, color: '#48BB78' },
    { name: 'Lending', value: 30, color: '#4299E1' },
    { name: 'LP', value: 15, color: '#9F7AEA' },
    { name: 'Liquid', value: 10, color: '#F6AD55' }
  ],
  performanceData: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 15000 + Math.sin(i / 4) * 500 + Math.random() * 200
  })),
  defiPositions: [
    {
      protocol: 'Aave',
      type: 'Lending',
      asset: 'USDC',
      value: 1000,
      apy: 4.5,
      chain: 'Ethereum'
    },
    {
      protocol: 'Lido',
      type: 'Staking',
      asset: 'ETH',
      value: 1151.44,
      apy: 3.8,
      chain: 'Ethereum'
    },
    {
      protocol: 'Curve',
      type: 'LP',
      asset: 'ETH/USDC',
      value: 2500,
      apy: 8.2,
      chain: 'Ethereum'
    },
    {
      protocol: 'Balancer',
      type: 'LP',
      asset: 'BTC/ETH',
      value: 1800,
      apy: 12.5,
      chain: 'Polygon'
    },
    {
      protocol: 'Compound',
      type: 'Lending',
      asset: 'USDT',
      value: 750,
      apy: 3.9,
      chain: 'Ethereum'
    }
  ]
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null;
  return (
    <Box
      bg="gray.800"
      p={2}
      borderRadius="md"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Text color="white">${payload[0]?.value.toLocaleString()}</Text>
    </Box>
  );
};

const PortfolioWidget = () => {
  const [selectedChain, setSelectedChain] = useState('all');
  const [timeRange] = useState('24h');

  const filteredPositions = mockData.defiPositions.filter(pos => 
    selectedChain === 'all' || pos.chain.toLowerCase() === selectedChain.toLowerCase()
  );

  return (
    <Box
      position="fixed"
      top="60px"
      right="800px"
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
      <VStack spacing={4} align="stretch">
        {/* Header with Total Value */}
        <HStack justify="space-between">
          <HStack>
            <Wallet size={20} />
            <Text fontWeight="bold">Portfolio Value</Text>
          </HStack>
          <VStack align="end" spacing={0}>
            <Text fontSize="lg" fontWeight="bold">
              ${mockData.totalValue.toLocaleString()}
            </Text>
            <HStack spacing={1} color={mockData.pnl24h >= 0 ? "green.400" : "red.400"}>
              {mockData.pnl24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <Text fontSize="sm">
                ${Math.abs(mockData.pnl24h).toLocaleString()} ({mockData.pnlPercentage}%)
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Performance Chart */}
        <Box h="100px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.performanceData}>
              <XAxis 
                dataKey="time" 
                hide 
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#48BB78"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Distribution Chart */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Portfolio Distribution</Text>
          <Flex align="center" justify="space-between">
            <Box w="120px" h="120px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockData.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <VStack align="stretch" flex={1} pl={4}>
              {mockData.distribution.map((item) => (
                <HStack key={item.name} justify="space-between">
                  <HStack>
                    <Box w="3" h="3" borderRadius="full" bg={item.color} />
                    <Text fontSize="sm">{item.name}</Text>
                  </HStack>
                  <Text fontSize="sm">{item.value}%</Text>
                </HStack>
              ))}
            </VStack>
          </Flex>
        </Box>

        {/* DeFi Positions */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm" fontWeight="bold">DeFi Positions</Text>
            <Menu>
              <MenuButton 
                as={Button}
                variant="ghost"
                size="sm"
                rightIcon={<ChevronDown size={14} />}
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                {selectedChain === 'all' ? 'All Chains' : selectedChain}
              </MenuButton>
              <MenuList bg="rgba(0, 0, 0, 0.95)" borderColor="whiteAlpha.200">
                <MenuItem 
                  onClick={() => setSelectedChain('all')}
                  bg="transparent"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  All Chains
                </MenuItem>
                <MenuItem 
                  onClick={() => setSelectedChain('ethereum')}
                  bg="transparent"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Ethereum
                </MenuItem>
                <MenuItem 
                  onClick={() => setSelectedChain('polygon')}
                  bg="transparent"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Polygon
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <VStack spacing={2} align="stretch">
            {filteredPositions.map((position, index) => (
              <Box
                key={index}
                bg="whiteAlpha.50"
                p={3}
                borderRadius="lg"
                _hover={{ bg: 'whiteAlpha.100' }}
                cursor="pointer"
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontSize="sm" fontWeight="medium">{position.protocol}</Text>
                      <Badge size="sm" colorScheme="purple">{position.type}</Badge>
                    </HStack>
                    <Text fontSize="xs" color="whiteAlpha.700">
                      {position.asset}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing={0}>
                    <Text fontSize="sm">${position.value.toLocaleString()}</Text>
                    <Text fontSize="xs" color="green.400">APY: {position.apy}%</Text>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ArrowUpRight size={14} />}
          _hover={{ bg: 'whiteAlpha.100' }}
        >
          View All Positions
        </Button>
      </VStack>
    </Box>
  );
};

export default PortfolioWidget;