import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Bot, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { TokenType, Step, Protocol } from '../../../../types/brian.type.ts';
import useGetTokenPrices from "../../../../hooks/useGetTokenPrices.ts";
import useTokenStore from "../../../../store/useTokenStore.ts";
import { convertCryptoAmount } from '../../../../utils/agent.util.tsx';
import { formatNumberByFrac } from '../../../../utils/common.util.ts';
import { useBrianTransactionMutation } from '../../../../hooks/useBrianTransaction.ts';
import { getBridgingSpendTime, getUSDAmount } from "../../../../utils/swap.util.ts";
import { SuccessModal } from '../../modals/SuccessModal.tsx';
import { FailedTransaction } from '../../modals/FailedTransaction.tsx';
import { TokenChainIcon } from '../../../swap/components/TokenIcon.tsx';
import { mapChainId2NativeAddress, mapChainId2ViemChain } from "../../../../config/networks.ts";
import useDebridgeQuote from "../../../../hooks/useDebridgeQuote.ts";
import useDebridgeOrderStatus from "../../../../hooks/useDebridgeOrderStatus.ts";
import { DebridgeOrderStatus } from '../../../../types/swap.type';
import { useTokenApprove } from "../../../../hooks/useTokenApprove.ts";
import { toFixedFloat } from "../../../../utils/trade.util.ts";
import { SOLANA_CHAIN_ID } from "../../../../constants/solana.constants.ts";
import { VersionedTransaction } from "@solana/web3.js";
import { connection } from "../../../../config/solana.ts";
import { Web3AuthContext } from "../../../../providers/Web3AuthContext.tsx";
import { Alert, AlertIcon, Button, Skeleton, Text } from '@chakra-ui/react';

import BigNumber from "bignumber.js";
interface BridgeProcessProps {
  onClose: () => void;
  fromToken: TokenType;
  toToken: TokenType;
  fromAmount: string;
  receiver: string;
  steps: Step[];
  protocol: Protocol | undefined;
  solver: string;
}

export const EVMBridgeProcess: React.FC<BridgeProcessProps> = ({ steps, fromAmount, toToken, fromToken, protocol, solver, onClose }) => {
  const nativeTokenAddressFromChain = mapChainId2NativeAddress[fromToken!.chainId]
  const toTokenChainId = toToken && toToken?.chainId
  const nativeTokenAddress = mapChainId2NativeAddress[toTokenChainId]
  const { refetch: refetchTokensPrices } = useGetTokenPrices({
    tokenAddresses: [fromToken?.address ?? null, toToken?.address ?? null, nativeTokenAddress],
    chainId: toTokenChainId,
  });

  const fromTokenChainId = fromToken && fromToken?.chainId
  const nativeFromTokenAddress = mapChainId2NativeAddress[fromTokenChainId]
  const { refetch: refetchFromTokensPrices } = useGetTokenPrices({
    tokenAddresses: [fromToken?.address ?? null, toToken?.address ?? null, nativeFromTokenAddress],
    chainId: fromTokenChainId,
  })


  const {
    solanaWalletInfo,
    signer,
    signSolanaTransaction,
    chainId: walletChainId,
    switchChain,
  } = useContext(Web3AuthContext);

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');
  const [scan, setScan] = useState<string>('');

  const [isBridging, setIsBridging] = useState(false);

  const { getTokenPrice, tokenPrices } = useTokenStore()

  const {
    isLoading: isQuoteLoading,
    quoteResponse,
  } = useDebridgeQuote({
    sellToken: fromToken,
    buyToken: toToken,
    sellAmount: fromAmount,
    destinationAddress: null,
  })

  const {
    isLoading: isTracking,
    orderStatus,
    completionHash,
  } = useDebridgeOrderStatus(quoteResponse.orderId, isBridging)

  useEffect(() => {
    if (orderStatus === DebridgeOrderStatus.Fulfilled) {
      // open tx modal
      setScan(`${mapChainId2ViemChain[toToken.chainId].blockExplorers?.default.url}/tx/${completionHash}`)
      setTransactionProgress(100);
      setTransactionStatus('Transaction confirmed!');
    }
  }, [orderStatus])



  const spenderAddress = quoteResponse.tx?.allowanceTarget || quoteResponse.tx?.to

  const {
    isApproved: isEvmApproved,
    isLoading: isApproving,
    approve
  } = useTokenApprove({
    token: fromToken?.address as `0x${string}`,
    spender: spenderAddress as `0x${string}`,
    amount: new BigNumber(toFixedFloat(fromAmount, 4))
      .times(new BigNumber(10)
        .pow(fromToken?.decimals ?? 1))
      .toFixed(0),
    chainId: fromToken?.chainId ?? 1
  });

  const isApproved =
    (fromToken?.chainId === SOLANA_CHAIN_ID || nativeTokenAddressFromChain === fromToken?.address || !spenderAddress) // chain is solana or native token or don't have spenderAddress
      ? true
      : isEvmApproved

  useEffect(() => {
    if (step === 1) {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setTimeout(() => setStep(2), 500);
            return 100;
          }
          return p + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (showConfirmation) {
      const stages = [
        { progress: 25, status: 'Preparing transaction...' },
        { progress: 50, status: `Submitting to ${solver}...` },
        { progress: 75, status: 'Waiting for confirmation...' },
        { progress: 100, status: 'Transaction confirmed!' }
      ];

      let currentStage = 0;
      const timer = setInterval(() => {
        if (currentStage < stages.length - 1) {
          setTransactionProgress(stages[currentStage].progress);
          setTransactionStatus(stages[currentStage].status);
          currentStage++;
        } else {
          clearInterval(timer);
        }
      }, 500);

      return () => clearInterval(timer);
    }
  }, [showConfirmation]);




  const {
    fromTokenPrice,
    toTokenPrice,
    additionalAmountString,
  } = useMemo(() => {
    const fromTokenPrice = fromToken ? getTokenPrice(fromToken?.address, fromToken?.chainId) : 0
    const fromUsdAmount = fromToken ? getUSDAmount(fromToken, fromTokenPrice, fromAmount) : 0
    const toTokenPrice = toToken ? getTokenPrice(toToken?.address, toToken?.chainId) : 0
    const additionalTokenAmount = fromUsdAmount > 0 ? Number(fromAmount) / fromUsdAmount : 0 // give 1$ additional approve amount for fluctuation
    const additionalAmountString = new BigNumber(toFixedFloat(additionalTokenAmount, 4))
      .times(new BigNumber(10)
        .pow(fromToken?.decimals ?? 1))
      .toFixed(0)
    return {
      fromTokenPrice,
      toTokenPrice,
      additionalAmountString,
    }
  }, [fromToken, getTokenPrice, toToken, nativeTokenAddress, toTokenChainId, fromTokenChainId, tokenPrices])

  useEffect(() => {
    if (fromToken) {
      refetchFromTokensPrices();
    }
    if (toToken) {
      refetchTokensPrices();
    }
  }, [fromToken, toToken]);




  const handleTransaction = async () => {
    try {
      if (steps.length === 0) {
        console.error("No transaction details available");
        return;
      }
      setShowConfirmation(true);
      setTransactionProgress(100);
      setTransactionStatus('Transaction confirmed!');
      setScan('');

    } catch (error) {
      console.error("Error executing transactions:", error);
      setShowConfirmation(false);
      setFailedTransaction(true);
    }
  };

  const handleSwap = async () => {
    if (!isApproved) {
      approve?.(additionalAmountString)
      return
    }

    try {
      setShowConfirmation(true);
      if (fromToken?.chainId === SOLANA_CHAIN_ID && quoteResponse.tx) { // solana transaction
        const tx = VersionedTransaction.deserialize(Buffer.from(quoteResponse.tx.data!.slice(2), "hex"));
        const { blockhash } = await connection.getLatestBlockhash();
        tx.message.recentBlockhash = blockhash; // Update blockhash!

        const signedTransaction = await signSolanaTransaction(tx)

        try {
          const txid = await connection.sendRawTransaction(signedTransaction!.serialize(), {
            skipPreflight: false, // Set to true to skip validation checks
            preflightCommitment: "confirmed",
          });
          console.log(`✅ Transaction Sent! TXID: ${txid}`);
          // 5️⃣ Confirm the transaction
          await connection.confirmTransaction(txid, "confirmed");

          console.log("✅ Transaction Confirmed!");
        } catch (error) {
          console.error("❌ Error Sending Transaction:", error);
          setShowConfirmation(false);
          setFailedTransaction(true);
        }

      } else if (quoteResponse.tx) {
        try {
          await signer!.sendTransaction(quoteResponse.tx)

        } catch (error) {
          setShowConfirmation(false);
          setFailedTransaction(true);
        }
      } else {

        throw new Error('tx not provided')
      }
      // set estimated completion time in unixtimestamp
      setIsBridging(true)
    } catch (e) {
      setShowConfirmation(false);
      setFailedTransaction(true);
      //
    } finally {

    }
  }

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${progress * 3.77} 377`}
              className="transform -rotate-90 transition-all duration-300"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-12 h-12 text-blue-500" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-medium">Finding Best Route</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Analyzing optimal bridge route for {fromToken.symbol} from {mapChainId2ViemChain[fromToken.chainId].name} to {mapChainId2ViemChain[toToken.chainId].name}...
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        {protocol?.logoURI &&
          <img
            src={protocol.logoURI}
            alt={protocol.name}
            className="w-12 h-12"
          />
        }
        <div>
          <h3 className="text-xl font-medium">Best Route Found</h3>
          <p className="text-white/60">{solver} offers the best rate</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <TokenChainIcon src={fromToken?.logoURI} alt={fromToken?.name}
                size={"lg"} chainId={Number(fromToken?.chainId)} />
              <div>
                <div className="text-sm text-white/60">You send</div>
                <div className="text-xl font-medium">{formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} {fromToken.symbol}</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/40" />
            <div className="flex items-center gap-3">
              <TokenChainIcon src={toToken?.logoURI} alt={toToken?.name}
                size={"lg"} chainId={Number(toToken?.chainId)} />
              <div>
                <div className="text-sm text-white/60">You receive</div>
                <div className="text-xl font-medium">{formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} {toToken.symbol}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">From</span>
              <span className="font-medium">{mapChainId2ViemChain[fromToken.chainId].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">To</span>
              <span className="font-medium">{mapChainId2ViemChain[toToken.chainId].name}</span>
            </div>
          </div>
        </div>

        <Button
          isLoading={isQuoteLoading || isApproving}
          loadingText={(isApproving ? 'Approving...' : 'Computing...')}
          width="full"
          colorScheme="blue"
          onClick={() => {
            if (isApproved) handleSwap()
            else approve?.(additionalAmountString)
          }}
          isDisabled={!(Number(fromAmount) > 0) || isQuoteLoading || isApproving || !!quoteResponse.errorMessage || Number(quoteResponse.outputAmount) <= 0}
        >
          {isApproved ? 'Bridge' : 'Approve'}
        </Button>


      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {transactionProgress < 100 ? (
        <>
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-white/60">{transactionStatus}</span>
              <span className="text-sm text-white/60">{transactionProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${transactionProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <img
              src={fromToken.logoURI}
              alt={fromToken.symbol}
              className="w-12 h-12"
            />
            <ArrowRight className="w-6 h-6 text-white/40" />
            <img
              src={toToken.logoURI}
              alt={toToken.symbol}
              className="w-12 h-12"
            />
          </div>
          <p className="mt-4 text-white/60">
            Bridging {formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} {fromToken.symbol} ( {mapChainId2ViemChain[fromToken.chainId].name} ) to {formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} {toToken.symbol} ( {mapChainId2ViemChain[toToken.chainId].name} ) via {solver}
          </p>
        </>
      ) : (
        <SuccessModal onClose={onClose} scan={scan} description={`Successfully bridged ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} ${fromToken.symbol} ( ${mapChainId2ViemChain[fromToken.chainId].name} ) to ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} ${toToken.symbol} ( ${mapChainId2ViemChain[toToken.chainId].name} )`} />
      )}
    </div>
  );

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-blue-500' : 'bg-white/10'
                  }`}>
                  {step > s ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{s}</span>
                  )}
                </div>
                {s < 2 && (
                  <div className={`w-12 h-0.5 ${step > s ? 'bg-blue-500' : 'bg-white/10'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {failedTransaction &&
        <FailedTransaction
          description={`Bridge ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} ${fromToken.symbol} ( ${mapChainId2ViemChain[fromToken.chainId].name} ) to ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} ${toToken.symbol} ( ${mapChainId2ViemChain[toToken.chainId].name} ) via ${solver}`}
          onClose={onClose}
        />}
      {showConfirmation && !failedTransaction ? renderConfirmation() : (
        <div className="h-[calc(100%-60px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>
      )}
    </div>
  );
};