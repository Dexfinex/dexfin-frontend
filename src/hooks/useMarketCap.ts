import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { coingeckoService } from "../services/coingecko.service";
import { MarketCapToken } from "../components/market/MarketCap";

export const useGetMarketCapByPage = (page: number) => {
    const fetchMarketCap = useCallback(async () => {
        const data = await coingeckoService.getMarketCap(page);

        return data;
    }, [page]);

    const { isLoading, refetch, data, error } = useQuery<MarketCapToken[]>({
        queryKey: [`market-cap-${page}`],
        queryFn: fetchMarketCap,
        refetchInterval: 2 * 60_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};
