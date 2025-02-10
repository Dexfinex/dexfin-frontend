import { zeroxApi } from "./api.service.ts";
import { QuoteResponse, ZeroxQuoteRequestType } from "../types/swap.type.ts";

export const zeroxService = {
    getQuote: async ({
        chainId,
        sellTokenAddress,
        buyTokenAddress,
        sellTokenAmount,
        takerAddress,
    }: ZeroxQuoteRequestType): Promise<QuoteResponse> => {
        try {
            // console.log("Full 0x API request : ", chainId,
            //     sellTokenAddress,
            //     buyTokenAddress,
            //     sellTokenAmount,
            //     takerAddress,)
            const { data } = await zeroxApi.get<QuoteResponse>('/quote', {
                params: {
                    chainId,
                    sellTokenAddress,
                    buyTokenAddress,
                    sellTokenAmount,
                    takerAddress,
                },
            });
            return data
        } catch (error) {
            console.log('Failed to fetch 0x quote:', error);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return null
    },
}