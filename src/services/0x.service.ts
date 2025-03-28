
import {zeroxApi} from "./api.service.ts";
import {
    gaslessSubmitResponse,
    QuoteResponse,
    ZeroxGaslessStatusRequestType, ZeroxGaslessStatusResponseType,
    ZeroxQuoteRequestType
} from "../types/swap.type.ts";
import {polygon} from "viem/chains";
import {compareWalletAddresses} from "../utils/common.util.ts";
import {mapChainId2NativeAddress} from "../config/networks.ts";
import {NULL_ADDRESS} from "../constants";

export const zeroxService = {
    getCorrectTokenAddress: (address: string, chainId: number) => {
        if (chainId === polygon.id && compareWalletAddresses(address, mapChainId2NativeAddress[chainId]))
            return NULL_ADDRESS
        return address
    },
    getQuote: async (quote: ZeroxQuoteRequestType): Promise<QuoteResponse> => {
        try {
            const {data} = await zeroxApi.get<QuoteResponse>(quote.isGasLess ? '/gasless/quote' : 'quote', {
                params: {
                    chainId: quote.chainId,
                    sellTokenAddress: zeroxService.getCorrectTokenAddress(quote.sellTokenAddress, quote.chainId),
                    buyTokenAddress: zeroxService.getCorrectTokenAddress(quote.buyTokenAddress, quote.chainId),
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
                    sellTokenAddress: zeroxService.getCorrectTokenAddress(quote.sellTokenAddress, quote.chainId),
                    buyTokenAddress: zeroxService.getCorrectTokenAddress(quote.buyTokenAddress, quote.chainId),
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