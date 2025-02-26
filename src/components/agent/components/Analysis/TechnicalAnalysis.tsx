import React from 'react';
import { Box, SimpleGrid, Text, VStack, HStack, Progress, Badge, Skeleton, Tooltip } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip } from 'recharts';
import { BollingerBandsProgress } from '../../../../utils/agent';
import { TechnicalAnalysisData } from '../../../../types';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box className="glass-effect" p={2} rounded="md">
        <Text fontSize="sm">
          MA20: ${payload[1].value.toLocaleString()}
        </Text>
        <Text fontSize="sm">
          Price: ${payload[0].value.toLocaleString()}
        </Text>
      </Box>
    );
  }
  return null;
};

interface IndicatorProps {
  label: string;
  value: number;
  signal: string;
  strength: number;
  isLoading: boolean;
  tooltip?: string;
}

const TechnicalIndicator: React.FC<IndicatorProps> = ({
  label,
  value,
  signal,
  strength,
  isLoading,
  tooltip,
}) => (
  <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
    <HStack justify="space-between" mb={2}>
      <Tooltip label={tooltip} hasArrow placement="top">
        <Text color="gray.400" fontSize="sm" cursor="help">{label}</Text>
      </Tooltip>
      <Badge
        colorScheme={signal === 'BUY' ? 'green' : signal === 'SELL' ? 'red' : 'yellow'}
        variant="subtle"
      >
        {signal.toUpperCase()}
      </Badge>
    </HStack>
    <Skeleton isLoaded={!isLoading}>
      <Text color="white" fontSize="xl" fontWeight="bold" mb={2}>
        {value.toFixed(2)}
      </Text>
      {label != "MACD" &&
        <Progress
          value={strength}
          size="sm"
          rounded="full"
          colorScheme={signal === 'BUY' ? 'green' : signal === 'SELL' ? 'red' : 'yellow'}
          bg="whiteAlpha.100"
        />
      }
    </Skeleton>
  </Box>
);

const LivePriceChart: React.FC<{ data: any[]; isLoading: boolean }> = ({ data, isLoading }) => {
  const chartData = data.map(d => ({
    ...d,
    timestamp: new Date(d.time)
  }));

  if (isLoading) {
    return <Skeleton height="200px" />;
  }

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(time) => time instanceof Date ?
            time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          stroke="#4A5568"
          fontSize={9}
          angle={-35}
        />
        <YAxis
          domain={[minPrice, maxPrice]}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          stroke="#4A5568"
          fontSize={9}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#3182CE"
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
        <Area
          type="monotone"
          dataKey="ma20"
          stroke="#3182CE"
          strokeDasharray="3 3"
          fillOpacity={0}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface TechnicalAnalysisProps {
  data?: TechnicalAnalysisData;
  isLoading: boolean;
  isWalletPanelOpen: boolean;
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ isWalletPanelOpen, isLoading, data }) => {

  return (
    <Box maxW="3xl" mx="auto" p={4}>
      <SimpleGrid columns={{ base: 1, md: isWalletPanelOpen ? 1 : 2, lg: 2 }} spacing={4}>
        <Box className="glass-effect border border-white/10" p={6} rounded="xl" position="relative">
          <HStack mb={6} spacing={3}>
            <Activity size={24} color="var(--chakra-colors-blue-400)" />
            <Text color="white" fontSize="xl" fontWeight="bold">
              Technical Indicators
            </Text>
          </HStack>

          {isLoading && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.700"
              backdropFilter="blur(4px)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              rounded="xl"
            >
              <Text color="white">Loading indicators...</Text>
            </Box>
          )}

          <VStack spacing={4} align="stretch">
            <TechnicalIndicator
              label="RSI (14)"
              value={data?.analysis?.technicalIndicators?.rsi?.value ?? 0}
              signal={data?.analysis?.technicalIndicators?.rsi?.signal ?? 'NEUTRAL'}
              strength={data?.analysis?.technicalIndicators?.rsi?.value ?? 0}
              isLoading={isLoading}
              tooltip="Relative Strength Index measures momentum on a scale of 0 to 100. Above 70 = overbought, below 30 = oversold."
            />
            <TechnicalIndicator
              label="MACD"
              value={data?.analysis?.technicalIndicators?.macd?.value ?? 0}
              signal={data?.analysis?.technicalIndicators?.macd?.signal ?? 'NEUTRAL'}
              strength={0}
              isLoading={isLoading}
              tooltip="Moving Average Convergence Divergence shows trend direction and momentum."
            />
            <TechnicalIndicator
              label="Stochastic RSI"
              value={data?.analysis?.technicalIndicators?.stochasticRsi?.value ?? 0}
              signal={data?.analysis?.technicalIndicators?.stochasticRsi?.signal ?? 'NEUTRAL'}
              strength={data?.analysis?.technicalIndicators?.stochasticRsi?.value ?? 0}
              isLoading={isLoading}
              tooltip="Combines RSI with Stochastic oscillator for enhanced momentum signals."
            />
            <TechnicalIndicator
              label="Bollinger Bands"
              value={data?.analysis?.technicalIndicators?.bollingerBands?.value ?? 0}
              signal={data?.analysis?.technicalIndicators?.bollingerBands?.signal ?? 'NEUTRAL'}
              strength={BollingerBandsProgress(data?.analysis?.technicalIndicators?.bollingerBands)}
              isLoading={isLoading}
              tooltip="Shows volatility and potential price levels using standard deviations."
            />
          </VStack>
        </Box>

        <Box className="glass-effect border border-white/10" p={6} rounded="xl" position="relative">
          <HStack mb={6} spacing={3}>
            <BarChart3 size={24} color="var(--chakra-colors-blue-400)" />
            <Text color="white" fontSize="xl" fontWeight="bold">
              Moving Averages
            </Text>
          </HStack>

          {isLoading && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.700"
              backdropFilter="blur(4px)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              rounded="xl"
            >
              <Text color="white">Loading price data...</Text>
            </Box>
          )}

          <VStack spacing={6} align="stretch">
            <Box>
              <Text color="gray.400" mb={2}>Price vs Moving Averages</Text>
              <Skeleton isLoaded={!isLoading}>
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    ${data?.moving_averages?.price.toLocaleString() ?? '0.00'}
                  </Text>
                  <HStack>
                    {(data?.moving_averages?.priceChangePercent ?? 0) >= 0 ? (
                      <TrendingUp size={16} color="var(--chakra-colors-green-400)" />
                    ) : (
                      <TrendingDown size={16} color="var(--chakra-colors-red-400)" />
                    )}
                    <Text
                      color={(data?.moving_averages?.priceChangePercent ?? 0) >= 0 ? 'green.400' : 'red.400'}
                      fontWeight="medium"
                    >
                      {(data?.moving_averages?.priceChangePercent ?? 0).toFixed(2)}%
                    </Text>
                  </HStack>
                </HStack>
              </Skeleton>
            </Box>

            <LivePriceChart data={data?.moving_averages?.chartData ?? []} isLoading={isLoading} />

            <SimpleGrid columns={2} spacing={4} mt={4}>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={1}>MA (20)</Text>
                <Skeleton isLoaded={!isLoading}>
                  <Text color="white" fontWeight="medium">
                    ${data?.moving_averages?.movingAverages?.ma20.toLocaleString() ?? '0.00'}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={1}>MA (50)</Text>
                <Skeleton isLoaded={!isLoading}>
                  <Text color="white" fontWeight="medium">
                    ${data?.moving_averages?.movingAverages?.ma50.toLocaleString() ?? '0.00'}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={1}>MA (100)</Text>
                <Skeleton isLoaded={!isLoading}>
                  <Text color="white" fontWeight="medium">
                    ${data?.moving_averages?.movingAverages?.ma100.toLocaleString() ?? '0.00'}
                  </Text>
                </Skeleton>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={1}>MA (200)</Text>
                <Skeleton isLoaded={!isLoading}>
                  <Text color="white" fontWeight="medium">
                    ${data?.moving_averages?.movingAverages?.ma200.toLocaleString() ?? '0.00'}
                  </Text>
                </Skeleton>
              </Box>
            </SimpleGrid>

            <Box className="glass-effect-light border border-white/10" p={4} rounded="lg" mt={2}>
              <HStack spacing={2} mb={2}>
                <AlertTriangle size={16} color="var(--chakra-colors-yellow-400)" />
                <Text color="yellow.400" fontSize="sm">
                  Trading Signals
                </Text>
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Signals are based on multiple technical indicators and should not be used as the sole basis for trading decisions.
              </Text>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box className="glass-effect" p={6} rounded="xl" mt={4}>
        <HStack mb={4} spacing={3}>
          <BarChart3 size={24} color="var(--chakra-colors-blue-400)" />
          <Text color="white" fontSize="xl" fontWeight="bold">
            Signal Summary
          </Text>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
            <Text color="gray.400" mb={2}>Short Term (24h)</Text>
            <Badge
              colorScheme={data?.summary?.shortTerm === 'BUY' ? 'green' : data?.summary?.shortTerm === 'SELL' ? 'red' : 'yellow'}
              px={3}
              py={1}
              rounded="md"
            >
              {data?.summary?.shortTerm ?? 'NEUTRAL'}
            </Badge>
          </Box>

          <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
            <Text color="gray.400" mb={2}>Medium Term (7d)</Text>
            <Badge
              colorScheme={data?.summary?.mediumTerm === 'BUY' ? 'green' : data?.summary?.mediumTerm === 'SELL' ? 'red' : 'yellow'}
              px={3}
              py={1}
              rounded="md"
            >
              {data?.summary?.mediumTerm ?? 'NEUTRAL'}
            </Badge>
          </Box>

          <Box className="glass-effect-light border border-white/10" p={4} rounded="lg">
            <Text color="gray.400" mb={2}>Overall Trend</Text>
            <Badge
              colorScheme={data?.summary?.overallTrend === 'BUY' ? 'green' : data?.summary?.overallTrend === 'SELL' ? 'red' : 'yellow'}
              px={3}
              py={1}
              rounded="md"
            >
              {data?.summary?.overallTrend ?? 'NEUTRAL'}
            </Badge>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};