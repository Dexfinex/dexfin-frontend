import {useQuery} from '@tanstack/react-query';
import {ethers} from 'ethers';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {GaslessQuoteResponse, QuoteDataType, QuoteResponse, TokenType} from "../types/swap.type.ts";
import {zeroxService} from "../services/0x.service.ts";
import {formatUnits} from "ethers/lib/utils";
import {isNativeTokenAddress} from "../utils/common.util.ts";

interface quoteParam {
    sellToken: TokenType | null,
    buyToken: TokenType | null,
    sellAmount: string | undefined,
    toAddress: string | undefined,

}

const useSwapkitQuote = ({
                        sellToken,
                        buyToken,
                        sellAmount,
                    }: quoteParam
) => {
    const {chainId, address, provider} = useContext(Web3AuthContext);
    const enabled =
        !!sellToken && !!buyToken && !!address && !!provider && !!sellAmount && Number(sellAmount) > 0;
    const isGasLess = !isNativeTokenAddress(chainId!, sellToken?.address ?? '')

    const formatTax = (taxBps: string) => (parseFloat(taxBps) / 100).toFixed(2)

    const fetch0xQuote = useCallback(async () => {
        return await zeroxService.getQuote({
            chainId: sellToken!.chainId,
            sellTokenAddress: sellToken!.address,
            buyTokenAddress: buyToken!.address,
            sellTokenAmount: ethers.utils.parseUnits(sellAmount!, sellToken!.decimals).toString(),
            takerAddress: address,
            isGasLess
        })
    }, [sellToken, buyToken, sellAmount, address, isGasLess]);

    const {isLoading, refetch, data} = useQuery<QuoteResponse | GaslessQuoteResponse>({
        queryKey: ['get-0x-quote', address, sellToken, buyToken, sellAmount],
        queryFn: fetch0xQuote,
        enabled,
        refetchInterval: 30_000,
    });

    const buyAmount = (data && data.buyAmount) ? Number(formatUnits(data.buyAmount, buyToken!.decimals)) : 0

    return {
        isLoading,
        isGasLess,
        refetch,
        quoteResponse: data as (QuoteResponse | GaslessQuoteResponse),
        data:(data ? {
            buyAmount,
            exchangeRate: Number(sellAmount) > 0 ? buyAmount / Number(sellAmount) : 0,
            affiliateFee: data.fees && data.fees.integratorFee && data.fees.integratorFee.amount
                ? Number(
                    formatUnits(
                        BigInt(data.fees.integratorFee.amount),
                        buyToken!.decimals
                    )
                ) : null,
            buyTax: data.tokenMetadata?.buyToken?.buyTaxBps && data.tokenMetadata?.buyToken?.buyTaxBps !== "0"
                ? formatTax(
                    data.tokenMetadata?.buyToken?.buyTaxBps
                ) : null,
            sellTax: data.tokenMetadata?.sellToken?.sellTaxBps && data.tokenMetadata?.sellToken?.sellTaxBps !== "0"
                ? formatTax(
                    data.tokenMetadata?.sellToken?.sellTaxBps
                ) : null,
            tokenApprovalRequired: data.issues?.allowance != null,
            gaslessApprovalAvailable :  (data as GaslessQuoteResponse)?.approval != null,
            spenderAddress: data.issues?.allowance?.spender ?? '',
        } as QuoteDataType : null),
    };
};
export default useSwapkitQuote;
