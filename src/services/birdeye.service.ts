import { birdeyeApi } from "./api.service.ts";
import { birdeyeOHLCVResponse, ChartDataPoint } from "../types/swap.type.ts";
import axios from "axios";
import { mintPriceResponse } from "../types/birdeye.type.ts";

export const birdeyeService = {
    getOHLCV: async (
        mintAddress: string,
        timeInterval = '15m',
        unixTimeFrom: number | undefined = undefined,
        unixTimeTo: number | undefined = undefined) => {
        try {
            const response = await birdeyeApi.get<birdeyeOHLCVResponse>(`/ohlcv`, {
                params: {
                    ...{
                        address: mintAddress,
                        currency: 'usd',
                        type: timeInterval,
                        time_from: unixTimeFrom,
                        time_to: unixTimeTo,
                    }
                },
            });

            if (!response.data || !Array.isArray(response.data.items)) {
                throw new Error('Invalid response format');
            }

            const chartData: ChartDataPoint[] = response.data?.items.map((item) => ({
                time: item.unixTime,
                open: item.o,
                high: item.h,
                low: item.l,
                close: item.c,
                volume: item.v,
            }));
            return chartData
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
        return { data: {} }
    },
    getTokenInfo: async (address: string) => {
        try {
            const { data } = await birdeyeApi.get<any>(`/token-info?address=${address}`);
            return data;
        } catch (err) {
            console.log('err: ', err);
        }

        return null;
    }
}
