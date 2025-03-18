
import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { Web3AuthContext } from '../providers/Web3AuthContext.tsx'
import { useContext } from "react";

import { Step } from "../types/brian.type.ts";
import { mapChainId2ViemChain } from '../config/networks';
interface BrianTransaction {
  transactions: Step[];
  duration: number;
}

export const useBrianTransactionMutation = () => {
  const { walletType, chainId, signer } = useContext(Web3AuthContext);
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async (data: BrianTransaction) => {
      if (walletType == "EMBEDDED") {
        if (!signer) {
          console.error("Wallet signer not found");
          return;
        }
        let scan = '';
        if (data.transactions.length === 0) {
          console.error("No transaction details available");
          return;
        }
        for (const [index, transactionStep] of (data.transactions as any).entries()) {
          const { blockNumber, ...transactionParams } = transactionStep;
          
          const tx = await signer?.sendTransaction({ ...transactionParams }); 
          const receipt = await tx.wait();
          scan = `${mapChainId2ViemChain[transactionStep.chainId].blockExplorers?.default.url}/tx/${receipt.transactionHash}`;;
          console.log("Transaction successful:", receipt);
          if (index < data.transactions.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, data.duration));
          }
        }
        return scan;
      } else {
        if (!walletClient) {
          console.error("Wallet client not found");
          return;
        }
        let scan = '';
        if (data.transactions.length === 0) {
          console.error("No transaction details available");
          return;
        }
        for (const [index, transactionStep] of (data.transactions as any).entries()) {
          const tx = await walletClient.sendTransaction({ ...transactionStep });
          console.log(transactionStep);

          if (tx) {
            const receipt = await publicClient?.waitForTransactionReceipt({ hash: tx });

            if (receipt) {
              scan = `${mapChainId2ViemChain[transactionStep.chainId].blockExplorers?.default.url}/tx/${tx}`;
            }
          }

          if (index < data.transactions.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, data.duration));
          }
        }
        return scan;
      }

    },
  });
};
