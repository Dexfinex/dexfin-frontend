import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from "react";

import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";
import { dexfinv3Service } from '../services/dexfin.service.ts';
import { Transfer } from '../types/wallet.type.ts';
import useTokenTransferStore from '../store/useTokenTransferStore.ts';

export const useEvmWalletTransfer = () => {

    const { chainId: connectedChainId, address: connectedAddress } = useContext(Web3AuthContext);

    const activeChainId = connectedChainId;
    const activeWalletAddress = connectedAddress;
    // const activeWalletAddress = "0x2b5634c42055806a59e9107ed44d43c426e58258";

    const enabled = !!activeChainId && !!activeWalletAddress;
    const fetchTransfer = useCallback(async () => {
        if (!activeChainId || !activeWalletAddress) {
            return []
        }
        const data = await dexfinv3Service.getEvmWalletTransfer({ chainId: Number(activeChainId), address: activeWalletAddress });
        if (data) {
            return data;
        }
        return []
    }, [activeChainId, activeWalletAddress]);

    const { isLoading, refetch, data } = useQuery<Transfer[]>(
        {
            queryKey: ['transfer', activeWalletAddress, activeChainId,],
            queryFn: fetchTransfer,
            refetchInterval: 10_000,
            enabled
        }
    );

    useEffect(() => {
        if (data) {
            useTokenTransferStore.getState().setTransfers(data);
        }
    }, [data]);

    return {
        isLoading,
        refetch,
        data,
    };
};
