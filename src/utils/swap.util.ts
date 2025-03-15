// Helper functions
import {splitSignature} from "./signature.util.ts";
import {ChartDataPoint, GaslessQuoteResponse, SignatureType, TimeRange, TokenType} from "../types/swap.type.ts";
import {BITCOIN_CHAIN_ID, SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {WalletClient} from "viem";
import {CreateKernelAccountReturnType} from "@zerodev/sdk";
import {mapTimeRangeToExactSeconds} from "../constants/chart.constants.ts";

export async function signTradeObject(walletClient: WalletClient | CreateKernelAccountReturnType, quote: GaslessQuoteResponse): Promise<any> {
    // Logic to sign trade object
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const tradeSignature = await walletClient.signTypedData({
        types: quote.trade?.eip712.types,
        domain: quote.trade?.eip712.domain,
        message: quote.trade?.eip712.message,
        primaryType: quote.trade?.eip712.primaryType,
    });
    console.log("🖊️ tradeSignature: ", tradeSignature);
    return tradeSignature;
}

export async function tradeSplitSigDataToSubmit(object: any, quote: GaslessQuoteResponse): Promise<any> {
    // split trade signature and package data to submit
    const tradeSplitSig = await splitSignature(object);
    return {
        type: quote.trade!.type,
        eip712: quote.trade!.eip712,
        signature: {
            ...tradeSplitSig,
            v: Number(tradeSplitSig.v),
            signatureType: SignatureType.EIP712,
        },
    }; // Return trade object with split signature
}

export const getUSDAmount = (selectedToken: TokenType | undefined, price: number, amount: string): number => {
    if (selectedToken) {
        const numAmount = Number(amount)
        return price * numAmount
    }
    return 0
}

export const formatEstimatedTimeBySeconds = (seconds: number) => {
    if (seconds < 60) return `${seconds} s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes} min, ${remainingSeconds} s` : `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
        ? `${hours} hr, ${remainingMinutes} min`
        : `${hours} hr`;
}


export const needDestinationAddress = (fromChainId: number | undefined, toChainId: number | undefined) => {
    if (fromChainId === undefined || toChainId === undefined)
        return false

    const exceptionalChainIds = [SOLANA_CHAIN_ID, BITCOIN_CHAIN_ID]
    return fromChainId !== toChainId && (exceptionalChainIds.indexOf(fromChainId) >= 0 || exceptionalChainIds.indexOf(toChainId) >= 0);
}

export const getBridgingSpendTime = (remainedSeconds: number) => {
    if (remainedSeconds <= 0)
        return 'In Progress'

    return `Remained Time: ${formatEstimatedTimeBySeconds(remainedSeconds)}`
}

export const findClosestClosedValue = (data: ChartDataPoint[], timeRange: TimeRange): number => {
    const lastTime = data[data.length - 1]?.time ?? Math.floor(Date.now() / 1000)
    const targetTime = lastTime - mapTimeRangeToExactSeconds[timeRange];

    return data.reduce((closest, item) => {
        return Math.abs(item.time - targetTime) < Math.abs(closest.time - targetTime) ? item : closest;
    }, data[0])?.close ?? 0;
}