import { Address, type Hex, TypedData, TypedDataDomain } from "viem";

/**
 * Valid signature types on 0x
 */
export enum SignatureType {
    Illegal = 0,
    Invalid = 1,
    EIP712 = 2,
    EthSign = 3,
}

export interface EIP712TypedData {
    types: TypedData;
    domain: TypedDataDomain;
    message: {
        [key: string]: unknown;
    };
    primaryType: string;
}

export interface PreviewDetailItemProps {
    title: string;
    info: string;
    value: string;
    valueClassName?: string;
    isFree?: boolean;
    isLoading: boolean;
    isSlippageItem?: boolean;
    openDialog?: (value: boolean) => void;
}

export type TokenType = {
    // symbol: string;
    // name: string;
    // address: string;
    // chainId: number;
    // decimals: number;
    // logoURI: string;
    // geckoId?: string;
    // price?: number;
    // marketCap?: number;
    // marketCapRank?: number;
    // volume24h?: number;
    // sparkline?: number[];
    // category?: 'token' | 'meme';
    // priceChange24h?: number;
    name: string,
    address: string,
    chainId: number,
    decimals: number,
    logoURI: string,
    price?: number,
    priceChange24h?: number,
    marketCap?: number,
    marketCapRank?: number,
    volume24h?: number,
    sparkline?: number[];
    category?: string;
    id?: string;
    symbol?: string;
    image?: string;
    current_price?: number;
    market_cap?: number;
    market_cap_rank?: number;
    total_volume?: number;
    price_change_percentage_24h?: number;
    sparkline_in_7d?: { price: number[] };
    categories?: string;
    platforms?: string[];

};

export type AssetPlatformType = {
    id: string,
    chain_identifier: number,
    name: string,
    shortname: string,
    native_coin_id: string,
}

export type NetworkType = {
    id: string;
    type: string;
    attributes: {
        name: string;
        coingecko_asset_platform_id: string | null;
    }
}

export type OrderType = 'market' | 'limit';

export type ChartType = 'line' | 'tradingview';
export type TimeRange = '1H' | '1D' | '1W' | '1M' | '1Y';

export type SlippageOption = 0.1 | 0.5 | 1 | number;

export type TransactionType = 'swap' | 'buy' | 'sell';

export type Transaction = {
    id: string;
    type: TransactionType;
    fromToken: TokenType;
    toToken: TokenType;
    fromAmount: string;
    toAmount: string;
    timestamp: number;
    status: 'pending' | 'completed' | 'failed';
    hash: string;
    maker: string;
    priceUsd?: number;
};

export type ChartDataPoint = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};

export type birdeyeOHLCVResponse = {
    items: {
        o: number,
        h: number,
        l: number,
        c: number,
        v: number,
        unixTime: number,
        address: string,
        type: string,
        currency: string,
    } []
};

export type PaymentMethod = {
    id: string;
    name: string;
    icon: string;
    network: string;
    balance: number;
    price: number;
    priceChange: number;
};

// This interface is subject to change as the API V2 endpoints aren't finalized.
export interface PriceResponse {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    buyAmount: string;
    grossSellAmount: string;
    grossBuyAmount: string;
    allowanceTarget: Address;
    route: [];
    fees: {
        integratorFee: {
            amount: string;
            token: string;
            type: "volume" | "gas";
        } | null;
        zeroExFee: {
            billingType: "on-chain" | "off-chain";
            feeAmount: string;
            feeToken: Address;
            feeType: "volume" | "gas";
        };
        gasFee: null;
    } | null;
    gas: string;
    gasPrice: string;
    auxiliaryChainData?: {
        l1GasEstimate?: number;
    };
}

// This interface is subject to change as the API V2 endpoints aren't finalized.
export interface QuoteResponse {
    sellToken: Address;
    buyToken: Address;
    sellAmount: string;
    buyAmount: string;
    grossSellAmount: string;
    grossBuyAmount: string;
    gasPrice: string;
    allowanceTarget: Address;
    route: [];
    fees: {
        integratorFee: {
            amount: string;
            token: string;
            type: "volume" | "gas";
        } | null;
        zeroExFee: {
            billingType: "on-chain" | "off-chain";
            feeAmount: string;
            feeToken: Address;
            feeType: "volume" | "gas";
        };
        gasFee: null;
    } | null;
    issues: {
        allowance: {
            actual: string;
            spender: string;
        } | null;
    } | null;
    auxiliaryChainData: object;
    to: Address;
    data: Hex;
    value: string;
    gas: string;
    permit2: {
        type: "Permit2";
        hash: Hex;
        eip712: EIP712TypedData;
    };
    transaction: V2QuoteTransaction;
    tokenMetadata: {
        buyToken: {
            buyTaxBps: string | null;
            sellTaxBps: string | null;
        };
        sellToken: {
            buyTaxBps: string | null;
            sellTaxBps: string | null;
        };
    };
}

export interface GaslessQuoteResponse {
    approval: {
        type: string;
        hash: string;
        eip712: EIP712TypedData;
    } | null;
    blockNumber: string;
    buyAmount: string;
    buyToken: Address;
    fees: {
        integratorFee: {
            amount: string;
            token: string;
            type: "volume" | "gas";
        } | null;
        zeroExFee: {
            amount: string;
            token: string;
            type: string;
        };
        gasFee: {
            amount: string;
            token: string;
            type: string;
        };
    };
    issues: {
        allowance: {
            actual: string;
            spender: string;
        } | null;
        balance: {
            token: string;
            actual: string;
            expected: string;
        };
        simulationIncomplete: boolean;
        invalidSourcesPassed: unknown;
    } | null;
    liquidityAvailable: boolean;
    minBuyAmount: string;
    route: {
        fills: {
            from: string;
            to: string;
            source: string;
            proportionBps: string;
        }[];
        tokens: {
            address: string;
            symbol: string;
        }[];
    };
    sellAmount: string;
    sellToken: Address;
    target: string;
    tokenMetadata: {
        buyToken: {
            buyTaxBps: string | null;
            sellTaxBps: string | null;
        };
        sellToken: {
            buyTaxBps: string | null;
            sellTaxBps: string | null;
        };
    };
    trade: {
        type: string;
        hash: string;
        eip712: EIP712TypedData;
    } | null;
    zid: string;
}


export interface V2QuoteTransaction {
    data: Hex;
    gas: string | null;
    gasPrice: string;
    to: Address;
    value: string;
}

export interface ZeroxQuoteRequestType {
    chainId: number;
    sellTokenAddress: string;
    buyTokenAddress: string;
    sellTokenAmount: string;
    takerAddress: string;
    isGasLess?: boolean;
}

export interface SwapkitQuoteRequestType {
    sellChainId: number;
    sellTokenAddress: string;
    buyChainId: number;
    buyTokenAddress: string;
    sellAmount: string;
    sourceAddress: string;
    destinationAddress: string;
    slippage: number;
    includeTx: boolean;
}


export interface QuoteDataType {
    buyAmount: number;
    exchangeRate: number;
    affiliateFee: number | null;
    buyTax: number | null;
    sellTax: number | null;
    tokenApprovalRequired: boolean;
    gaslessApprovalAvailable: boolean;
    spenderAddress: string;
}

export interface ZeroxGaslessStatusRequestType {
    chainId: number;
    tradeHash: string
}

interface GaslessStatusTransaction {
    hash: string
    timestamp: string
}

export interface ZeroxGaslessStatusResponseType {
    status: string
    transactions?: GaslessStatusTransaction[]
}

export interface gaslessSubmitResponse {
    tradeHash: string
    type: string
    zid: string
}

// ------------- begin of debridge type -----------
interface DebridgeTokenInfo {
    address: string;
    chainId: number;
    decimals: number;
    name: string;
    symbol: string;
    amount: string;
    approximateOperatingExpense?: string;
    mutatedWithOperatingExpense?: boolean;
    approximateUsdValue?: number;
    originApproximateUsdValue?: number;
    maxRefundAmount?: string;
    recommendedAmount?: string;
    maxTheoreticalAmount?: string;
    recommendedApproximateUsdValue?: number;
    maxTheoreticalApproximateUsdValue?: number;
}

interface DebridgeCostDetailPayload {
    feeAmount: string;
    feeBps?: string;
    estimatedVolatilityBps?: string;
    feeApproximateUsdValue?: string;
    amountOutBeforeCorrection?: string;
}

interface DebridgeCostDetail {
    chain: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
    type: string;
    payload?: DebridgeCostDetailPayload;
}

interface Estimation {
    srcChainTokenIn: DebridgeTokenInfo;
    srcChainTokenOut: DebridgeTokenInfo;
    dstChainTokenOut: DebridgeTokenInfo;
    costsDetails: DebridgeCostDetail[];
    recommendedSlippage: number;
}

export interface DebridgeTransaction {
    allowanceTarget?: string;
    allowanceValue?: string;
    data?: string;
    to?: string;
    value?: string;
}

interface Order {
    approximateFulfillmentDelay: number;
    salt?: number;
    metadata?: string;
}

export interface DebridgeQuoteResponseType {
    estimation: Estimation;
    tx: DebridgeTransaction;
    prependedOperatingExpenseCost?: string;
    order?: Order;
    orderId?: string;
    fixFee?: string;
    userPoints?: number;
    integratorPoints?: number;
}

export interface DebridgeQuoteRequestType {
    srcChainId: number;
    srcChainTokenIn: string;
    dstChainId: number;
    dstChainTokenOut: string;
    dstChainTokenOutRecipient?: string;
    senderAddress: string;
    srcChainTokenInAmount: string;
}

export enum DebridgeOrderStatus {
    Created = "Created",
    Fulfilled = "Fulfilled",
    SentUnlock = "SentUnlock",
    ClaimedUnlock = "ClaimedUnlock",
    OrderCancelled = "OrderCancelled",
    SentOrderCancel = "SentOrderCancel",
    ClaimedOrderCancel = "ClaimedOrderCancel",
}

interface BytesValue {
    bytesValue: string;
    bytesArrayValue: string;
    stringValue: string;
}

interface FulfilledDstEventMetadata {
    transactionHash: BytesValue;
    blockNumber: number;
    blockHash: BytesValue;
    blockTimeStamp: number;
    initiator: BytesValue;
}

export interface DebridgeTrackResponseType {
    state: DebridgeOrderStatus
    fulfilledDstEventMetadata: FulfilledDstEventMetadata
}
// ------------- end of debridge type -----------