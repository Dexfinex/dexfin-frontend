import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { DefillamaPool, DefillamaProtocol, DefillamaChainTVL, DefillamaDexVolume } from "../types";
import { defillamaService } from "../services/defillama.service";
import useDefillamaStore from "../store/useDefillamaStore";

export const useGetDefillamaProtocols = () => {
    const fetchDefillamaProtocols = useCallback(async () => {
        const data = await defillamaService.getProtocols();
        // console.log("defillamaService data------------- : ", data);
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
        Protocolsdata: data,
        error
    };
};

export const useGetDefillamaPools = ({ chainName }: { chainName: string }) => {
    const fetchDefillamaPools = useCallback(async () => {
        const data = await defillamaService.getPools({ chain: chainName });

        return data;
    }, [chainName]);

    const { isLoading, refetch, data, error } = useQuery<DefillamaPool[]>({
        queryKey: [`get-defillama-pools-${chainName}`],
        queryFn: fetchDefillamaPools,
    });

    useEffect(() => {
        if (data) {
            useDefillamaStore.getState().setPools(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        Poolsdata: data,
        error
    };
};
export const useGetChainTVL = () => {
    const fetchChainTVL = useCallback(async () => {
        const data = await defillamaService.getChainTVL();
        // console.log("fetchChainTVL service data: ", data);
        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<DefillamaChainTVL[]>({
        queryKey: ["get-chain-tvl"],
        queryFn: fetchChainTVL,
        refetchInterval: 5 * 60_000, // Refresh every 5 minutes like protocols
    });

    useEffect(() => {
        if (data) {
            useDefillamaStore.getState().setChainTVLs(data);
        }
    }, [data]);

    return {
        isLoading,
        refetch,
        ChainTVLdata: data,
        error
    };
};
export const useGetDexVolume = () => {
    const fetchDexVolume = useCallback(async () => {
        const data = await defillamaService.getDexVolume();
        // console.log("getdex hook : ", data)
        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<DefillamaDexVolume>({
        queryKey: ["get-dex-volume"],
        queryFn: fetchDexVolume,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useDefillamaStore.getState().setDexVolume(data);
        }
    }, [data]);

    return {
        isLoading,
        refetch,
        DexVolume: data,
        error
    };
};
//     const fetchDefillamaPools = useCallback(async () => {

//         return data;
//     }, []);
//     console.log("fetchDefillamaPools123123 : ", fetchDefillamaPools);
//     return;

//     const { isLoading, refetch, data, error } = useQuery<DefillamaPool[]>({
//         queryKey: [`get-defillama-pools-${chainName}`],
//         queryFn: fetchDefillamaPools,
//     });

//     useEffect(() => {
//         if (data) {
//             useDefillamaStore.getState().setPools(data);
//         }
//     }, [data])

//     return {
//         isLoading,
//         refetch,
//         data,
//         error
//     };
// };