import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import { JsonRpcSigner } from "@ethersproject/providers";

import { enSoService } from "../services/enso.service.ts";
import { getPrimaryAddress } from "../utils/enso.util.ts";
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { compareWalletAddresses } from "../utils/common.util.ts";
import { ENSO_ROUTER_ADDRESS } from "../constants/enso.constants.ts";

interface mutationDataParams {
    chainId: number;
    fromAddress: string;
    routingStrategy: string;
    action: "redeem";
    protocol: string;
    tokenIn: string;
    tokenOut: string[];
    withdrawPercent: number;
    signer: JsonRpcSigner | undefined;
    receiver: string,
    gasPrice: bigint;
    gasLimit: bigint;
}

export const useRedeemEnSoMutation = () => {
    return useMutation({
        mutationFn: async (data: mutationDataParams) => {
            const tokenContract = new ethers.Contract(
                data.tokenIn,
                erc20Abi,
                data.signer
            );

            const balance = await tokenContract.balanceOf(data.fromAddress);

            const amountValue = Math.ceil(Number(balance) * data.withdrawPercent / 100);

            const nativeTokenAddress = mapChainId2NativeAddress[Number(data.chainId)];

            if (!compareWalletAddresses(nativeTokenAddress, data.tokenIn)) {
                const allowanceAmount = await tokenContract.allowance(data.fromAddress, ENSO_ROUTER_ADDRESS);
                if (Number(allowanceAmount) < Number(amountValue)) {
                    const tx = {
                        to: data.tokenIn,
                        data: tokenContract.interface.encodeFunctionData("approve", [
                            ENSO_ROUTER_ADDRESS,
                            amountValue,
                        ]),
                        // gasPrice: ethers.parseUnits('10', 'gwei'),
                        gasPrice: data.gasPrice,
                        gasLimit: data.gasLimit, // Example static gas limit
                        value: 0n,
                    };

                    if (data.signer) {
                        const transactionResponse = await data.signer?.sendTransaction(tx);
                        await transactionResponse.wait();
                    }

                }
            }

            const depositBundle = await enSoService.sendBundle({
                fromAddress: data.fromAddress,
                chainId: data.chainId,
                routingStrategy: "router",
                actions: [
                    {
                        "action": data.action,
                        "protocol": data.protocol,
                        "args": {
                            "tokenIn": data.tokenIn,
                            "tokenOut": data.tokenOut,
                            "amountIn": Number(amountValue).toString(),
                            "primaryAddress": getPrimaryAddress({ chainId: data.chainId, protocol: data.protocol }),
                            "receiver": data.receiver
                        }
                    }
                ]
            })

            return depositBundle;
        }
    })
}