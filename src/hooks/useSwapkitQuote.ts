import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {SlippageOption, TokenType} from "../types/swap.type.ts";
import {swapkitService} from "../services/swapkit.service.ts";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {ChainflipMeta, DepositInfo, SwapkitFinalizedQuoteResponse, Warning} from "../types/bridge.type.ts";
import {formatNumberByFrac} from "../utils/common.util.ts";
import {AxiosError} from "axios";

interface quoteParam {
    sellToken: TokenType | null,
    buyToken: TokenType | null,
    sellAmount: string | undefined,
    destinationAddress: string | undefined,
    slippage: SlippageOption
}

const defaultQuoteResponse = {
    providerName: '',
    expectedBuyAmount: '0',
    expectedBuyAmountMaxSlippage: '0',
    feeInUsd: 0,
    formattedFeeInUsd: '0',
    estimatedTime: 0,
    warnings: [] as Warning[],
    tx: null,
    chainflip: null as (ChainflipMeta | null),
    errorMessage: '',
    depositInfo: null as (null | DepositInfo)
}


const useSwapkitQuote = ({
                             sellToken,
                             buyToken,
                             sellAmount,
                             destinationAddress,
                             slippage,
                         }: quoteParam
) => {
    const {solanaWalletInfo, address} = useContext(Web3AuthContext);
    const enabled =
        !!sellToken && !!buyToken && !!address && !!sellAmount && !!destinationAddress && Number(sellAmount) > 0;

    const fetchSwapkitQuote = useCallback(async () => {
        const quoteResponse = {
            ...defaultQuoteResponse
        }

        try {
            const data = await swapkitService.getQuote({
                sellChainId: sellToken!.chainId,
                sellTokenAddress: sellToken!.address,
                buyChainId: buyToken!.chainId,
                buyTokenAddress: buyToken!.address,
                sellAmount: sellAmount!,
                sourceAddress: sellToken!.chainId === SOLANA_CHAIN_ID ? solanaWalletInfo!.publicKey : address,
                destinationAddress: destinationAddress!,
                slippage,
                includeTx: true,
            })

            if (data) {
                if (data.routes.length > 0) {
                    const bestRoute = data.routes[0]

                    // set provider name: CHAINFLIP / MAYACHAIN
                    quoteResponse.providerName = bestRoute.providers?.[0]

                    quoteResponse.tx = bestRoute.tx ?? null

                    quoteResponse.expectedBuyAmount = bestRoute.expectedBuyAmount
                    quoteResponse.expectedBuyAmountMaxSlippage = bestRoute.expectedBuyAmountMaxSlippage
                    quoteResponse.estimatedTime = bestRoute.estimatedTime.total
                    quoteResponse.warnings = bestRoute.warnings
                    quoteResponse.chainflip = bestRoute.meta.chainflip ?? null

                    // calculate fee
                    const mapAssetToPrice: Record<string, number> = {}
                    for(const asset of bestRoute.meta.assets) {
                        mapAssetToPrice[asset.asset] = asset.price
                    }

                    quoteResponse.feeInUsd = bestRoute.fees.reduce((sum, feeItem) => {
                        sum += (mapAssetToPrice[feeItem.asset] ?? 0) * Number(feeItem.amount)
                        return sum
                    }, 0)
                    quoteResponse.formattedFeeInUsd = formatNumberByFrac(quoteResponse.feeInUsd, 5)


                    try {
                        if (quoteResponse.providerName === "CHAINFLIP" && quoteResponse.chainflip) {
                            quoteResponse.depositInfo = await swapkitService.getBrokerChannel(quoteResponse.chainflip)
                        }
                    } catch (e) {
                        //
                    }

                } else if (data.providerErrors.length > 0) {
                    quoteResponse.errorMessage = data.providerErrors[0].errorCode
                }
            }
        } catch(error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            quoteResponse.errorMessage = (error as AxiosError)?.response?.data?.message
        }

        return quoteResponse
    }, [sellToken, buyToken, sellAmount, solanaWalletInfo, address, destinationAddress, slippage]);

    const {isLoading, refetch, data} = useQuery<SwapkitFinalizedQuoteResponse | null>({
        queryKey: ['get-swapkit-quote', address, sellToken, solanaWalletInfo, destinationAddress, buyToken, sellAmount, slippage],
        queryFn: fetchSwapkitQuote,
        enabled,
        refetchInterval: 60_000,
    });

    return {
        isLoading,
        refetch,
        quoteResponse: data ?? defaultQuoteResponse,
    };
};
export default useSwapkitQuote;
