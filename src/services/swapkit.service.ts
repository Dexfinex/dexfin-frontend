import {swapkitApi} from "./api.service.ts";
import {SwapkitQuoteRequestType} from "../types/swap.type.ts";
import {DepositInfo, SwapkitQuoteResponse} from "../types/bridge.type.ts";

export const swapkitService = {
    getQuote: async (quote: SwapkitQuoteRequestType): Promise<SwapkitQuoteResponse | null> => {
        try {
            const {data} = await swapkitApi.post<SwapkitQuoteResponse>('quote', quote);
            return data
        } catch (error) {
            console.log('Failed to fetch swapkit quote:', error);
        }

        return null
    },
    getBrokerChannel: async (request: any): Promise<DepositInfo | null> => {
        try {
            const {data} = await swapkitApi.post<DepositInfo>('broker/channel', request);
            return data
        } catch (error) {
            console.log('Failed to fetch swapkit broker channel:', error);
        }

        return null
    },
    getTrackHash: async (chainId: number, hash: string): Promise<DepositInfo | null> => {
        try {
            const {data} = await swapkitApi.post<DepositInfo>('track', {
                chainId: chainId.toString(),
                hash,
            });
            return data
        } catch (error) {
            console.log('Failed to track hash:', error);
        }

        return null
    },
}