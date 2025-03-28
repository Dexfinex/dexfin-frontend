import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {DebridgeTransaction, TokenType} from "../types/swap.type.ts";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {DebridgeQuoteResponse} from "../types/bridge.type.ts";
import {AxiosError} from "axios";
import {debridgeService} from "../services/debridge.service.ts";
import {ethers} from "ethers";
import {mapDebridgeFeeCosts} from "../constants/debridge.constants.ts";
import {getCorrectTokenAddressForBridging} from "../utils/swap.util.ts";

interface quoteParam {
    sellToken: TokenType | null,
    buyToken: TokenType | null,
    sellAmount: string | undefined,
    destinationAddress: string | null,
}

const defaultQuoteResponse = {
    solverGasCosts: 0,
    inputUsdAmount: 0,
    outputUsdAmount: 0,
    outputAmount: '0',
    feeAmount: 0,
    estimatedTime: 0,
    orderId: '',
    tx: null as (null | DebridgeTransaction),
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

    const defaultDestinationAddress = buyToken?.chainId === SOLANA_CHAIN_ID ? solanaWalletInfo?.publicKey : address
    const dstAddress = destinationAddress !== null ? destinationAddress : defaultDestinationAddress

    const enabled =
        !!sellToken && !!buyToken && !!address && !!sellAmount && !!dstAddress && Number(sellAmount) > 0;

    const fetchDebridgeQuote = useCallback(async () => {
        const quoteResponse = {
            ...defaultQuoteResponse
        }

        try {
            const data = await debridgeService.getQuote({
                srcChainId: sellToken!.chainId,
                srcChainTokenIn: getCorrectTokenAddressForBridging(sellToken!.address, sellToken!.chainId),
                dstChainId: buyToken!.chainId,
                dstChainTokenOut: getCorrectTokenAddressForBridging(buyToken!.address, buyToken!.chainId),
                dstChainTokenOutRecipient: dstAddress,
                senderAddress: sellToken!.chainId === SOLANA_CHAIN_ID ? solanaWalletInfo!.publicKey : address,
                srcChainTokenInAmount: ethers.utils.parseUnits(sellAmount!, sellToken!.decimals).toString(),
            })

            if (data.estimation) {
                const {srcChainTokenIn, dstChainTokenOut} = data.estimation
                quoteResponse.outputAmount = ethers.utils.formatUnits(dstChainTokenOut.amount, buyToken!.decimals).toString()
                quoteResponse.outputUsdAmount = dstChainTokenOut.recommendedApproximateUsdValue ?? dstChainTokenOut.approximateUsdValue!
                quoteResponse.inputUsdAmount = srcChainTokenIn.originApproximateUsdValue ?? dstChainTokenOut.approximateUsdValue!
            }

            if (data.order)
                quoteResponse.estimatedTime = data.order.approximateFulfillmentDelay

            if (data.prependedOperatingExpenseCost) {
                quoteResponse.solverGasCosts = Number(ethers.utils.formatUnits(data.prependedOperatingExpenseCost, sellToken!.decimals))
            }

            quoteResponse.orderId = data.orderId ?? ''
            quoteResponse.feeAmount = mapDebridgeFeeCosts[sellToken!.chainId] ?? 0
            quoteResponse.tx = data.tx
        } catch(error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            quoteResponse.errorMessage = (error as AxiosError)?.response?.data?.errorMessage
            if (quoteResponse.errorMessage.indexOf('Amount less') >= 0) {
                quoteResponse.errorMessage = "Input Amount is Too Small"
            }
        }

        return quoteResponse
    }, [sellToken, buyToken, sellAmount, solanaWalletInfo, address, dstAddress]);

    const {isLoading, refetch, data} = useQuery<DebridgeQuoteResponse | null>({
        queryKey: ['get-debridge-quote', address, sellToken, solanaWalletInfo, dstAddress, buyToken, sellAmount],
        queryFn: fetchDebridgeQuote,
        enabled,
        refetchInterval: 40_000,
    });

    const errorMessage = !dstAddress ? 'Please Input Destination Address' : ''

    return {
        isLoading,
        refetch,
        targetDestinationAddress: dstAddress,
        quoteResponse: data ?? {
            ...defaultQuoteResponse,
            errorMessage,
        },
    };
};
export default useDebridgeQuote;
