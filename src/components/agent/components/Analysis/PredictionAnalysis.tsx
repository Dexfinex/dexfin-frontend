import React from 'react';
import { Box, SimpleGrid, Text, VStack, HStack, Skeleton, Progress, Badge } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Brain, Target, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';
import { PredictionAnalysisData } from '../../../../types';

const PredictionIndicator: React.FC<{
  value: number;
  label: string;
  confidence: number;
  isLoading: boolean;
}> = ({ value, label, confidence, isLoading }) => (
  <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
    <HStack justify="space-between" mb={2}>
      <Text color="gray.400" fontSize="sm">{label}</Text>
      <Badge
        colorScheme={confidence >= 70 ? 'green' : confidence >= 40 ? 'yellow' : 'red'}
        variant="subtle"
      >
        {confidence}% confidence
      </Badge>
    </HStack>
    <Skeleton isLoaded={!isLoading}>
      <Text color="white" fontSize="2xl" fontWeight="bold" mb={2}>
        ${value.toLocaleString()}
      </Text>
      <Progress
        value={confidence}
        min={0}
        max={100}
        size="sm"
        rounded="full"
        colorScheme={confidence >= 70 ? 'green' : confidence >= 40 ? 'yellow' : 'red'}
        bg="whiteAlpha.100"
        isAnimated
      />
    </Skeleton>
  </Box>
);

const SignalIndicator: React.FC<{
  label: string;
  strength: number;
  direction: 'up' | 'down';
  isLoading: boolean;
}> = ({ label, strength, direction, isLoading }) => (
  <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
    <Text color="gray.400" fontSize="sm" mb={2}>{label}</Text>
    <Skeleton isLoaded={!isLoading}>
      <HStack spacing={3}>
        {direction === 'up' ? (
          <TrendingUp size={20} color="var(--chakra-colors-green-400)" />
        ) : (
          <TrendingDown size={20} color="var(--chakra-colors-red-400)" />
        )}
        <Progress
          flex="1"
          value={strength}
          min={0}
          max={100}
          size="sm"
          rounded="full"
          colorScheme={direction === 'up' ? 'green' : 'red'}
          bg="whiteAlpha.100"
          isAnimated
        />
        <Text
          color={direction === 'up' ? 'green.400' : 'red.400'}
          fontWeight="medium"
        >
          {strength}%
        </Text>
      </HStack>
    </Skeleton>
  </Box>
);

interface PredictionAnalysisProps {
  data?: PredictionAnalysisData;
  isLoading: boolean;
  isWalletPanelOpen: boolean;
}

export const PredictionAnalysis: React.FC<PredictionAnalysisProps> = ({ isWalletPanelOpen, isLoading, data }) => {

  return (
    <Box maxW="3xl" mx="auto" p={4}>
      <SimpleGrid columns={{ base: 1, md: isWalletPanelOpen ? 1 : 2, lg: 2 }} spacing={4}>
        <Box className="glass-effect border border-white/10" p={6} rounded="xl">
          <HStack mb={6} spacing={3}>
            <Brain size={24} color="var(--chakra-colors-purple-400)" />
            <Text color="white" fontSize="xl" fontWeight="bold">
              Price Predictions
            </Text>
          </HStack>

          <VStack spacing={4} align="stretch">
            <PredictionIndicator
              label="24h Prediction"
              value={data?.predictions?.price_24h ?? 0}
              confidence={data?.predictions?.confidence_24h ?? 0}
              isLoading={isLoading}
            />
            <PredictionIndicator
              label="7d Prediction"
              value={data?.predictions?.price_7d ?? 0}
              confidence={data?.predictions?.confidence_7d ?? 0}
              isLoading={isLoading}
            />
            <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
              <HStack spacing={2} mb={2}>
                <AlertTriangle size={16} color="var(--chakra-colors-yellow-400)" />
                <Text color="yellow.400" fontSize="sm">
                  Disclaimer
                </Text>
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Predictions are based on technical analysis and market sentiment.
                Past performance does not guarantee future results.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box className="glass-effect border border-white/10" p={6} rounded="xl">
          <HStack mb={6} spacing={3}>
            <Target size={24} color="var(--chakra-colors-purple-400)" />
            <Text color="white" fontSize="xl" fontWeight="bold">
              Technical Signals
            </Text>
          </HStack>

          <VStack spacing={4} align="stretch">
            <SignalIndicator
              label="Moving Averages"
              strength={data?.signals?.moving_averages ?? 0}
              direction={data?.signals?.moving_averages_direction ?? 'up'}
              isLoading={isLoading}
            />
            <SignalIndicator
              label="RSI"
              strength={data?.signals?.rsi ?? 0}
              direction={data?.signals?.rsi_direction ?? 'up'}
              isLoading={isLoading}
            />
            <SignalIndicator
              label="MACD"
              strength={data?.signals?.macd ?? 0}
              direction={data?.signals?.macd_direction ?? 'up'}
              isLoading={isLoading}
            />
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
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};