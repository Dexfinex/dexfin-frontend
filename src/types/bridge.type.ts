import {DebridgeTransaction} from "./swap.type.ts";

interface Fee {
    type: string;
    amount: string;
    asset: string;
    chain: string;
    protocol: string;
}

interface EstimatedTime {
    inbound: number;
    swap: number;
    outbound: number;
    total: number;
}

interface Leg {
    provider: string;
    sellAsset: string;
    sellAmount: string;
    buyAsset: string;
    buyAmount: string;
    buyAmountMaxSlippage: string;
    fees: Fee[];
}

export interface Warning {
    code: string;
    display: string;
    tooltip: string;
}

interface Asset {
    asset: string;
    price: number;
    image: string;
}

interface AffiliateFee {
    brokerAddress: string;
    feeBps: number;
}

interface RefundParameters {
    minPrice: string;
    refundAddress: string;
    retryDuration: number;
}

export interface ChainflipMeta {
    sellAsset: {
        chain: string;
        asset: string;
    };
    buyAsset: {
        chain: string;
        asset: string;
    };
    destinationAddress: string;
    affiliateFees: AffiliateFee[];
    refundParameters: RefundParameters;
}

interface Meta {
    priceImpact: number;
    assets: Asset[];
    tags: string[];
    affiliate: string;
    affiliateFee: string;
    chainflip: ChainflipMeta;
}

interface Route {
    providers: string[];
    sellAsset: string;
    sellAmount: string;
    buyAsset: string;
    expectedBuyAmount: string;
    expectedBuyAmountMaxSlippage: string;
    sourceAddress: string;
    destinationAddress: string;
    fees: Fee[];
    tx: any | undefined;
    estimatedTime: EstimatedTime;
    totalSlippageBps: number;
    legs: Leg[];
    warnings: Warning[];
    meta: Meta;
}

interface ProviderError {
    provider: string;
    errorCode: string;
}

export interface SwapkitQuoteResponse {
    quoteId: string;
    routes: Route[];
    providerErrors: ProviderError[];
}

export interface DepositInfo {
    depositAddress: string;
    channelId: string;
    explorerUrl: string;
}

interface SwapkitLegType {
    chainId: string;
    hash: string;
    block: number;
    type: string;
    status: string;
    trackingStatus: string;
    fromAsset: string;
    fromAmount: string;
    fromAddress: string;
    toAsset: string;
    toAmount: string;
    toAddress: string;
    finalisedAt: number;
    payload: Record<string, unknown>;
}

export interface SwapkitTrackStatusType {
    chainId: string;
    hash: string;
    block: number;
    type: string;
    status: string;
    trackingStatus: string;
    fromAsset: string;
    fromAmount: string;
    fromAddress: string;
    toAsset: string;
    toAmount: string;
    toAddress: string;
    finalisedAt: number;
    legs: SwapkitLegType[]
}

export type SwapkitFinalizedQuoteResponse =  {
    providerName: string;
    expectedBuyAmount: string;
    expectedBuyAmountMaxSlippage: string;
    feeInUsd: number;
    formattedFeeInUsd: string;
    estimatedTime: number;
    warnings: Warning[];
    tx: any | null; // You may want to replace `any` with a more specific type for the transaction
    chainflip: ChainflipMeta | null;
    errorMessage: string;
    depositInfo: DepositInfo | null;
}

export type DebridgeQuoteResponse =  {
    inputUsdAmount: number,
    outputUsdAmount: number,
    outputAmount: string,
    feeAmount: number,
    estimatedTime: number,
    orderId: string,
    tx: DebridgeTransaction | null;
    errorMessage: string;
}















