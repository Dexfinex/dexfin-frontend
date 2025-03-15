import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {TokenType} from "../types/swap.type.ts";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {DebridgeQuoteResponse} from "../types/bridge.type.ts";
import {AxiosError} from "axios";
import {debridgeService} from "../services/debridge.service.ts";
import {ethers} from "ethers";
import {mapDebridgeFeeCosts} from "../constants/debridge.constants.ts";

interface quoteParam {
    sellToken: TokenType | null,
    buyToken: TokenType | null,
    sellAmount: string | undefined,
    destinationAddress: string | undefined,
}

const defaultQuoteResponse = {
    inputUsdAmount: 0,
    outputUsdAmount: 0,
    outputAmount: '0',
    feeAmount: 0,
    estimatedTime: 0,
    orderId: '',
    tx: null,
    errorMessage: '',
}


const useDebridgeQuote = ({
                             sellToken,
                             buyToken,
                             sellAmount,
                             destinationAddress,
                         }: quoteParam
) => {
    const {solanaWalletInfo, address} = useContext(Web3AuthContext);
    const enabled =
        !!sellToken && !!buyToken && !!address && !!sellAmount && !!destinationAddress && Number(sellAmount) > 0;

    const fetchDebridgeQuote = useCallback(async () => {
        const quoteResponse = {
            ...defaultQuoteResponse
        }

        try {
            const data = await debridgeService.getQuote({
                srcChainId: sellToken!.chainId,
                srcChainTokenIn: sellToken!.address,
                dstChainId: buyToken!.chainId,
                dstChainTokenOut: buyToken!.address,
                dstChainTokenOutRecipient: destinationAddress,
                senderAddress: sellToken!.chainId === SOLANA_CHAIN_ID ? solanaWalletInfo!.publicKey : address,
                srcChainTokenInAmount: ethers.utils.parseUnits(sellAmount!, sellToken!.decimals).toString(),
            })

            if (data.estimation) {
                const {srcChainTokenIn, dstChainTokenOut} = data.estimation
                quoteResponse.outputAmount = ethers.utils.parseUnits(dstChainTokenOut.amount, buyToken!.decimals).toString()
                quoteResponse.outputUsdAmount = dstChainTokenOut.recommendedApproximateUsdValue ?? dstChainTokenOut.approximateUsdValue!
                quoteResponse.inputUsdAmount = srcChainTokenIn.originApproximateUsdValue ?? dstChainTokenOut.approximateUsdValue!
            }

            if (data.order)
                quoteResponse.estimatedTime = data.order.approximateFulfillmentDelay

            quoteResponse.orderId = data.orderId ?? ''
            quoteResponse.feeAmount = mapDebridgeFeeCosts[sellToken!.chainId] ?? 0

        } catch(error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            quoteResponse.errorMessage = (error as AxiosError)?.response?.data?.errorMessage
        }

        return quoteResponse
    }, [sellToken, buyToken, sellAmount, solanaWalletInfo, address, destinationAddress]);

    const {isLoading, refetch, data} = useQuery<DebridgeQuoteResponse | null>({
        queryKey: ['get-debridge-quote', address, sellToken, solanaWalletInfo, destinationAddress, buyToken, sellAmount],
        queryFn: fetchDebridgeQuote,
        enabled,
        refetchInterval: 40_000,
    });

    return {
        isLoading,
        refetch,
        quoteResponse: data ?? defaultQuoteResponse,
    };
};
export default useDebridgeQuote;
