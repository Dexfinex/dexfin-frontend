// import { erc20Abi } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import {useCallback, useContext} from 'react';
import { defaultGasLimit, defaultMaxPriorityFee } from '../constants';
import {Web3AuthContext} from "../providers/Web3AuthContext.tsx";

const useGasEstimation = () => {
  const { address, provider } = useContext(Web3AuthContext);
  const enabled = !!address && !!provider

  const fetchGasEstimate = useCallback(async () => {
    try {
/*
      const tokenContract = new ethers.Contract(
        tokenAddress as string,
        erc20Abi,
        provider,
      );
*/

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // const decimals = await tokenContract.decimals() as number;
      // const amountValue = ethers.utils.parseUnits(amount.toString(), decimals);
/*
      const tx = {
        to: toAddress,
        data: tokenContract.interface.encodeFunctionData('transfer', [
          toAddress,
          amountValue,
        ]),
        gasLimit: defaultGasLimit, // Example static gas limit
      };
*/
      // Fetch Current Gas Price
      const gasPriceData = await provider!.getFeeData();
      // console.log('gasPriceData', gasPriceData);
      // const estimatedGasLimit = (await provider?.estimateGas(tx)) ?? 0n;
      // console.log('estimatedGasLimit', estimatedGasLimit);

      const estimatedGasPrice = (gasPriceData.gasPrice?.toBigInt() ?? 0n) + defaultMaxPriorityFee.toBigInt();

      // I used defaultGasLimit instead of estimatedGasLimit, because it's testnet
      const estimatedGasCost = defaultGasLimit * estimatedGasPrice;

      // Fetch Native Balance of From Address
      const nativeBalance =
        (await provider?.getBalance(address as string))?.toBigInt() ?? 0n;

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
    queryKey: ['get-transaction-estimation', address],
    queryFn: fetchGasEstimate,
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
/*
const useGasEstimation = (
  tokenAddress: string | undefined,
  toAddress: string | undefined,
  amount: number,
) => {
  const { address, provider } = useContext(Web3AuthContext);
  const enabled =
    !!tokenAddress && !!toAddress && !!address && !!provider && amount > 0;

  const fetchGasEstimate = useCallback(async () => {
    try {
/!*
      const tokenContract = new ethers.Contract(
        tokenAddress as string,
        erc20Abi,
        provider,
      );
*!/

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // const decimals = await tokenContract.decimals() as number;
      // const amountValue = ethers.utils.parseUnits(amount.toString(), decimals);
/!*
      const tx = {
        to: toAddress,
        data: tokenContract.interface.encodeFunctionData('transfer', [
          toAddress,
          amountValue,
        ]),
        gasLimit: defaultGasLimit, // Example static gas limit
      };
*!/
      // Fetch Current Gas Price
      const gasPriceData = await provider!.getFeeData();
      // console.log('gasPriceData', gasPriceData);
      // const estimatedGasLimit = (await provider?.estimateGas(tx)) ?? 0n;
      // console.log('estimatedGasLimit', estimatedGasLimit);

      const estimatedGasPrice = (gasPriceData.gasPrice?.toBigInt() ?? 0n) + defaultMaxPriorityFee.toBigInt();

      // I used defaultGasLimit instead of estimatedGasLimit, because it's testnet
      const estimatedGasCost = defaultGasLimit * estimatedGasPrice;

      // Fetch Native Balance of From Address
      const nativeBalance =
        (await provider?.getBalance(address as string))?.toBigInt() ?? 0n;

      // Check if the native balance is sufficient to cover the gas cost
      const hasSufficientNativeBalance = nativeBalance > estimatedGasCost;

      return {
        gasLimit: defaultGasLimit, // estimatedGasLimit,
        gasPrice: estimatedGasPrice,
        gasEstimate: ethers.utils.formatEther(estimatedGasCost),
        hasSufficientNativeBalance,
      };
    } catch (e) {
      console.error('gas estimation error', e);
    }

    return null;
  }, [address, toAddress, provider, tokenAddress]);

  const { isLoading, refetch, data } = useQuery({
    queryKey: ['get-transaction-estimation', tokenAddress, address, amount],
    queryFn: fetchGasEstimate,
    enabled,
    refetchInterval: 6_000,
  });

  return {
    isLoading,
    refetch,
    data: data ?? {
      gasEstimate: 0n,
      gasPrice: 0n,
      hasSufficientNativeBalance: true,
      gasLimit: defaultGasLimit,
    },
  };
};
*/
export default useGasEstimation;
