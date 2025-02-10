
import {zeroxApi} from "./api.service.ts";
import {
    gaslessSubmitResponse,
    QuoteResponse,
    ZeroxGaslessStatusRequestType, ZeroxGaslessStatusResponseType,
    ZeroxQuoteRequestType
} from "../types/swap.type.ts";

export const zeroxService = {
    getQuote: async ({
                         chainId,
                         sellTokenAddress,
                         buyTokenAddress,
                         sellTokenAmount,
                         takerAddress,
                         isGasLess,
                     }: ZeroxQuoteRequestType): Promise<QuoteResponse> => {
        try {
            const {data} = await zeroxApi.get<QuoteResponse>(isGasLess ? '/gasless/quote' : 'quote', {
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
                body: {
                    trade: tradeDataToSubmit,
                    chainId,
                    ...(approvalDataToSubmit ? {approval: approvalDataToSubmit} : {})
                },
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