import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { coingeckoService } from "../services/coingecko.service";
import { TrendingCoin } from "../types";

export const useGetTrendingCoins = () => {
    const fetchTrendingMarket = useCallback(async () => {
        const data = await coingeckoService.getTrendingCoins();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<TrendingCoin[]>({
        queryKey: [`tending-coins`],
        queryFn: fetchTrendingMarket,
        refetchInterval: 2 * 60_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};
