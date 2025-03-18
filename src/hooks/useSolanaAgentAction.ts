
import { useMutation } from "@tanstack/react-query";
import { Web3AuthContext } from '../providers/Web3AuthContext.tsx'
import { useContext } from "react";
import { VersionedTransaction } from "@solana/web3.js";
import { mapChainId2ExplorerUrl } from '../config/networks.ts';
import { connection } from "../config/solana.ts";
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

        if (signature) {
          const scan = `${mapChainId2ExplorerUrl[900]}/tx/${signature}`
          return scan;
        } else return null;
      }
    },
  });
};

interface SolanaAgentSwapAction {
  transactions: any;
}

export const useSolanaAgentSwapActionMutation = () => {
  const { walletType, signer, signSolanaTransaction, solanaWalletInfo } = useContext(Web3AuthContext);

  return useMutation({
    mutationFn: async (data: SolanaAgentSwapAction) => {
      if (walletType == "EMBEDDED") {
        const { swapTransaction } = await (
          await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quoteResponse: data.transactions,
              userPublicKey: solanaWalletInfo?.publicKey,
              asLegacyTransaction: false,
              dynamicComputeUnitLimit: true,
              prioritizationFeeLamports: 1,
              wrapAndUnwrapSol: true
            })
          })
        ).json()

        const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const signedTransaction = await signSolanaTransaction(transaction)

        try {
          const txid = await connection.sendRawTransaction(signedTransaction!.serialize(), {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          });
          console.log(`✅ Transaction Sent! TXID: ${txid}`);
          await connection.confirmTransaction(txid, "confirmed");
          console.log("✅ Transaction Confirmed!");
          return `${mapChainId2ExplorerUrl[900]}/tx/${txid}`;
        } catch (error) {
          console.error("❌ Error Sending Transaction:", error);
          return null
        }
      }
    },
  });
};
