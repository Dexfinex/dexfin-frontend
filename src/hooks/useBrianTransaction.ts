
import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";



import { Step } from "../types/brian.type.ts";
import { mapChainId2ViemChain } from '../config/networks';
interface BrianTransaction {
  transactions: Step[];
  duration: number;
}

export const useBrianTransactionMutation = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async (data: BrianTransaction) => {
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
    },
  });
};
