import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { fearGreedService } from "../services/feargreed.service";
import useFearGreedStore from "../store/useFearGreedStore";

import { FearGreedData } from "../services/feargreed.service";

export const useGetFearGreed = () => {
    const fetchFetchGreed = useCallback(async () => {
        const data = await fearGreedService.getFearGreedIndex();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<FearGreedData>({
        queryKey: ["get-fear-greed"],
        queryFn: fetchFetchGreed,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useFearGreedStore.getState().setData(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        data,
        error
    };
};