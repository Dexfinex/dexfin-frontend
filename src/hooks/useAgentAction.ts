
import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { enSoService } from "../services/enso.service.ts";
import { mapChainId2ViemChain } from '../config/networks';
interface AgentTransaction {
  transaction: {
    protocol: string;
    protocolSlug: string;
    token: {
      chainId: number;
      address: string;
      decimals: number;
      name: string;
      symbol: string;
      logosUri: string[],
      type: string;
      protocolSlug: string;
      underlyingTokens: [
        {
          address: string;
          chainId: number;
          type: string;
          decimals: number;
          name: string;
          symbol: string;
          logosUri: string[];
        }
      ],
      primaryAddress: string;
      apy: number;
      tvl: number;
    }
    logoURI: string;
  }
  fromAddress: string;
  amount: number;
}

export const useAgentMutation = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return useMutation({
    mutationFn: async (data: AgentTransaction) => {
      if (!walletClient) {
        console.error("Wallet client not found");
        return;
      }
      ;
      const actionBundle = await enSoService.getRouter({
        fromAddress: data.fromAddress,
        chainId: 1,
        receiver: data.fromAddress,
        tokenIn: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
        amountIn: [(data.amount * 1000000).toString()],
        tokenOut: [data.transaction.token.address.toString()]
      })
      const tmp: any = {
        data: actionBundle.tx.data,
        from: actionBundle.tx.from,
        to: actionBundle.tx.to,
        value: actionBundle.tx.value,
        chainId: 1,
        gasLimit: actionBundle.gas,
        blockNumber: actionBundle.createdAt,
      }
      console.log(tmp);
      let scan = '';
      const tx = await walletClient.sendTransaction(tmp);

      if (tx) {
        const receipt = await publicClient?.waitForTransactionReceipt({ hash: tx });

        if (receipt) {
          scan = `${mapChainId2ViemChain[1].blockExplorers?.default.url}/tx/${tx}`;
        }
      }
      return tx;
    },
  });
};
