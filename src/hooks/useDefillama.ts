import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { DefillamaPool, DefillamaProtocol } from "../types";
import { defillamaService } from "../services/defillama.service";
import useDefillamaStore from "../store/useDefillamaStore";

export const useGetDefillamaProtocols = () => {
    const fetchDefillamaProtocols = useCallback(async () => {
        const data = await defillamaService.getProtocols();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<DefillamaProtocol[]>({
        queryKey: ["get-defillama-protocols"],
        queryFn: fetchDefillamaProtocols,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useDefillamaStore.getState().setProtocols(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        data,
        error
    };
};

export const useGetDefillamaPools = () => {
    const fetchDefillamaPools = useCallback(async () => {
        const data = await defillamaService.getPools();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<DefillamaPool[]>({
        queryKey: ["get-defillama-pools"],
        queryFn: fetchDefillamaPools,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useDefillamaStore.getState().setPools(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        data,
        error
    };
};