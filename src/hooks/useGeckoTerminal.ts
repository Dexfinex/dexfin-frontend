import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { TokenPool } from "../types";

import { geckoterminalService } from "../services/geckoterminal.service";

export const useGetTrendingPools = (network: string = 'eth') => {
    const fetchTrendingPools = useCallback(async () => {
        const data = await geckoterminalService.getTrendingPools(network);

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<TokenPool[]>({
        queryKey: [`get-trending-pools-${network}`],
        queryFn: fetchTrendingPools,
        refetchInterval: 30_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};

export const useGetNewPools = (network: string = 'eth') => {
    const fetchNewPools = useCallback(async () => {
        const data = await geckoterminalService.getNewPools(network);

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<TokenPool[]>({
        queryKey: [`get-new-pools-${network}`],
        queryFn: fetchNewPools,
        refetchInterval: 30_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};

export const useGetTopPools = (network: string = 'eth') => {
    const fetchTopPools = useCallback(async () => {
        const data = await geckoterminalService.getTopPools(network);

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<TokenPool[]>({
        queryKey: [`get-top-pools-${network}`],
        queryFn: fetchTopPools,
        refetchInterval: 30_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};