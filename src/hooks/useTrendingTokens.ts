import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { dexfinv3Service, } from "../services/dexfin.service.ts";
import useTrendingTokensStore from "../store/useTrendingTokensStore.ts";

export const useTrendingTokens = (chainId: number) => {
    const fetchTokens = useCallback(async () => {
        if (chainId === -1) { // total
            const tokens = useTrendingTokensStore.getState().trendingTokens;
            if (tokens['all'].length > 0) {
                return null;
            } else {
                const data = await dexfinv3Service.getAllTrendingTokens();
                if (data) {
                    return data;
                }
            }
        }

        return null;
    }, [chainId]);

    const { isLoading, refetch, data } = useQuery<any>({
        queryKey: ["trendingTokens", chainId],
        queryFn: fetchTokens
    })

    useEffect(() => {
        if (data) {
            if (chainId == -1) {
                useTrendingTokensStore.getState().setTrendingTokens(data);
            } else {

            }
        }
    }, [data]);

    return {
        isLoading,
        refetch,
        data,
    };
};
