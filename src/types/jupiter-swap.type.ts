export interface TransferFeeDataBaseType {
    transferFeeConfigAuthority: string;
    withdrawWithheldAuthority: string;
    withheldAmount: string;
    olderTransferFee: {
        epoch: string;
        maximumFee: string;
        transferFeeBasisPoints: number;
    };
    newerTransferFee: {
        epoch: string;
        maximumFee: string;
        transferFeeBasisPoints: number;
    };
}

type ExtensionsItem = {
    coingeckoId?: string;
    feeConfig?: TransferFeeDataBaseType;
};

export type ApiV3Token = {
    chainId: number;
    address: string;
    programId: string;
    logoURI: string;
    symbol: string;
    name: string;
    decimals: number;
    tags: string[]; // "hasFreeze" | "hasTransferFee" | "token-2022" | "community" | "unknown" ..etc
    extensions: ExtensionsItem;
    freezeAuthority?: string;
    mintAuthority?: string;
};


export interface JupiterQuoteType {
    contextSlot: number
    inputAmount: string
    inAmount: string
    inputMint: string
    otherAmountThreshold: string
    outputAmount: string
    outAmount: string
    outputMint: string
    platformFee: null | number
    priceImpactPct: string
    routePlan: {
        percent: number
        swapInfo: {
            ammKey: string
            feeAmount: string
            feeMint: string
            inAmount: string
            inputMint: string
            label: string
            outAmount: string
            outputMint: string
        }
    }[]
    swapType: 'BaseIn' | 'BaseOut'
    scoreRepost: any
    slippageBps: number
    swapMode: 'ExactIn' | 'ExactOut'
    timeTaken: number
}

export type SolanaTokenInfo = ApiV3Token & {
    priority: number;
    userAdded?: boolean;
    type?: string;
};

export interface TxCallbackProps<O = any> {
    onSent?: (props?: O) => void
    onError?: () => void
    onFinally?: (props?: O) => void
    onConfirmed?: () => void
}

export type ToastStatus = 'success' | 'error' | 'info' | 'warning'
