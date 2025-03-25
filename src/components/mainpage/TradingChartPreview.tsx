import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MotionBadge = motion(Badge);

interface OrderBookEntry {
  price: string;
  size: string;
  total: string;
  type: 'ask' | 'bid';
  fillPercent: number;
}

const generateOrderBook = (): OrderBookEntry[] => {
  const basePrice = 3076.96;
  const asks: OrderBookEntry[] = Array.from({ length: 5 }, (_, i) => ({
    price: (basePrice + i * 0.5).toFixed(2),
    size: (Math.random() * 10).toFixed(3),
    total: (Math.random() * 1000).toFixed(2),
    type: 'ask',
    fillPercent: Math.random() * 100,
  }));

  const bids: OrderBookEntry[] = Array.from({ length: 5 }, (_, i) => ({
    price: (basePrice - i * 0.5).toFixed(2),
    size: (Math.random() * 10).toFixed(3),
    total: (Math.random() * 1000).toFixed(2),
    type: 'bid',
    fillPercent: Math.random() * 100,
  }));

  return [...asks.reverse(), ...bids];
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
      <Text color="white">${payload[0]?.value.toFixed(2)}</Text>
    </Box>
  );
};

const TradingChartPreview = () => {
  const [data, setData] = useState<Array<{ time: string; price: number }>>([]);
  const [orderBook, setOrderBook] = useState<OrderBookEntry[]>(generateOrderBook());
  const [showTrade, setShowTrade] = useState(false);
  const [lastPrice, setLastPrice] = useState(3076.96);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    // Initialize data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      price: 3000 + Math.random() * 200,
    }));
    setData(initialData);

    // Update price and chart
    const priceInterval = setInterval(() => {
      setData(prevData => {
        const newPrice = prevData[prevData.length - 1].price + (Math.random() - 0.5) * 20;
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          price: newPrice,
        };
        
        setLastPrice(newPrice);
        setPriceChange(((newPrice - prevData[0].price) / prevData[0].price) * 100);
        setShowTrade(true);
        setTimeout(() => setShowTrade(false), 2000);
        
        return [...prevData.slice(1), newPoint];
      });
    }, 3000);

    // Update order book
    const orderBookInterval = setInterval(() => {
      setOrderBook(generateOrderBook());
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(orderBookInterval);
    };
  }, []);

  return (
    <Box position="relative" h="full" w="full">
      <AnimatePresence>
        {showTrade && (
          <MotionBadge
            position="absolute"
            top={4}
            right={4}
            colorScheme={priceChange >= 0 ? "green" : "red"}
            fontSize="sm"
            px={3}
            py={1}
            zIndex={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <HStack spacing={1}>
              {priceChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <Text>{Math.abs(priceChange).toFixed(2)}%</Text>
            </HStack>
          </MotionBadge>
        )}
      </AnimatePresence>

      <HStack 
        spacing={4} 
        h="full" 
        w="full" 
        bg="whiteAlpha.50" 
        borderRadius="lg"
        p={4}
        align="stretch"
      >
        {/* Order Book */}
        <VStack flex={1} spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="whiteAlpha.700">Order Book</Text>
            <Text fontSize="sm" color="whiteAlpha.700">ETH/USDT</Text>
          </HStack>
          
          <Table variant="unstyled" size="sm">
            <Tbody>
              {orderBook.map((order, i) => (
                <Tr 
                  key={i} 
                  position="relative"
                  sx={{
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: `${order.fillPercent}%`,
                      bg: order.type === 'ask' ? 'red.400' : 'green.400',
                      opacity: 0.1,
                    }
                  }}
                >
                  <Td color={order.type === 'ask' ? 'red.400' : 'green.400'} px={2} py={1}>
                    {order.price}
                  </Td>
                  <Td isNumeric px={2} py={1}>{order.size}</Td>
                  <Td isNumeric px={2} py={1}>{order.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>

        {/* Chart */}
        <Box flex={2} h="full">
          <VStack h="full" spacing={2}>
            <HStack w="full" justify="space-between">
              <Text fontSize="xl" fontWeight="bold">${lastPrice.toFixed(2)}</Text>
              <Badge colorScheme={priceChange >= 0 ? "green" : "red"}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </Badge>
            </HStack>
            
            <Box flex={1} w="full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={priceChange >= 0 ? "#48BB78" : "#F56565"}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default TradingChartPreview;