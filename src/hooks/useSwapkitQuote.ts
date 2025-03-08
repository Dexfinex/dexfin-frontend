import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {SlippageOption, TokenType} from "../types/swap.type.ts";
import {swapkitService} from "../services/swapkit.service.ts";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {ChainflipMeta, SwapkitQuoteResponse, Warning} from "../types/bridge.type.ts";

interface quoteParam {
    sellToken: TokenType | null,
    buyToken: TokenType | null,
    sellAmount: string | undefined,
    destinationAddress: string | undefined,
    slippage: SlippageOption
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
        return await swapkitService.getQuote({
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
    }, [sellToken, buyToken, sellAmount, solanaWalletInfo, address, destinationAddress, slippage]);

    const {isLoading, refetch, data} = useQuery<SwapkitQuoteResponse | null>({
        queryKey: ['get-swapkit-quote', address, sellToken, solanaWalletInfo, destinationAddress, buyToken, sellAmount, slippage],
        queryFn: fetchSwapkitQuote,
        enabled,
        refetchInterval: 60_000,
    });

    const quoteResponse = {
        providerName: '',
        expectedBuyAmount: '0',
        expectedBuyAmountMaxSlippage: '0',
        feeInUsd: 0,
        estimatedTime: 0,
        warnings: [] as Warning[],
        tx: null,
        chainflip: null as (ChainflipMeta | null),
        errorMessage: '',
    }

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
        } else if (data.providerErrors.length > 0) {
            quoteResponse.errorMessage = data.providerErrors[0].errorCode
        }
    }

    return {
        isLoading,
        refetch,
        quoteResponse,
    };
};
export default useSwapkitQuote;
