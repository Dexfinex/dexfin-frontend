import React from 'react';
import { MarketOverviewData } from '../../../../types';
import { SimpleGrid, Box, VStack, HStack, Text, Skeleton } from '@chakra-ui/react';
import { formatNumberByFrac } from '../../../../utils/common.util.ts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketOverviewProps {
  data?: MarketOverviewData;
  isLoading: boolean;
  isWalletPanelOpen: boolean;
}

const getColor = (value: number): string => {
  if (value <= 25) return '#EA4C4C';
  if (value <= 45) return '#E78B3E';
  if (value <= 55) return '#F1B90B';
  if (value <= 75) return '#8DC647';
  return '#37C26A';
};

const getTrend = (current: number, previous: number) => {
  if (current === previous) return null;
  return current > previous ?
    <TrendingUp size={16} color={getColor(current)} /> :
    <TrendingDown size={16} color={getColor(current)} />;
};

export const MarketOverview: React.FC<MarketOverviewProps> = ({ isWalletPanelOpen, isLoading, data }) => {
  return (
    <Box maxW="3xl" mx="auto" p={4}>
      <SimpleGrid columns={{ base: 1, md: isWalletPanelOpen ? 1 : 2, lg: 2 }} spacing={4}>
        <Box className="glass-effect border border-white/10" p={6} rounded="xl">
          <Text color="white" fontSize="xl" fontWeight="bold" mb={6}>
            {"Market Overview"}
          </Text>

          <VStack spacing={6} align="stretch">
            <Box>
              <Text color="gray.400" mb={1}>Total Market Cap</Text>
              <HStack justify="space-between">
                <Skeleton isLoaded={!isLoading}>
                  <Text color="white" fontSize="2xl" fontWeight="bold">
                    {formatNumberByFrac(data?.market?.total_market_cap)}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isLoading}>
                  <HStack>
                    {data?.market?.market_cap_change_percentage_24h ?? 0 > 0 ? (
                      <TrendingUp size={16} color="var(--chakra-colors-green-400)" />
                    ) : (
                      <TrendingDown size={16} color="var(--chakra-colors-red-400)" />
                    )}
                    <Text
                      color={data?.market?.market_cap_change_percentage_24h ?? 0 > 0 ? 'green.400' : 'red.400'}
                      fontWeight="medium"
                    >
                      {data?.market?.market_cap_change_percentage_24h.toFixed(2)}%
                    </Text>
                  </HStack>
                </Skeleton>
              </HStack>
            </Box>

            <Box>
              <Text color="gray.400" mb={1}>BTC Dominance</Text>
              <Skeleton isLoaded={!isLoading}>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {data?.market.btc_dominance.toFixed(2)}%
                </Text>
              </Skeleton>
            </Box>

            <Box>
              <Text color="gray.400" mb={1}>Total Value Locked</Text>
              <Skeleton isLoaded={!isLoading}>
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {formatNumberByFrac(data?.market.total_value_locked)}
                </Text>
              </Skeleton>
            </Box>
          </VStack>
        </Box>

        <Box className="glass-effect border border-white/10" p={6} rounded="xl">
          <Text color="white" fontSize="xl" fontWeight="bold" mb={6}>
            Market Sentiment
          </Text>

          <Box position="relative" width="100%" height="140px" mb={6}>
            <Box
              position="absolute"
              bottom="0"
              left="50%"
              transform="translateX(-50%)"
              width="200px"
              height="100px"
              borderTopLeftRadius="100px"
              borderTopRightRadius="100px"
              bg="whiteAlpha.100"
              _after={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderTopLeftRadius: '100px',
                borderTopRightRadius: '100px',
                background: 'linear-gradient(90deg, rgba(234, 76, 76, 0.1) 0%, rgba(231, 139, 62, 0.1) 25%, rgba(241, 185, 11, 0.1) 50%, rgba(141, 198, 71, 0.1) 75%, rgba(55, 194, 106, 0.1) 100%)'
              }}
            />

            <Text position="absolute" bottom="8px" left="0" color="gray.400" fontSize="xs">0</Text>
            <Text position="absolute" bottom="8px" left="50%" transform="translateX(-50%)" color="gray.400" fontSize="sm">50</Text>
            <Text position="absolute" bottom="8px" right="0" color="gray.400" fontSize="sm">100</Text>

            <Skeleton isLoaded={!isLoading} position="absolute" bottom="40px" left="50%" transform="translateX(-50%)" width="200px">
              <Text color="white" fontSize="2xl" fontWeight="bold" textAlign="center">{data?.fear?.value}</Text>
              <Text color={getColor(data?.fear?.value ?? 0)} fontSize="md" fontWeight="medium" textAlign="center">
                {data?.fear?.value}
              </Text>
            </Skeleton>
          </Box>

          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text color="gray.400">Yesterday</Text>
              <Skeleton isLoaded={!isLoading} display="flex" alignItems="center" gap={2}>
                <Text color={getColor(data?.fear?.previous_value ?? 0)} fontWeight="medium">{data?.fear?.previous_value}</Text>
                {getTrend(data?.fear?.value ?? 0, data?.fear?.previous_value ?? 0)}
              </Skeleton>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.400">Last Week</Text>
              <Skeleton isLoaded={!isLoading} display="flex" alignItems="center" gap={2}>
                <Text color={getColor(data?.fear?.value ?? 0)} fontWeight="medium">{data?.fear?.previous_week_value ?? 0}</Text>
                {getTrend(data?.fear?.value ?? 0, data?.fear?.previous_week_value ?? 0)}
              </Skeleton>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};