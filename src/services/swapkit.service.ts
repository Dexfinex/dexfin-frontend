import {swapkitApi} from "./api.service.ts";
import {SwapkitQuoteRequestType} from "../types/swap.type.ts";
import {DepositInfo, SwapkitQuoteResponse, SwapkitTrackStatusType} from "../types/bridge.type.ts";

export const swapkitService = {
    getQuote: async (quote: SwapkitQuoteRequestType): Promise<SwapkitQuoteResponse | null> => {
        const {data} = await swapkitApi.post<SwapkitQuoteResponse>('quote', quote);
        return data
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
    getTrackHash: async (chainId: string, hash: string): Promise<SwapkitTrackStatusType | null> => {
        try {
            const {data} = await swapkitApi.post<SwapkitTrackStatusType>('track', {
                chainId: chainId,
                hash,
            });
            return data
        } catch (error) {
            console.log('Failed to track hash:', error);
        }

        return null
    },
}