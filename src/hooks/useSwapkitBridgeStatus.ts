import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {swapkitService} from "../services/swapkit.service.ts";
import {SwapkitTrackStatusType} from "../types/bridge.type.ts";

const useSwapkitBridgeStatus = (chainId: number | undefined, tradeHash: string | undefined) => {
    const {address} = useContext(Web3AuthContext);
    const enabled = !!address && !!chainId && !!tradeHash && tradeHash?.length > 0;

    const fetchStatus = useCallback(async () => {
        return await swapkitService.getTrackHash(chainId!, tradeHash ?? '')
    }, [chainId, tradeHash]);

    const {isLoading, refetch, data} = useQuery<SwapkitTrackStatusType | null>({
        queryKey: ['get-swapkit-quote', address, chainId, tradeHash],
        queryFn: fetchStatus,
        enabled,
        refetchInterval: 3000,
    });

    const trackingStatus = (data as SwapkitTrackStatusType).trackingStatus

    return {
        isLoading: isLoading || (!!trackingStatus && trackingStatus !== 'completed'),
        refetch,
        trackingStatus,
    };
};
export default useSwapkitBridgeStatus;
