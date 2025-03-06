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

interface Warning {
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

interface ChainflipMeta {
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