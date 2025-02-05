import { useCallback, useEffect } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { erc20Abi } from 'viem'
import { useBalance as useWagmiBalance } from 'wagmi';
import { nativeAddress } from '../constants';
import { useContext } from "react";
import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";
import { rpcUrls } from "../config/rpcs.ts";
import { dexfinv3Service } from '../services/dexfin.service.ts';
import useTokenBalanceStore from '../store/useTokenBalanceStore.ts';
import { EvmWalletBalanceResponseType } from '../types/dexfinv3.type.ts';
import { TokenBalance } from '../store/useTokenBalanceStore.ts';

interface IGetBalance {
	address?: string;
	chainId?: number;
	token?: string;
}

interface IEvmWallet {
	address: string;
	chainId: number;
}

const createProviderAndGetBalance = async (rpcUrl: string, address: string, token: string) => {
	try {
		const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

		if (!token) {
			const balance = await provider.getBalance(address);

			return { value: balance, formatted: ethers.utils.formatEther(balance) };
		}

		const contract = new ethers.Contract(getAddress(token), erc20Abi, provider);


		const [balance, decimals] = await Promise.all<[string, number]>([contract.balanceOf(getAddress(address)), contract.decimals()]);

		return { value: balance, formatted: ethers.utils.formatUnits(balance, decimals), decimals };

	} catch (error) {
		return null;
	}
};

export const getBalance = async ({ address, chainId, token }: IGetBalance) => {
	try {
		if (!address || !chainId) {
			return null;
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error

		const urls = Object.values(rpcUrls[chainId] || {});

		if (urls.length === 0) {
			return null;
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error

		return await Promise.any(urls.map((rpcUrl) => createProviderAndGetBalance(rpcUrl, address, token)));
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const useBalance = ({
	chainId,
	token
}: {
	chainId: number | undefined,
	token: string | undefined,
}): UseQueryResult<{
	value: ethers.BigNumber;
	formatted: string;
	decimals?: undefined;
}> => {

	/*
		if (chainId === undefined || token === undefined)
			return {
				isLoading: false,
				isSuccess: false,
				data: {
					value:  ethers.BigNumber.from(0),
					formatted: '0',
				}
			}
	*/

	const { isConnected, address } = useContext(Web3AuthContext);
	const tokenAddress = [ethers.constants.AddressZero, nativeAddress.toLowerCase()].includes(token ? token?.toLowerCase() : '')
		? undefined
		: (token as `0x${string}`);

	const isEnabled = !!(chainId && isConnected && token);


	const wagmiData = useWagmiBalance({
		address: address as `0x${string}`,
		token: tokenAddress,
		chainId: chainId,
		query: {
			enabled: isEnabled,
			gcTime: 10_000
		},
	});

	const queryData = useQuery(
		{
			queryKey: ['balance', address, chainId, token, !(wagmiData.isLoading || wagmiData.data)],
			queryFn: () => getBalance({ address, chainId, token }),
			refetchInterval: 10_000,
			enabled: isEnabled && !wagmiData.isLoading && !wagmiData.data
		}
	);

	// when token is undefined/null, wagmi tries fetch users chain token (for ex :ETH) balance, even though is isEnabled is false
	// so hardcode data to null
	return (
		!isEnabled
			? { isLoading: false, isSuccess: false, data: null }
			: wagmiData.isLoading || wagmiData.data
				? wagmiData
				: queryData
	) as UseQueryResult<{
		value: ethers.BigNumber;
		formatted: string;
		decimals?: undefined;
	}>;
};

export const useEvmWalletBalance = (params?: IEvmWallet) => {

	const { chainId: connectedChainId, address: connectedAddress } = useContext(Web3AuthContext);

	const activeChainId = params?.chainId || connectedChainId + "";
	const activeWalletAddress = params?.address || connectedAddress;

	const enabled = !!activeChainId && !!activeWalletAddress;
	const fetchBalances = useCallback(async () => {
		if (!activeChainId || !activeWalletAddress) {
			return []
		}
		const data = await dexfinv3Service.getEvmWalletBalance({ chainId: Number(activeChainId), address: activeWalletAddress });
		if (data) {
			return data;
		}
		return []
	}, [activeChainId, activeWalletAddress]);

	const { isLoading, refetch, data } = useQuery<EvmWalletBalanceResponseType[]>(
		{
			queryKey: ['balance', activeWalletAddress, activeChainId,],
			queryFn: fetchBalances,
			refetchInterval: 10_000,
			enabled
		}
	);

	useEffect(() => {
		if (data) {
			useTokenBalanceStore.getState().setTokenBalances(data.map((item) => ({
				chain: item.chain,
				address: item.tokenAddress as string,
				symbol: item.symbol,
				name: item.name,
				logo: item.logo,
				balance: item.balance,
				decimals: item.decimals,
				usdPrice: item.usdPrice,
				usdValue: item.usdValue,
			} as unknown as TokenBalance)));
		}
	}, [data]);

	return {
		isLoading,
		refetch,
		data,
	};
};
