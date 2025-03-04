import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import { erc20Abi } from "viem";

import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { compareWalletAddresses } from "../utils/common.util.ts";

interface mutationDataParams {
  tokenAddress: string;
  sendAddress: string | undefined;
  sendAmount: number;
  signer: JsonRpcSigner | undefined;
  gasPrice: bigint;
  gasLimit: bigint;
}

export const useSendTransactionMutation = () => {
  const { chainId, signer } = useContext(Web3AuthContext);

  return useMutation({
    mutationFn: async (data: mutationDataParams) => {
      if (!data.sendAddress || !signer || !data.sendAmount) {
        throw new Error("sendAddress, signer, sendAmount must be provided");
      }

      const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)] || "";

      if (compareWalletAddresses(data.tokenAddress, nativeTokenAddress)) {
        const amountValue = ethers.utils.parseEther(Number(data.sendAmount).toFixed(8).replace(/\.?0+$/,""));

        const tx = {
          to: data.sendAddress,
          gasPrice: data.gasPrice,
          gasLimit: data.gasLimit, // Example static gas limit
          value: amountValue,
        };
        const transactionResponse = await signer?.sendTransaction(tx);
        const receipt = await transactionResponse.wait();
        console.log("Transaction successful:", receipt);

        return receipt;
      } else {
        const tokenContract = new ethers.Contract(
          data.tokenAddress as string,
          erc20Abi,
          signer
        );

        const decimals = await tokenContract.decimals();
        const amountValue = ethers.utils.parseUnits(
          Number(data.sendAmount).toFixed(8).replace(/\.?0+$/,""),
          decimals
        );

        const tx = {
          to: data.tokenAddress,
          data: tokenContract.interface.encodeFunctionData("transfer", [
            data.sendAddress,
            amountValue,
          ]),
          // gasPrice: ethers.parseUnits('10', 'gwei'),
          gasPrice: data.gasPrice,
          gasLimit: data.gasLimit, // Example static gas limit
          value: 0n,
        };

        const transactionResponse = await data.signer!.sendTransaction(tx);
        const receipt = await transactionResponse.wait();
        console.log("Transaction successful:", receipt);
        return receipt;
      }
    },
  });
};
