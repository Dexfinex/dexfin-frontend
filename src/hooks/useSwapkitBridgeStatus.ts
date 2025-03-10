import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {swapkitService} from "../services/swapkit.service.ts";
import {SwapkitTrackStatusType} from "../types/bridge.type.ts";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";

const useSwapkitBridgeStatus = (chainId: number | undefined, tradeHash: string | undefined) => {
    const {address} = useContext(Web3AuthContext);
    const enabled = !!address && !!chainId && !!tradeHash && tradeHash?.length > 0;

    const fetchStatus = useCallback(async () => {
        return await swapkitService.getTrackHash(chainId! === SOLANA_CHAIN_ID ? 'solana' : chainId!.toString(), tradeHash ?? '')
    }, [chainId, tradeHash]);

    const {isLoading, refetch, data} = useQuery<SwapkitTrackStatusType | null>({
        queryKey: ['get-swapkit-quote', address, chainId, tradeHash],
        queryFn: fetchStatus,
        enabled,
        refetchInterval: 4000,
    });

    let trackingStatus = ''
    let completionHash = ''

    if (data) {
        const statusData = data as SwapkitTrackStatusType
        trackingStatus = statusData.trackingStatus
        const latestLeg = statusData.legs[statusData.legs.length - 1]
        completionHash = latestLeg?.hash ?? ''
    }

    return {
        isLoading: isLoading || (!!trackingStatus && trackingStatus !== 'completed'),
        completionHash,
        refetch,
        trackingStatus,
    };
};
export default useSwapkitBridgeStatus;
