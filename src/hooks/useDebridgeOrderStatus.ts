import {useQuery} from '@tanstack/react-query';
import {useCallback} from 'react';
import {debridgeService} from "../services/debridge.service.ts";
import {DebridgeOrderStatus, DebridgeTrackResponseType} from "../types/swap.type.ts";

const useDebridgeOrderStatus = (orderId: string) => {
    const enabled = !!orderId;

    const fetchStatus = useCallback(async () => {
        return await debridgeService.getTrackHash(orderId)
    }, [orderId]);

    const {isLoading, refetch, data} = useQuery<DebridgeTrackResponseType | null>({
        queryKey: ['get-debridge-quote', orderId],
        queryFn: fetchStatus,
        enabled,
        refetchInterval: 4000,
    });

    let orderStatus = ''
    let completionHash = ''

    if (data) {
        const statusData = data as DebridgeTrackResponseType
        orderStatus = statusData.state
        completionHash = statusData.fulfilledDstEventMetadata?.transactionHash?.stringValue ?? ''
    }

    return {
        isLoading: isLoading || (!!orderStatus && orderStatus !== DebridgeOrderStatus.Fulfilled),
        completionHash,
        refetch,
        orderStatus,
    };
};
export default useDebridgeOrderStatus;
