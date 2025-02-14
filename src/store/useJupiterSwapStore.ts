import {create} from 'zustand';
import {JupiterQuoteType, TxCallbackProps} from "../types/jupiter-swap.type.ts";
import {trimTailingZero} from "../utils/formatter.util.ts";
import Decimal from "decimal.js";

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

export const useSwapStore = create<SwapStore>(
    () => ({
      ...initSwapState,
      unWrapSolAct: async ({ amount, onSent, onError, ...txProps }): Promise<string | undefined> => {
        const raydium = useAppStore.getState().raydium
        if (!raydium) return
        const { execute } = await raydium.tradeV2.unWrapWSol({
          amount
          // computeBudgetConfig: await getComputeBudgetConfig()
        })

        const values = { amount: trimTailingZero(new Decimal(amount).div(10 ** SOL_INFO.decimals).toFixed(SOL_INFO.decimals)) }
        const meta = {
          title: i18n.t('swap.unwrap_all_wsol', values),
          description: i18n.t('swap.unwrap_all_wsol_desc', values),
          txHistoryTitle: 'swap.unwrap_all_wsol',
          txHistoryDesc: 'swap.unwrap_all_wsol_desc',
          txValues: values
        }

        return execute()
            .then(({ txId, signedTx }) => {
              onSent?.()
              txStatusSubject.next({ txId, signedTx, ...meta, ...txProps })
              return txId
            })
            .catch((e) => {
              onError?.()
              toastSubject.next({ txError: e, ...meta })
              return ''
            })
      },

      wrapSolAct: async (amount: string): Promise<string | undefined> => {
        const raydium = useAppStore.getState().raydium
        if (!raydium) return
        const { execute } = await raydium.tradeV2.wrapWSol(new Decimal(amount).mul(10 ** SOL_INFO.decimals).toFixed(0))
        return execute()
            .then(({ txId, signedTx }) => {
              txStatusSubject.next({ txId, signedTx })
              return txId
            })
            .catch((e) => {
              toastSubject.next({ txError: e })
              return ''
            })
      }
    })
)