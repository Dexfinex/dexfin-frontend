import {create} from 'zustand';
import {JupiterQuoteType, TxCallbackProps} from "../types/jupiterSwap.type.ts";

interface SwapStore {
    slippage: number
    jupiterSwapTokenAct: (
        props: {
            swapResponse: { status: boolean; data: JupiterQuoteType; id: number }
            wrapSol?: boolean
            unwrapSol?: boolean
            onCloseToast?: () => void
        } & TxCallbackProps
    ) => Promise<string | string[] | undefined>
}

const initSwapState = {
    slippage: 0.005
}

export const useSwapStore = create<SwapStore>(
    () => ({
        ...initSwapState,
        jupiterSwapTokenAct: async ({swapResponse, wrapSol, unwrapSol = false, onCloseToast, ...txProps}) => {
            return ''
        }
    })
)