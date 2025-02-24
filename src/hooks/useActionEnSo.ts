import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import { JsonRpcSigner } from "@ethersproject/providers";

import { enSoService } from "../services/enso.service.ts";
import { generateEnSoExecuteAction } from "../utils/enso.util.ts";
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { compareWalletAddresses } from "../utils/common.util.ts";
import { ENSO_ROUTER_ADDRESS } from "../constants/enso.constants.ts";

interface mutationDataParams {
    chainId: number;
    fromAddress: string;
    routingStrategy: string;
    action: "deposit" | "redeem";
    protocol: string;
    tokenIn: string[];
    tokenOut: string[];
    amountIn: number[];
    signer: JsonRpcSigner | undefined;
    receiver: string,
    gasPrice: bigint;
    gasLimit: bigint;
}

export const useEnSoActionMutation = () => {
    return useMutation({
        mutationFn: async (data: mutationDataParams) => {
            const amountIn = [];

            for (let i = 0; i < data.tokenIn.length; i++) {
                const tokenContract = new ethers.Contract(
                    data.tokenIn[i],
                    erc20Abi,
                    data.signer
                );

                let amountValue: number;
                const nativeTokenAddress = mapChainId2NativeAddress[Number(data.chainId)];
                const isNativeToken = compareWalletAddresses(nativeTokenAddress, data.tokenIn[i]);

                if (data.action === "redeem") {
                    const balance = await tokenContract.balanceOf(data.fromAddress);
                    amountValue = Math.ceil(Number(balance) * data.amountIn[0] / 100);
                } else {
                    const decimals = isNativeToken ? 18 : await tokenContract.decimals();
                    amountValue = Number(ethers.utils.parseUnits(
                        Number(data.amountIn[i]).toFixed(8).replace(/\.?0+$/, ""),
                        decimals
                    ));
                }

                if (!isNativeToken) {
                    const allowanceAmount = await tokenContract.allowance(data.fromAddress, ENSO_ROUTER_ADDRESS);
                    if (Number(allowanceAmount) < Number(amountValue)) {
                        const tx = {
                            to: data.tokenIn[i],
                            data: tokenContract.interface.encodeFunctionData("approve", [
                                ENSO_ROUTER_ADDRESS,
                                amountValue.toString(),
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

                amountIn.push(Number(amountValue).toString());
            }

            const actionBundle = await enSoService.sendBundle({
                fromAddress: data.fromAddress,
                chainId: data.chainId,
                routingStrategy: data.routingStrategy,
                actions: generateEnSoExecuteAction({ action: data.action, protocol: data.protocol, tokenIn: data.tokenIn, tokenOut: data.tokenOut, amountIn: amountIn, chainId: Number(data.chainId), receiver: data.receiver })
            })

            return actionBundle;
        }
    })
}