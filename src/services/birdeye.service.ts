import {birdeyeApi, coinGeckoApi} from "./api.service.ts";
import {ChartDataPoint} from "../types/swap.type.ts";
import axios from "axios";
import {mintPriceResponse} from "../types/birdeye.type.ts";

export const birdeyeService = {
    getOHLCV: async (tokenId: string, days = 30) => {
        try {
            // Ensure days is a valid number
            const validDays = Math.max(1, Math.min(365, days));

            const response = await coinGeckoApi.get(`/ohlcv/${tokenId}`, {
                params: {
                    vs_currency: 'usd',
                    days: validDays.toString(),
                    precision: 'full',
                },
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format');
            }

            // CoinGecko OHLC format: [timestamp, open, high, low, close]
            const chartData: ChartDataPoint[] = response.data
            return chartData.sort((a, b) => a.time - b.time);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (axios.isAxiosError(error)) {
                /*
                                const message = error.response?.data?.error as string || 'Failed to fetch chart data';
                                console.error('Chart data error:', error.response?.data);
                                throw new Error(message);
                */
            }
            throw error;
        }
    },
    getMintPrices: async (address: (string | null)[]): Promise<mintPriceResponse> => {
        try {
            const response = await birdeyeApi.get<mintPriceResponse>(`/multi-price?addresses=${address}`);
            return response.data;
        } catch (e) {
            console.log(e);
        }
        return {}
    },
}
