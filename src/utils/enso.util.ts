import { ENSO_ROUTER_ADDRESS } from "../constants/enso.constants";
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { PRIMARY_ADDRESS_BY_PROTOCOL } from "../constants/protocol.constant.ts";
import { compareWalletAddresses } from "./common.util.ts";

/**
 * @dev generate EnSo approve action
 **/
export const generateEnSoApproveAction = ({ tokens, amounts, chainId }: { tokens: string[], amounts: string[], chainId: number }) => {
    const result = [];

    if (tokens.length !== amounts.length) {
        throw Error("EnSo Approve param error")
    }

    const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)] || "";

    for (let i = 0; i < tokens.length; i++) {
        if (compareWalletAddresses(tokens[i], nativeTokenAddress)) {
            continue;
        }
        result.push({
            "action": "approve",
            "protocol": "erc20",
            "args": {
                "token": tokens[i],
                "spender": ENSO_ROUTER_ADDRESS,
                "amount": amounts[i]
            }
        })
    }

    return result;
}

export const generateEnSoExecuteAction = (
    { action, protocol, tokenIn, tokenOut, amountIn, chainId, receiver }
        : { action: string, protocol: string, tokenIn: string[], tokenOut: string[], amountIn: string[], chainId: number, receiver: string }
) => {
    return [
        {
            "action": action,
            "protocol": protocol,
            "args": {
                "tokenIn": tokenIn.length === 1 ? tokenIn[0].toString() : tokenIn,
                "tokenOut": tokenOut.length === 1 ? tokenOut[0].toString() : tokenOut,
                "amountIn": amountIn.length === 1 ? amountIn[0].toString() : amountIn,
                "primaryAddress": getPrimaryAddress({ chainId, protocol: protocol.toLowerCase() }),
                "receiver": receiver
            }
        }
    ]
}

export const getPrimaryAddress = ({ chainId, protocol }: { chainId: number, protocol: string }) => {
    return PRIMARY_ADDRESS_BY_PROTOCOL[protocol][chainId];
}

export const generateEnSoBorrowAction = ({ protocol, tokenIn, amountIn, tokenOut, amountOut, receiver }: { protocol: string, tokenIn: string[], amountIn: string[], tokenOut: string[], amountOut: string[], receiver: string }) => {
    // aave-v3 eth->usdc
    return [
        {
            "protocol": protocol,
            "action": "deposit",
            "args": {
                "tokenIn": tokenIn.length === 1 ? tokenIn[0].toString() : tokenIn,
                "tokenOut": "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8",
                "amountIn": amountIn.length === 1 ? amountIn[0].toString() : amountIn,
                "primaryAddress": "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C",
            },
        },
        {
            "protocol": protocol,
            "action": "borrow",
            "args": {
                "collateral": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "tokenOut": tokenOut.length === 1 ? tokenOut[0].toString() : tokenOut,
                "amountOut": amountOut.length === 1 ? amountOut[0].toString() : amountOut,
                "primaryAddress": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
                "receiver": receiver
            }
        },
        {
            "protocol": "erc20",
            "action": "transfer",
            "args": {
                "token": tokenOut.length === 1 ? tokenOut[0].toString() : tokenOut,
                "receiver": receiver,
                "amount": amountOut.length === 1 ? amountOut[0].toString() : amountOut
            }
        }
    ];
}