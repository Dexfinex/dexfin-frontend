import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { dexfinv3Service } from "../services/dexfin.service";
import { EvmDefiPosition } from "../types/dexfinv3.type";
import useDefiStore from "../store/useDefiStore";

export const useDefiPositionByWallet = ({ chainId, walletAddress }: { chainId: number | undefined, walletAddress: string }) => {
    const fetchDefiPositionByWallet = useCallback(async () => {
        if (!chainId || !walletAddress) {
            return [];
        }
        const data = await dexfinv3Service.getEvmDeifPositionByWallet(chainId, walletAddress);

        return data;
    }, [chainId, walletAddress]);

    const { isLoading, refetch, data, error } = useQuery<EvmDefiPosition[]>({
        queryKey: [`get-defi-position-${chainId}-${walletAddress}`],
        queryFn: fetchDefiPositionByWallet,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useDefiStore.getState().setPositions(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        data,
        error
    };
};