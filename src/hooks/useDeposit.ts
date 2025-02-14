import { useMutation } from "@tanstack/react-query";

import { enSoService } from "../services/enso.service";

interface mutationDataParams {
    chainId: number;
    fromAddress: string;
    routingStrategy: string;
    action: "deposit";
    protocol: "uniswap-v2";
    tokenIn: string[];
    tokenOut: string;
    amountIn: number[];
    primaryAddress: string;
}

export const useSendDepositMutation = () => {
    return useMutation({
        mutationFn: async (data: mutationDataParams) => {
            return await enSoService.sendBundle({
                fromAddress: data.fromAddress,
                chainId: data.chainId,
                routingStrategy: "router",
                actions: [
                    {
                        "action": "approve",
                        "protocol": "erc20",
                        "args": {
                            "token": data.tokenIn[0],
                            "spender": data.primaryAddress,
                            "amount": data.amountIn[0]
                        }
                    },
                    {
                        "action": "approve",
                        "protocol": "erc20",
                        "args": {
                            "token": data.tokenIn[1],
                            "spender": data.primaryAddress,
                            "amount": data.amountIn[0]
                        }
                    },
                    {
                        "action": data.action,
                        "protocol": data.protocol,
                        "args": {
                            "tokenIn": data.tokenIn,
                            "tokenOut": data.tokenOut,
                            "amountIn": data.amountIn,
                            "primaryAddress": data.primaryAddress
                        }
                    }
                ]
            })
        }
    })
}