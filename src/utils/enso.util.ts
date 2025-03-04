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
