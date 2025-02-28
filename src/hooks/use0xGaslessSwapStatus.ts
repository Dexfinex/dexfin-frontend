import {useQuery} from '@tanstack/react-query';
import {useCallback, useContext} from 'react';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {ZeroxGaslessStatusResponseType} from "../types/swap.type.ts";
import {zeroxService} from "../services/0x.service.ts";

const use0xGaslessSwapStatus = (tradeHash: string | undefined) => {
    const {address, chainId} = useContext(Web3AuthContext);
    const enabled = !!address && !!chainId && !!tradeHash && tradeHash?.length > 0;

    const fetchStatus = useCallback(async () => {
        return await zeroxService.getStatusOfGaslessSwap({
            chainId: chainId as number,
            tradeHash: tradeHash ?? '',
        })
    }, [chainId, tradeHash]);

    const {isLoading, refetch, data} = useQuery<ZeroxGaslessStatusResponseType>({
        queryKey: ['get-0x-quote', address, chainId, tradeHash],
        queryFn: fetchStatus,
        enabled,
        refetchInterval: 3000,
    });

    const gaslessStatusResponse = (data as ZeroxGaslessStatusResponseType)
    const status = gaslessStatusResponse?.status
    const hash = gaslessStatusResponse?.transactions?.[0].hash

    return {
        isLoading: isLoading || (!!status && status !== 'confirmed'),
        hash,
        refetch,
        status,
    };
};
export default use0xGaslessSwapStatus;
