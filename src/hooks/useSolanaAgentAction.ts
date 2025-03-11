
import { useMutation } from "@tanstack/react-query";
import { Web3AuthContext } from '../providers/Web3AuthContext.tsx'
import { useContext } from "react";

import { mapChainId2ExplorerUrl } from '../config/networks.ts';
interface SolanaAgentAction {
  transactions: {
    receiver: string,
    fromAddress: string,
    fromAmount: number,
    fromDecimals: number
  }
}

export const useSolanaAgentActionMutation = () => {
  const { walletType, signer, transferSolToken } = useContext(Web3AuthContext);

  return useMutation({
    mutationFn: async (data: SolanaAgentAction) => {
      if (walletType == "EMBEDDED") {
        if (!signer) {
          console.error("Wallet signer not found");
          return;
        }
        const signature = await transferSolToken(data.transactions.receiver, data.transactions.fromAddress, data.transactions.fromAmount, data.transactions.fromDecimals)
        
        if(signature) {
          const scan = `${mapChainId2ExplorerUrl[900]}/tx/${signature}`
          return scan;
        } else return null;
      } 
    },
  });
};
