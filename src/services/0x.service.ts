import {zeroxApi} from "./api.service.ts";
import {
    gaslessSubmitResponse,
    QuoteResponse,
    ZeroxGaslessStatusRequestType, ZeroxGaslessStatusResponseType,
    ZeroxQuoteRequestType
} from "../types/swap.type.ts";

export const zeroxService = {
    getQuote: async (quote: ZeroxQuoteRequestType): Promise<QuoteResponse> => {
        try {
            const {data} = await zeroxApi.get<QuoteResponse>(quote.isGasLess ? '/gasless/quote' : 'quote', {
                params: {
                    chainId: quote.chainId,
                    sellTokenAddress: quote.sellTokenAddress,
                    buyTokenAddress: quote.buyTokenAddress,
                    sellTokenAmount: quote.sellTokenAmount,
                    takerAddress: quote.takerAddress,
                },
            });
            return data
        } catch (error) {
            console.log('Failed to fetch 0x quote:', error);
            // try to get price if
            return await zeroxService.getPrice(quote)
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return null
    },
    getPrice: async (quote: ZeroxQuoteRequestType): Promise<QuoteResponse> => {
        try {
            const {data} = await zeroxApi.get<QuoteResponse>(quote.isGasLess ? '/gasless/price' : 'price', {
                params: {
                    chainId: quote.chainId,
                    sellTokenAddress: quote.sellTokenAddress,
                    buyTokenAddress: quote.buyTokenAddress,
                    sellTokenAmount: quote.sellTokenAmount,
                    takerAddress: quote.takerAddress,
                },
            });
            return data
        } catch (error) {
            console.log('Failed to fetch 0x price:', error);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return null
    },
    getStatusOfGaslessSwap: async (params: ZeroxGaslessStatusRequestType): Promise<ZeroxGaslessStatusResponseType> => {
        try {
            const {data} = await zeroxApi.get<ZeroxGaslessStatusResponseType>('/gasless/status', {
                params,
            });
            return data
        } catch (error) {
            console.log('Failed to fetch status of gasless transaction:', error);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return null
    },
    submitTrade: async (chainId: number | undefined, tradeDataToSubmit: any, approvalDataToSubmit: any): Promise<string> => {
        try {

            if (!chainId || !tradeDataToSubmit)
                throw new Error('empty data')

            const {data} = await zeroxApi.post<gaslessSubmitResponse>('/gasless/submit', {
                trade: tradeDataToSubmit,
                chainId,
                ...(approvalDataToSubmit ? {approval: approvalDataToSubmit} : {})
            });

            return data.tradeHash
        } catch (error) {
            console.log('Failed to submit gasless transaction:', error);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return null
    },
}