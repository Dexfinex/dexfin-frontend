// import { erc20Abi } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import {useCallback, useContext} from 'react';
import {defaultGasLimit, defaultMaxPriorityFee, mapRpcUrls} from '../constants';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";

const useGasEstimation = (chainId: number | undefined) => {
  const { address, provider } = useContext(Web3AuthContext);
  const enabled = !!address && !!provider

  const fetchGasEstimate = useCallback(async (chainId: number | undefined) => {
    try {

      const gasProvider = (chainId && mapRpcUrls[chainId]) ? (new ethers.providers.JsonRpcProvider(mapRpcUrls[chainId])) : provider

      // Fetch Current Gas Price
      const gasPriceData = await gasProvider!.getFeeData();

      const estimatedGasPrice = (gasPriceData.gasPrice?.toBigInt() ?? 0n) + defaultMaxPriorityFee.toBigInt();

      // I used defaultGasLimit instead of estimatedGasLimit, because it's testnet
      const estimatedGasCost = defaultGasLimit * estimatedGasPrice;

      // Fetch Native Balance of From Address
      const nativeBalance =
        (await gasProvider?.getBalance(address as string))?.toBigInt() ?? 0n;

      // Check if the native balance is sufficient to cover the gas cost
      const hasSufficientNativeBalance = nativeBalance > estimatedGasCost;

      return {
        gasLimit: defaultGasLimit, // estimatedGasLimit,
        gasPrice: estimatedGasPrice,
        gasEstimate: Number(ethers.utils.formatEther(estimatedGasCost)),
        hasSufficientNativeBalance,
      };
    } catch (e) {
      console.error('gas estimation error', e);
    }

    return null;
  }, [address, provider]);


  const { isLoading, refetch, data } = useQuery({
    queryKey: ['get-transaction-estimation', address, chainId],
    queryFn: async () => await fetchGasEstimate(chainId),
    enabled,
    refetchInterval: 3_000,
  });

  return {
    isLoading: isLoading || !data,
    refetch,
    data: data ?? {
      gasEstimate: 0,
      gasPrice: 0n,
      hasSufficientNativeBalance: true,
      gasLimit: defaultGasLimit,
    },
  };
};

export default useGasEstimation;
