import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { dexfinv3Service } from "../services/dexfin.service";
import { EvmDefiPosition, EvmDefiProtocol } from "../types/dexfinv3.type";
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

export const useDefiProtocolsByWallet = ({ chainId, walletAddress }: { chainId: number | undefined, walletAddress: string }) => {
    const fetchDefiProtocolsByWallet = useCallback(async () => {
        if (!chainId || !walletAddress) {
            return {
                active_protocols: 0,
                total_positions: 0,
                total_usd_value: 0,
                total_unclaimed_usd_value: 0,
                protocols: [],
            };
        }
        const data = await dexfinv3Service.getEvmDeifProtocolsByWallet(chainId, walletAddress);

        return data;
    }, [chainId, walletAddress]);

    const { isLoading, refetch, data, error } = useQuery<EvmDefiProtocol>({
        queryKey: [`get-defi-protocol-${chainId}-${walletAddress}`],
        queryFn: fetchDefiProtocolsByWallet,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useDefiStore.getState().setProtocol(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        data,
        error
    };
};