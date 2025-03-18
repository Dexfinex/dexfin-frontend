import {debridgeApi} from "./api.service.ts";
import {DebridgeQuoteRequestType, DebridgeQuoteResponseType, DebridgeTrackResponseType} from "../types/swap.type.ts";

export const debridgeService = {
    getQuote: async (quote: DebridgeQuoteRequestType): Promise<DebridgeQuoteResponseType> => {
        const {data} = await debridgeApi.get<DebridgeQuoteResponseType>('quote', {
            params: quote
        });
        return data
    },
    getTrackHash: async (orderId: string): Promise<DebridgeTrackResponseType | null> => {
        try {
            const {data} = await debridgeApi.get<DebridgeTrackResponseType>(`track/${orderId}`);
            return data
        } catch (error) {
            console.log('Failed to track hash:', error);
        }

        return null
    },
}