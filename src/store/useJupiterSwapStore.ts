import {create} from 'zustand';
import {JupiterQuoteType, TxCallbackProps} from "../types/jupiter-swap.type.ts";

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
  unWrapSolAct: (props: { amount: string; onClose?: () => void; onSent?: () => void; onError?: () => void }) => Promise<string | undefined>
  wrapSolAct: (amount: string) => Promise<string | undefined>
}

const initSwapState = {
  slippage: 0.005
}

/*
export const useSwapStore = create<SwapStore>(
    () => ({
      ...initSwapState,
    })
)*/
