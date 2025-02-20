import { useState, useEffect, useCallback, useRef } from 'react';
import {ChartDataPoint, TimeRange, TokenType} from "../types/swap.type.ts";
import {coingeckoService} from "../services/coingecko.service.ts";
import {formatChartData} from "../utils/formatChartData";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {birdeyeService} from "../services/birdeye.service.ts";

export function useChartData(token: TokenType, timeRange: TimeRange) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getDays = useCallback((range: TimeRange): number => {
    switch (range) {
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '1y': return 365;
      default: return 1;
    }
  }, []);

  const fetchData = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      let symbol
      let chartData: ChartDataPoint[] | null = null

      if (token) {
        if (token.chainId === SOLANA_CHAIN_ID) {
          chartData = await birdeyeService.getOHLCV(token.address, timeRange)
        } else if (token.address.startsWith('0x') || token.address.length > 40) {
          symbol = await coingeckoService.getCoinGeckoIdFrom(token, token.chainId)
          chartData = await coingeckoService.getOHLCV(symbol.toLowerCase(), getDays(timeRange));
        }
      }

      if (!chartData) {
        throw new Error('Invalid token symbol');
      }

      const formattedData = formatChartData(chartData, timeRange);
      setData(formattedData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Ignore abort errors
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart data';
      setError(new Error(errorMessage));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [token, timeRange, getDays]);

  // Cleanup function to abort any pending requests
  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}