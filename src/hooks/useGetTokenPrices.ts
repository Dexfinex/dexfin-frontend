import {useQuery} from "@tanstack/react-query";
import {useCallback, useEffect} from "react";
import {coingeckoService} from "../services/coingecko.service";
import useTokenStore from "../store/useTokenStore";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {birdeyeService} from "../services/birdeye.service.ts";
import {solToWSol} from "../utils/solana.util.ts";

interface QuoteParam {
    tokenAddresses: (string | null)[];
    chainId: number | undefined;
}

const useGetTokenPrices = ({ chainId, tokenAddresses }: QuoteParam) => {
    const enabled = chainId !== undefined && !!tokenAddresses && tokenAddresses.length > 0;
    const uniqueTokenAddresses = [...new Set(tokenAddresses.map(address => solToWSol(address!)))].filter(item => item != null)

    const fetchPrices = useCallback(async () => {
        if (chainId === SOLANA_CHAIN_ID) {
            const {data} = await birdeyeService.getMintPrices(uniqueTokenAddresses as (string | null)[]);
            if (data) {
                const resultData: Record<string, string> = {};
                for (const address of Object.keys(data)) {
                    resultData[`${chainId}:${address.toLowerCase()}`] = data[address].value?.toString();
                }
                return resultData;
            }
        } else {
            const data = await coingeckoService.getTokenPrices(chainId!, uniqueTokenAddresses as (string | null)[]);
            if (data) {
                const resultData: Record<string, string> = {};
                for (const address of Object.keys(data)) {
                    resultData[`${chainId}:${address.toLowerCase()}`] = data[address];
                }
                return resultData;
            }
        }

        return {};
    }, [uniqueTokenAddresses, chainId]);

    const { isLoading, refetch, data } = useQuery<Record<string, string>>({
        queryKey: ["get-token-price", uniqueTokenAddresses, chainId],
        queryFn: fetchPrices,
        enabled,
        refetchInterval: 20_000,
    });

    useEffect(() => {
        if (data) {
            useTokenStore.getState().setTokenPrices(data);
        }
    }, [data]);

    return {
        isLoading,
        refetch,
        data,
    };
};

export default useGetTokenPrices;
