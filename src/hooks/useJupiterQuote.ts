import {useQuery} from '@tanstack/react-query';
import {TokenType} from "../types/swap.type.ts";
import {solToWSol} from "../utils/solana.util.ts";
import {useContext} from "react";
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import Decimal from "decimal.js";

interface quoteParam {
    sellToken: TokenType | null,
    buyToken: TokenType | null,
    sellAmount: string | undefined,
    slippage: number,
}

const useJupiterQuote = ({
                             sellToken,
                             buyToken,
                             sellAmount,
                             slippage,
                         }: quoteParam
) => {
    const {solanaWalletInfo} = useContext(Web3AuthContext);

    const enabled =
        !!sellToken && !!buyToken && !!solanaWalletInfo && !!sellAmount && Number(sellAmount) > 0;
    const amount = sellAmount ? new Decimal(sellAmount).mul(10 ** ((sellToken?.decimals) ?? 0)).toString() : '0'
    const slippageBps = slippage * 100

    const {isLoading, refetch, data} = useQuery({
        queryKey: ['get-jupiter-quote', sellToken, buyToken, sellAmount],
        queryFn: async () => {
            // Construct the query URL with the parameters
            const url = `https://quote-api.jup.ag/v6/quote?inputMint=${solToWSol(sellToken?.address)}&outputMint=${solToWSol(buyToken?.address)}&amount=${amount}&slippageBps=${slippageBps}&swapMode=ExactIn&onlyDirectRoutes=true`

            // Make the API call
            const response = await fetch(url)

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch jupiter quote')
            }

            return await response.json()
        },
        enabled,
        refetchInterval: 60_000,
    });

    const decimals = buyToken?.decimals ?? 0
    const formattedOutputAmount = (data && data.outAmount) ? (new Decimal(data.outAmount).div(10 ** (decimals)).toFixed((decimals))) : 0

    return {
        isLoading,
        refetch,
        data: {
            ...data,
            exchangeRate: Number(sellAmount) > 0 ? Number(formattedOutputAmount) / Number(sellAmount) : 0,
            formattedOutputAmount,
        },

    };
};
export default useJupiterQuote;
