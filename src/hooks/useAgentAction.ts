
import { useMutation } from "@tanstack/react-query";
import { useWalletClient, usePublicClient } from "wagmi";
import { enSoService } from "../services/enso.service.ts";
import { mapChainId2ViemChain, mapChainId2NativeAddress } from '../config/networks';
import { Web3AuthContext } from '../providers/Web3AuthContext.tsx'
import { useContext } from "react";
import { convertCryptoAmount } from '../utils/agent.util.tsx';
import { compareWalletAddresses } from "../utils/common.util.ts";

interface AgentTransaction {
  transaction: {

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
  fromAddress: string;
  amount: number;
}

interface AgentDeposit {
  tokenAddress: string;
  fromAddress: string;
  amount: number;
  fromToken: {
    symbol: string;
    name: string;
    address: string;
    chainId: number;
    decimals: number;
    logoURI: string;
    priceUSD: number;
  }
}

export const useAgentMutation = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { walletType, chainId, signer } = useContext(Web3AuthContext);

  return useMutation({
    mutationFn: async (data: AgentTransaction) => {
      if (walletType == "EMBEDDED") {
        if (!signer) {
          console.error("Wallet signer not found");
          return;
        }

        const actionApprove = await enSoService.getApprove({
          fromAddress: data.fromAddress,
          chainId: 1,
          tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          amount: (data.amount * 1000000).toString(),
        })

        const approve: any = {
          data: actionApprove.tx.data,
          from: actionApprove.tx.from,
          to: actionApprove.tx.to,
          chainId: 1,
          gasLimit: actionApprove.gas,
        }

        const approveTx = await signer?.sendTransaction({ ...approve });

        const approveReceipt = await approveTx.wait();
        console.log("Token approved:", approveReceipt);
        if (approveReceipt) {
          const actionBundle = await enSoService.getRouter({
            fromAddress: data.fromAddress,
            chainId: 1,
            receiver: data.fromAddress,
            tokenIn: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
            amountIn: [(data.amount * 1000000).toString()],
            tokenOut: [data.transaction.address.toString()]
          })

          const tmp: any = {
            data: actionBundle.tx.data,
            from: actionBundle.tx.from,
            to: actionBundle.tx.to,
            value: actionBundle.tx.value,
            chainId: 1,
            gasLimit: actionBundle.gas,
          }

          let scan = '';
          const tx = await signer?.sendTransaction({ ...tmp });
          const receipt = await tx.wait();
          console.log("Transaction successful:", receipt);
          scan = `${mapChainId2ViemChain[1].blockExplorers?.default.url}/tx/${receipt.transactionHash}`;
          return scan;
        }
      } else {
        if (!walletClient) {
          console.error("Wallet client not found");
          return;
        }
        const actionBundle = await enSoService.getRouter({
          fromAddress: data.fromAddress,
          chainId: 1,
          receiver: data.fromAddress,
          tokenIn: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
          amountIn: [(data.amount * 1000000).toString()],
          tokenOut: [data.transaction.address.toString()]
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

        let scan = '';
        const tx = await walletClient.sendTransaction(tmp);

        if (tx) {
          const receipt = await publicClient?.waitForTransactionReceipt({ hash: tx });

          if (receipt) {
            scan = `${mapChainId2ViemChain[1].blockExplorers?.default.url}/tx/${tx}`;
          }
        }
        return scan;
      }
    }

  });
};

export const useAgentDepositMutation = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { walletType, chainId, signer } = useContext(Web3AuthContext);

  return useMutation({
    mutationFn: async (data: AgentDeposit) => {
      if (walletType == "EMBEDDED") {
        if (!signer) {
          console.error("Wallet signer not found");
          return;
        }

        const nativeTokenAddress = mapChainId2NativeAddress[Number(data.fromToken.chainId)];
        const isNativeToken = compareWalletAddresses(nativeTokenAddress, data.fromToken.address);
        let approveFlag = false;
        console.log(data.amount * Math.pow(10, data.fromToken.decimals));
        if (!isNativeToken) {
          const actionApprove = await enSoService.getApprove({
            fromAddress: data.fromAddress,
            chainId: data.fromToken.chainId,
            tokenAddress: data.fromToken.address,
            amount: (data.amount * Math.pow(10, data.fromToken.decimals)).toString(),
          })

          const approve: any = {
            data: actionApprove.tx.data,
            from: actionApprove.tx.from,
            to: actionApprove.tx.to,
            chainId: data.fromToken.chainId,
            gasLimit: actionApprove.gas,
          }

          const approveTx = await signer?.sendTransaction({ ...approve });

          const approveReceipt = await approveTx.wait();
          if (approveReceipt) approveFlag = true;
          console.log("Token approved:", approveReceipt);
        }

        if (isNativeToken || approveFlag == true) {
          const actionBundle = await enSoService.getRouter({
            fromAddress: data.fromAddress,
            chainId: data.fromToken.chainId,
            receiver: data.fromAddress,
            tokenIn: [data.fromToken.address],
            amountIn: [(data.amount * Math.pow(10, data.fromToken.decimals)).toString()],
            tokenOut: [data.tokenAddress.toString()]
          })

          const tmp: any = {
            data: actionBundle.tx.data,
            from: actionBundle.tx.from,
            to: actionBundle.tx.to,
            value: actionBundle.tx.value,
            chainId: data.fromToken.chainId,
            gasLimit: actionBundle.gas,
          }

          let scan = '';
          const tx = await signer?.sendTransaction({ ...tmp });
          const receipt = await tx.wait();
          console.log("Transaction successful:", receipt);
          scan = `${mapChainId2ViemChain[data.fromToken.chainId].blockExplorers?.default.url}/tx/${receipt.transactionHash}`;
          return scan;
        }
      } else {
        if (!walletClient || !signer) {
          console.error("Wallet client not found");
          return;
        }

        const nativeTokenAddress = mapChainId2NativeAddress[Number(data.fromToken.chainId)];
        const isNativeToken = compareWalletAddresses(nativeTokenAddress, data.fromToken.address);
        let approveFlag = false;
        console.log(data.amount * Math.pow(10, data.fromToken.decimals));
        if (!isNativeToken) {
          const actionApprove = await enSoService.getApprove({
            fromAddress: data.fromAddress,
            chainId: data.fromToken.chainId,
            tokenAddress: data.fromToken.address,
            amount: (data.amount * Math.pow(10, data.fromToken.decimals)).toString(),
          })

          const approve: any = {
            data: actionApprove.tx.data,
            from: actionApprove.tx.from,
            to: actionApprove.tx.to,
            chainId: data.fromToken.chainId,
            gasLimit: actionApprove.gas,
          }

          const approveTx = await signer?.sendTransaction({ ...approve });

          const approveReceipt = await approveTx.wait();
          if (approveReceipt) approveFlag = true;
          console.log("Token approved:", approveReceipt);
        }

        if (isNativeToken || approveFlag == true) {
          const actionBundle = await enSoService.getRouter({
            fromAddress: data.fromAddress,
            chainId: data.fromToken.chainId,
            receiver: data.fromAddress,
            tokenIn: [data.fromToken.address],
            amountIn: [(data.amount * Math.pow(10, data.fromToken.decimals)).toString()],
            tokenOut: [data.tokenAddress.toString()]
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

          let scan = '';
          const tx = await walletClient.sendTransaction(tmp);

          if (tx) {
            const receipt = await publicClient?.waitForTransactionReceipt({ hash: tx });

            if (receipt) {
              scan = `${mapChainId2ViemChain[data.fromToken.chainId].blockExplorers?.default.url}/tx/${tx}`;
            }
          }
          return scan;
        }

      }
    }
  });
};

