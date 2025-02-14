import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { coingeckoService } from "../services/coingecko.service";
import { Ganiner, Loser, TrendingCoin } from "../types";

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

export const useGetTopGainers = () => {
    const fetchTopGainers = useCallback(async () => {
        const data = await coingeckoService.getTopGainers();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<Ganiner[]>({
        queryKey: [`top-gainers`],
        queryFn: fetchTopGainers,
        refetchInterval: 2 * 60_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};

export const useGetTopLosers = () => {
    const fetchTopGainers = useCallback(async () => {
        const data = await coingeckoService.getTopLosers();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<Loser[]>({
        queryKey: [`top-losers`],
        queryFn: fetchTopGainers,
        refetchInterval: 2 * 60_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};
