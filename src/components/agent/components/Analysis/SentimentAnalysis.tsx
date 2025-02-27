import React from 'react';
import { Box, SimpleGrid, Text, VStack, HStack, Skeleton, Progress } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { SentimentAnalysisData } from '../../../../types';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';

const SentimentIndicator: React.FC<{ value: number; label: string; isLoading: boolean }> = ({
  value,
  label,
  isLoading
}) => (
  <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
    <Text color="gray.400" fontSize="sm" mb={2}>{label}</Text>
    <Skeleton isLoaded={!isLoading}>
      <Progress
        value={value}
        min={0}
        max={100}
        size="sm"
        rounded="full"
        colorScheme={value > 66 ? 'green' : value > 33 ? 'yellow' : 'red'}
        bg="whiteAlpha.100"
        isAnimated
      />
      <HStack justify="space-between" mt={2}>
        <Text fontSize="lg" fontWeight="medium">
          {value}%
        </Text>
        <HStack spacing={1}>
          {value > 50 ? (
            <TrendingUp size={16} color="var(--chakra-colors-green-400)" />
          ) : (
            <TrendingDown size={16} color="var(--chakra-colors-red-400)" />
          )}
          <Text
            fontSize="sm"
            color={value > 50 ? 'green.400' : 'red.400'}
          >
            {value > 50 ? 'Bullish' : 'Bearish'}
          </Text>
        </HStack>
      </HStack>
    </Skeleton>
  </Box>
);

interface SentimentAnalysisProps {
  data?: SentimentAnalysisData;
  isLoading: boolean;
  isWalletPanelOpen: boolean;
}


export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ isWalletPanelOpen, isLoading, data }) => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Box maxW="3xl" mx="auto" p={4}>
      <SimpleGrid columns={{ base: 1, md: isWalletPanelOpen ? 1 : 2, lg: 2 }} spacing={4}>
        <Box className="glass-effect border border-white/10" p={6} rounded="xl">
          <HStack mb={6} spacing={3}>
            <Activity size={24} color="var(--chakra-colors-blue-400)" />
            <Text fontSize="xl" fontWeight="bold">
              ETH Market Sentiment
            </Text>
          </HStack>

          <VStack spacing={4} align="stretch">
            <SentimentIndicator
              value={data?.social_sentiment ?? 65}
              label="Social Media Sentiment"
              isLoading={isLoading}
            />
            <SentimentIndicator
              value={data?.trading_sentiment ?? 45}
              label="Trading Activity Sentiment"
              isLoading={isLoading}
            />
            <SentimentIndicator
              value={data?.technical_sentiment ?? 72}
              label="Technical Indicators"
              isLoading={isLoading}
            />
          </VStack>
        </Box>

        <Box className="glass-effect border border-white/10" p={6} rounded="xl">
          <HStack mb={6} spacing={3}>
            <BarChart3 size={24} color="var(--chakra-colors-blue-400)" />
            <Text fontSize="xl" fontWeight="bold">
              Market Activity
            </Text>
          </HStack>

          <VStack spacing={6} align="stretch">
            <Box>
              <Text color="gray.400" mb={2}>Current Price</Text>
              <Skeleton isLoaded={!isLoading}>
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    {data ? formatPrice(data.current_price) : '$0.00'}
                  </Text>
                  <HStack>
                    {(data?.price_change_percentage_24h ?? 0) > 0 ? (
                      <TrendingUp size={16} color="var(--chakra-colors-green-400)" />
                    ) : (
                      <TrendingDown size={16} color="var(--chakra-colors-red-400)" />
                    )}
                    <Text
                      color={(data?.price_change_percentage_24h ?? 0) > 0 ? 'green.400' : 'red.400'}
                      fontWeight="medium"
                    >
                      {data ? `${data?.price_change_percentage_24h?.toFixed(2)}%` : '0.00%'}
                    </Text>
                  </HStack>
                </HStack>
              </Skeleton>
            </Box>

            <Box height="150px">
              <Box height="100%" position="relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.price_history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={(data && data?.price_change_percentage_24h > 0) ? '#48BB78' : '#F56565'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={(data && data?.price_change_percentage_24h > 0) ? '#48BB78' : '#F56565'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={(data && data?.price_change_percentage_24h > 0) ? '#48BB78' : '#F56565'}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={1}>24h Volume</Text>
                <Skeleton isLoaded={!isLoading}>
                  <Text fontWeight="medium">
                    {data ? `$${(data.volume_24h / 1e9).toFixed(2)}B` : '$0.00'}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={1}>Market Cap</Text>
                <Skeleton isLoaded={!isLoading}>
                  <Text fontWeight="medium">
                    {data ? `$${(data.market_cap / 1e9).toFixed(2)}B` : '$0.00'}
                  </Text>
                </Skeleton>
              </Box>
            </SimpleGrid> 
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};