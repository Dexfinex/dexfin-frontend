import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { dexfinv3Service } from "../services/dexfin.service";
import { EvmDefiPosition } from "../types/dexfinv3.type";

export const useDefiPositionByWallet = ({ chainId, walletAddress }: { chainId: number, walletAddress: string }) => {
    const fetchDefiPositionByWallet = useCallback(async () => {
        const data = await dexfinv3Service.getEvmDeifPositionByWallet(chainId, walletAddress);

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<EvmDefiPosition[]>({
        queryKey: [`get-defi-position-${chainId}-${walletAddress}`],
        queryFn: fetchDefiPositionByWallet,
        refetchInterval: 5 * 60_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};