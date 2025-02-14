import {create} from 'zustand';
import {JupiterQuoteType, TxCallbackProps} from "../types/jupiter-swap.type.ts";
import web3AuthContext from "../providers/Web3AuthContext.tsx";
import {useContext} from 'react'

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
            console.log(swapResponse)
            const {signSolanaTransaction} = useContext(web3AuthContext);
            const {publicKey, raydium, txVersion, connection, signAllTransactions, urlConfigs} = useAppStore.getState()
            if (!raydium || !connection) {
                console.error('no connection')
                return
            }
            if (!publicKey || !signAllTransactions) {
                console.error('no wallet')
                return
            }
            try {
                const tokenMap = useTokenStore.getState().tokenMap
                const [inputToken, outputToken] = [tokenMap.get(swapResponse.data.inputMint)!, tokenMap.get(swapResponse.data.outputMint)!]
                const [isInputSol, isOutputSol] = [isSolWSol(swapResponse.data.inputMint), isSolWSol(swapResponse.data.outputMint)]

                const inputTokenAcc = await raydium.account.getCreatedTokenAccount({
                    programId: new PublicKey(inputToken.programId ?? TOKEN_PROGRAM_ID),
                    mint: new PublicKey(inputToken.address),
                    associatedOnly: false
                })

                if (!inputTokenAcc && !isInputSol) {
                    console.error('no input token acc')
                    return
                }

                const outputTokenAcc = await raydium.account.getCreatedTokenAccount({
                    programId: new PublicKey(outputToken.programId ?? TOKEN_PROGRAM_ID),
                    mint: new PublicKey(outputToken.address)
                })

                // const poolId = 'HwVzy98cA7rubRERPronMdgpQUsVNsZUFxGVX6QkD8xj'
                // const inputAmount = new BN(1000000)
                // const inputMint = NATIVE_MINT.toBase58()
                const referralAccountPubkey = new PublicKey(JUPITER_REFERRAL_WALLET)
                const referralTokenAddr = JUPITER_REFERRAL_FEE_TOKEN_LIST.includes(inputToken.address)
                    ? inputToken.address
                    : JUPITER_REFERRAL_FEE_TOKEN_LIST.includes(outputToken.address)
                        ? outputToken
                        : undefined
                const data = swapResponse.data

                let requestBody = {
                    quoteResponse: data,
                    userPublicKey: publicKey.toBase58(),
                    wrapAndUnwrapSol: true,
                    // prioritizationFeeLamports: { jitoTipLamports: 100000 },
                    computeUnitPriceMicroLamports: 1000000,
                    dynamicComputeUnitLimit: true,
                    feeAccount: ''
                    // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
                    // feeAccount: "fee_account_public_key"
                }
                if (referralTokenAddr) {
                    const [feeAccount] = await PublicKey.findProgramAddressSync(
                        [Buffer.from('referral_ata'), referralAccountPubkey.toBuffer(), new PublicKey(referralTokenAddr).toBuffer()],
                        new PublicKey('REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3')
                    )
                    requestBody.feeAccount = feeAccount.toBase58()
                }

                // let requestBody = {
                //   // quoteResponse from /quote api
                //   quoteResponse: data,
                //   // user public key to be used for the swap
                //   userPublicKey: publicKey.toBase58(),
                //   // auto wrap and unwrap SOL. default is true
                //   wrapAndUnwrapSol: true,
                //   prioritizationFeeLamports: { jitoTipLamports: 110000 },
                //   dynamicComputeUnitLimit: true
                //   // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
                //   // feeAccount: "fee_account_public_key"
                // }

                const {swapTransaction} = await (
                    await fetch('https://quote-api.jup.ag/v6/swap', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestBody)
                    })
                ).json()
                // console.log(swapTransaction)
                const swapTransactionBuf = Buffer.from(swapTransaction, 'base64')
                const transaction = VersionedTransaction.deserialize(new Uint8Array(swapTransactionBuf))
                const signedTxs = await signAllTransactions([transaction])

                // console.log('simulate tx string:', signedTxs.map(txToBase64))

                const txLength = signedTxs.length
                const {toastId, handler} = getDefaultToastData({
                    txLength,
                    ...txProps
                })

                const swapMeta = getTxMeta({
                    action: 'swap',
                    values: {
                        amountA: formatLocaleStr(
                            new Decimal(swapResponse.data.inputAmount).div(10 ** (inputToken.decimals || 0)).toString(),
                            inputToken.decimals
                        )!,
                        symbolA: getMintSymbol({mint: inputToken, transformSol: wrapSol}),
                        amountB: formatLocaleStr(
                            new Decimal(swapResponse.data.outputAmount).div(10 ** (outputToken.decimals || 0)).toString(),
                            outputToken.decimals
                        )!,
                        symbolB: getMintSymbol({mint: outputToken, transformSol: unwrapSol})
                    }
                })

                const processedId: {
                    txId: string
                    status: 'success' | 'error' | 'sent'
                    signedTx: Transaction | VersionedTransaction
                }[] = []

                const getSubTxTitle = (idx: number) => {
                    return idx === 0
                        ? 'transaction_history.set_up'
                        : idx === processedId.length - 1 && processedId.length > 2
                            ? 'transaction_history.clean_up'
                            : 'transaction_history.name_swap'
                }
                console.log(connection)
                let i = 0
                const checkSendTx = async (): Promise<void> => {
                    if (!signedTxs[i]) return
                    const tx = signedTxs[i]
                    const txId = !isV0Tx
                        ? await connection.sendRawTransaction(tx.serialize(), {skipPreflight: true, maxRetries: 0})
                        : await connection.sendTransaction(tx as VersionedTransaction, {
                            skipPreflight: true,
                            maxRetries: 10
                        })
                    // const transaction = tx as VersionedTransaction
                    // const data: { result: string } = await axios.post(`https://mainnet.block-engine.jito.wtf/api/v1/transactions`, {
                    //   id: 1,
                    //   jsonrpc: '2.0',
                    //   method: 'sendTransaction',
                    //   params: [
                    //     Buffer.from(transaction.serialize()).toString('base64'),
                    //     {
                    //       encoding: 'base64'
                    //     }
                    //   ]
                    // })
                    // const { result: txId } = data

                    processedId.push({txId, signedTx: tx, status: 'sent'})

                    if (signedTxs.length === 1) {
                        await saveTransactionToServer({
                            txHash: txId,
                            walletAddress: publicKey.toBase58(),
                            inputMint: swapResponse.data.inputMint,
                            inputAmount: swapResponse.data.inAmount.toString(),
                            outputMint: swapResponse.data.outputMint,
                            outputAmount: swapResponse.data.otherAmountThreshold.toString(),
                            feeMint: swapResponse.data.routePlan[0].swapInfo.feeMint,
                            feeAmount: swapResponse.data.routePlan[0].swapInfo.feeAmount,
                            transactionType: 'JUPITER'
                        })

                        txStatusSubject.next({
                            txId,
                            ...swapMeta,
                            signedTx: tx,
                            onClose: onCloseToast,
                            isSwap: true,
                            mintInfo: [inputToken, outputToken],
                            ...txProps
                        })
                        return
                    }
                    let timeout = 0
                    const subId = connection.onSignature(
                        txId,
                        async (signatureResult) => {
                            console.log(`onSignature`, txId)
                            timeout && window.clearTimeout(timeout)
                            const targetTxIdx = processedId.findIndex((tx) => tx.txId === txId)
                            if (targetTxIdx > -1) processedId[targetTxIdx].status = signatureResult.err ? 'error' : 'success'
                            handleMultiTxRetry(processedId)
                            const isSlippageError = isSwapSlippageError(signatureResult)

                            if (!isSlippageError) {
                                await saveTransactionToServer({
                                    txHash: txId,
                                    walletAddress: publicKey.toBase58(),
                                    inputMint: swapResponse.data.inputMint,
                                    inputAmount: swapResponse.data.inAmount.toString(),
                                    outputMint: swapResponse.data.outputMint,
                                    outputAmount: swapResponse.data.otherAmountThreshold.toString(),
                                    feeMint: swapResponse.data.routePlan[0].swapInfo.feeMint,
                                    feeAmount: swapResponse.data.routePlan[0].swapInfo.feeAmount,
                                    transactionType: 'JUPITER'
                                })
                            }

                            handleMultiTxToast({
                                toastId,
                                processedId: processedId.map((p) => ({
                                    ...p,
                                    status: p.status === 'sent' ? 'info' : p.status
                                })),
                                txLength,
                                meta: {
                                    ...swapMeta,
                                    title: isSlippageError ? i18n.t('error.error.swap_slippage_error_title')! : swapMeta.title,
                                    description: isSlippageError ? i18n.t('error.error.swap_slippage_error_desc')! : swapMeta.description
                                },
                                isSwap: true,
                                handler,
                                getSubTxTitle,
                                onCloseToast
                            })
                            if (!signatureResult.err) checkSendTx()
                        },
                        'processed'
                    )
                    connection.getSignatureStatuses([txId])
                    handleMultiTxRetry(processedId)
                    handleMultiTxToast({
                        toastId,
                        processedId: processedId.map((p) => ({...p, status: p.status === 'sent' ? 'info' : p.status})),
                        txLength,
                        meta: swapMeta,
                        isSwap: true,
                        handler,
                        getSubTxTitle,
                        onCloseToast
                    })

                    timeout = window.setTimeout(() => {
                        connection.removeSignatureListener(subId)
                    }, TOAST_DURATION)

                    i++
                }
                checkSendTx()
            } catch (e: any) {
                txProps.onError?.()
                if (e.message !== 'tx failed') toastSubject.next({txError: e})
            } finally {
                txProps.onFinally?.()
            }
            return ''
        }
    })
)