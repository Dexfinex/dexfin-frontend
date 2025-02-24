import React from 'react';

import { Box, Flex, Text, Skeleton, VStack } from '@chakra-ui/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ComposedChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BrianCoinData } from '../../../../types/brian.type.ts';
import { formatVolume } from '../../../../utils/brian.tsx';
import { formatNumberByFrac } from '../../../../utils/common.util.ts';
interface PriceCardProps {
  data?: BrianCoinData;
  isLoading: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey?: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const priceData = payload.find(p => p.dataKey === 'price');

    return (
      <Box
        className="glass"
        p={2}
        rounded="md"
        border="1px solid"
        borderColor="whiteAlpha.200"
        minWidth="150px"
      >
        <VStack align="start" spacing={1}>
          <Text fontSize="sm">
            Price: <Text as="span" fontWeight="bold" color="blue.300">${formatNumberByFrac(priceData?.value)}</Text>
          </Text>
        </VStack>
      </Box>
    );
  }
  return null;
};

export const PriceCard: React.FC<PriceCardProps> = ({ data, isLoading }) => {


  return (
    <Box className="glass-effect" p={6} rounded="xl" width="100%">
      <Flex justify="space-between" align="center" mb={4}>
        <Flex align="center" gap={3}>
          <Box
            as="img"
            src={data?.logoURI}
            width="32px"
            height="32px"
          />
          <Box>
            <Text color="white" fontSize="xl" fontWeight="bold">{data?.name}</Text>
            <Text color="gray.400" fontSize="sm">{data?.symbol}</Text>
          </Box>
        </Flex>
        <Box>
          <Skeleton isLoaded={!isLoading}>
            <Text color="white" fontSize="2xl" fontWeight="bold">
              {data ? `$${formatNumberByFrac(data.price)}` : '$0.00'}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <Flex align="center" gap={1} justify="flex-end">
              {data && data.priceChange24h > 0 ? (
                <TrendingUp size={16} color="var(--chakra-colors-green-400)" />
              ) : (
                <TrendingDown size={16} color="var(--chakra-colors-red-400)" />
              )}
              <Text
                color={data && data.priceChange24h > 0 ? 'green.400' : 'red.400'}
                fontSize="sm"
                fontWeight="medium"
              >
                {data ? `${data.priceChange24h.toFixed(2)}%` : '0.00%'}
              </Text>
            </Flex>
          </Skeleton>
        </Box>
      </Flex>

      <Box height="200px" mb={4}>
        {isLoading ? (
          <Skeleton height="100%" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data?.chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={(data?.priceChange24h ?? 0) >= 0 ? '#48BB78' : '#F56565'}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={(data?.priceChange24h ?? 0) >= 0 ? '#48BB78' : '#F56565'}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => {
                  const date = new Date(time);
                  return `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
                }}
                stroke="#4A5568"
                fontSize={10}
                angle={-35}
              />
              <YAxis
                yAxisId="price"
                stroke="#4A5568"
                fontSize={9}
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `${formatNumberByFrac(value)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                yAxisId="price"
                stroke={(data?.priceChange24h ?? 0) >= 0 ? '#48BB78' : '#F56565'}
                fill="url(#colorPrice)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Box>

      <Flex gap={4} flexWrap="wrap">
        <Box flex="1" minW="150px">
          <Text color="gray.400" fontSize="sm" mb={1}>24h Volume</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text fontWeight="medium">
              {data ? formatVolume(data.volume24h) : '$0.00'}
            </Text>
          </Skeleton>
        </Box>
        <Box flex="1" minW="150px">
          <Text color="gray.400" fontSize="sm" mb={1}>Market Cap</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text fontWeight="medium">
              {data ? formatVolume(data.marketCap) : '$0.00'}
            </Text>
          </Skeleton>
        </Box>
        <Box flex="1" minW="150px" />
        <Box flex="1" minW="150px" />
      </Flex>
      <Text mt={5} className="whitespace-pre-wrap">{data?.analysis}</Text>
    </Box>
  );
};