// Helper functions
import {splitSignature} from "./signature.util.ts";
import {ChartDataPoint, GaslessQuoteResponse, SignatureType, TimeRange, TokenType} from "../types/swap.type.ts";
import {BITCOIN_CHAIN_ID, SOLANA_CHAIN_ID} from "../constants/solana.constants.ts";
import {WalletClient} from "viem";
import {CreateKernelAccountReturnType} from "@zerodev/sdk";
import {mapTimeRangeToExactSeconds} from "../constants/chart.constants.ts";
import {NULL_ADDRESS, ZERO_ADDRESS} from "../constants";
import {ethers} from "ethers";
import {polygon} from "viem/chains";
import {NATIVE_MATIC_ADDRESS} from "../config/networks.ts";

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

export const getCorrectTokenAddressForBridging = (address: string, chainId: number): string => {
    if (chainId === polygon.id && address === NATIVE_MATIC_ADDRESS) {
        return ZERO_ADDRESS
    }
    return address === NULL_ADDRESS ? ZERO_ADDRESS : address
}

export const getSlippageBigNumber = (slippage: string | number) => {
    if (!slippage || Number(slippage) === 0) return ethers.BigNumber.from(0);

    const slippageStr = slippage.toString();
    const decimalPlaces = slippageStr.includes('.') ? slippageStr.split('.')[1].length : 0;

    // Ensure precision is at least 4 to avoid negative exponent
    const precision = Math.max(Math.min(decimalPlaces + 2, 18), 4);

    return ethers.utils.parseUnits(slippageStr, precision)
        .mul(2)
        .div(ethers.BigNumber.from(10).pow(Math.max(precision - 4, 0))); // Prevent negative exponent
}