import { useCallback, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";
import { dexfinv3Service, } from "../services/dexfin.service.ts";
import useActivitiesStore from "../store/useActivitiesStore.ts";
import { WalletActivityType } from "../types/dexfinv3.type.ts";

export const useActivities = ({
    evmAddress,
    solanaAddress,
}: {
    evmAddress: string;
    solanaAddress: string;
}) => {
    const { isConnected } = useContext(Web3AuthContext);

    const fetchActivities = useCallback(async () => {
        if (!evmAddress && !solanaAddress) {
            return [];
        }
        const data = await dexfinv3Service.getAllActivities(evmAddress, solanaAddress);
        if (data) {
            return data;
        }

        return [];
    }, [evmAddress, solanaAddress]);

    const { isLoading, refetch, data } = useQuery<WalletActivityType[]>({
        queryKey: ["activities", evmAddress, solanaAddress],
        queryFn: fetchActivities,
        refetchInterval: 10_000,
        enabled: isConnected
    })

    useEffect(() => {
        if (data) {
            useActivitiesStore.getState().setActivities(data);
        }
    }, [data]);

    return {
        isLoading,
        refetch,
        data,
    };
};
