import {useContext} from 'react';
import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {ethers} from 'ethers';
import {useBalance as useWagmiBalance} from 'wagmi';
import {nativeAddress} from '../constants';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";
import {getBalance} from "./useBalance.tsx";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import type {SolanaWalletInfoType} from "../types/auth.ts";
import {getSolanaBalance} from "./useSolanaBalance.tsx";


const getAllBalance = async (
    address: string,
    solanaWalletInfo: SolanaWalletInfoType | undefined,
    tokenOrMintAddress: string,
    chainId: number) => {

	if (chainId === SOLANA_CHAIN_ID) {
		return await getSolanaBalance({publicKey: solanaWalletInfo!.publicKey, mintAddress: tokenOrMintAddress});
	}

	return await getBalance({
		address,
		chainId,
		token: tokenOrMintAddress
	})
}

export const useAllBalance = ({
                                  chainId,
                                  tokenOrMintAddress
                              }: {
    chainId: number | undefined,
    tokenOrMintAddress: string | undefined,
}): UseQueryResult<any> => {

    const {isConnected, address, solanaWalletInfo} = useContext(Web3AuthContext);
    const nativeTokenAddress = [ethers.constants.AddressZero, nativeAddress.toLowerCase()].includes(tokenOrMintAddress ? tokenOrMintAddress?.toLowerCase() : '')
        ? undefined
        : (tokenOrMintAddress as `0x${string}`);

    const isEvmEnabled = !!(chainId !== SOLANA_CHAIN_ID && isConnected && tokenOrMintAddress);
    const isEnabled = !!(chainId && isConnected && tokenOrMintAddress);

    const wagmiData = useWagmiBalance({
        address: address as `0x${string}`,
        token: nativeTokenAddress,
        chainId: chainId,
        query: {
            enabled: isEvmEnabled,
            gcTime: 10_000
        },
    });

    const queryData = useQuery(
        {
            queryKey: ['get-all-balance', address, chainId, tokenOrMintAddress],
            queryFn: () => getAllBalance(address, solanaWalletInfo, tokenOrMintAddress!, chainId!),
            refetchInterval: 10_000,
            enabled: isEnabled && !wagmiData.isLoading && !wagmiData.data
        }
    );

    // when token is undefined/null, wagmi tries fetch users chain token (for ex :ETH) balance, even though is isEnabled is false
    // so hardcode data to null
    return (
        !isEnabled
            ? {isLoading: false, isSuccess: false, data: null}
            : wagmiData.isLoading || wagmiData.data
                ? wagmiData
                : queryData
    ) as UseQueryResult<any>;
};
