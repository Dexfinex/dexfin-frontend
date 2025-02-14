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

export interface TxCallbackProps<O = any> {
    onSent?: (props?: O) => void
    onError?: () => void
    onFinally?: (props?: O) => void
    onConfirmed?: () => void
}

export type ToastStatus = 'success' | 'error' | 'info' | 'warning'
