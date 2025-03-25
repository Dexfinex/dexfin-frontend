import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Bot, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { TokenType, Protocol } from '../../../../types/brian.type.ts';
import { convertCryptoAmount } from '../../../../utils/agent.util.tsx';
import { formatNumberByFrac } from '../../../../utils/common.util.ts';
import { TokenChainIcon } from '../../../swap/components/TokenIcon.tsx';
import { FailedTransaction } from '../../modals/FailedTransaction.tsx';
import { SuccessModal } from '../../modals/SuccessModal.tsx';
import { mapChainId2NativeAddress, mapChainId2ViemChain } from "../../../../config/networks.ts";
import useGetTokenPrices from "../../../../hooks/useGetTokenPrices.ts";
import useTokenStore from "../../../../store/useTokenStore.ts";
import use0xQuote from "../../../../hooks/use0xQuote.ts";
import { concat, Hex, numberToHex, size } from "viem";
import { signTradeObject, tradeSplitSigDataToSubmit } from "../../../../utils/swap.util.ts";
import { use0xTokenApprove } from "../../../../hooks/use0xTokenApprove.ts";
import { ethers } from "ethers";
import { zeroxService } from "../../../../services/0x.service.ts";
import use0xGaslessSwapStatus from "../../../../hooks/use0xGaslessSwapStatus.ts";
import { Button } from '@chakra-ui/react';
import {
  GaslessQuoteResponse,

  QuoteResponse,
} from '../../../../types/swap.type';

import { Web3AuthContext } from "../../../../providers/Web3AuthContext.tsx";
import { WalletTypeEnum } from "../../../../types/wallet.type.ts";
interface SwapProcessProps {
  onClose: () => void;
  fromToken: TokenType;
  toToken: TokenType;
  fromAmount: string;
  protocol: Protocol | undefined;
}

export const EVMSwapProcess: React.FC<SwapProcessProps> = ({ fromAmount, toToken, fromToken, protocol, onClose }) => {


  const tokenChainId = fromToken ? fromToken.chainId : toToken!.chainId
  const nativeTokenAddress = mapChainId2NativeAddress[tokenChainId]
  const { refetch: refetchTokensPrices } = useGetTokenPrices({
    tokenAddresses: [fromToken?.address ?? null, toToken?.address ?? null, nativeTokenAddress],
    chainId: tokenChainId,
  })
  const { getTokenPrice, tokenPrices } = useTokenStore()
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');
  
  const [scan, setScan] = useState<string>('https://etherscan.io/');
  const [gaslessTradeHash, setGaslessTradeHash] = useState<string | undefined>(undefined);
  const {
    walletClient,
    kernelAccount,
    walletType,
    signer,
    chainId: walletChainId,
  } = useContext(Web3AuthContext);

  const {
    fromTokenPrice,
    toTokenPrice,
  } = useMemo(() => {
    const fromTokenPrice = fromToken ? getTokenPrice(fromToken?.address, fromToken?.chainId) : 0
    const toTokenPrice = toToken ? getTokenPrice(toToken?.address, toToken?.chainId) : 0
    return {
      fromTokenPrice,
      toTokenPrice,
    }
  }, [fromToken, getTokenPrice, toToken, nativeTokenAddress, tokenChainId, tokenPrices])

  useEffect(() => {
    if (fromToken) {
      refetchTokensPrices();
    }
  }, [fromToken]);



  const {
    isLoading: isQuoteLoading,
    quoteResponse,
    isGasLess: isGasLessSwap,
    // refetch,
    data: quoteData,
  } = use0xQuote({
    sellToken: fromToken,
    buyToken: toToken,
    sellAmount: fromAmount
  })

  const amountToApprove =
    fromToken && fromAmount !== ''
      ? ethers.BigNumber.from(ethers.utils.parseUnits(fromAmount, fromToken!.decimals))
        .mul(100 + Number(0.5) * 2)
        .div(100)
        .toString()
      : '0';

  const {
    approve,
    approvalDataToSubmit,
    isLoading: isApproveLoading,
  } = use0xTokenApprove({
    token: fromToken?.address as `0x${string}`,
    spender: quoteData?.spenderAddress as `0x${string}`,
    amount: amountToApprove,
    chainId: tokenChainId,
    gaslessQuote: quoteResponse as GaslessQuoteResponse,
    isGaslessApprove: isGasLessSwap,
    gaslessApprovalAvailable: quoteData?.gaslessApprovalAvailable ?? false
  });

  const approvalRequired = (!isGasLessSwap && quoteData?.tokenApprovalRequired) || (isGasLessSwap && quoteData?.tokenApprovalRequired && !approvalDataToSubmit);

  const handleTransaction = async () => {
    if (isGasLessSwap)
      await handleGaslessSwap();
    else
      await handleNormalSwap();
  }

  const handleNormalSwap = async () => {
    setShowConfirmation(true);
    const normalSwapQuoteResponse = quoteResponse as QuoteResponse
    // On click, (1) Sign the Permit2 EIP-712 message returned from quote
    if (normalSwapQuoteResponse.permit2?.eip712) {
      let signature: Hex | undefined;
      try {
        if (walletType === WalletTypeEnum.EMBEDDED) {
          signature = await kernelAccount!.signTypedData(normalSwapQuoteResponse.permit2.eip712);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          signature = await walletClient!.signTypedData(normalSwapQuoteResponse.permit2.eip712);
        }
        console.log("Signed permit2 message from quote response");
      } catch (error) {
        console.error("Error signing permit2 coupon:", error);
        setShowConfirmation(false);
        setFailedTransaction(true);
      }

      // (2) Append signature length and signature data to calldata

      if (signature && normalSwapQuoteResponse?.transaction?.data) {
        const signatureLengthInHex = numberToHex(size(signature), {
          signed: false,
          size: 32,
        });

        const transactionData = normalSwapQuoteResponse.transaction.data as Hex;
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        normalSwapQuoteResponse.transaction.data = concat([
          transactionData,
          sigLengthHex,
          sig,
        ]);
      } else {
        setShowConfirmation(false);
        setFailedTransaction(true);
        throw new Error("Failed to obtain signature or transaction data");
      }
    }
    // (3) Submit the transaction with Permit2 signature
    try {
      const tx = await signer!.sendTransaction({
        gasLimit: normalSwapQuoteResponse?.transaction.gas
          ? BigInt(normalSwapQuoteResponse?.transaction.gas)
          : undefined,
        to: normalSwapQuoteResponse?.transaction.to,
        data: normalSwapQuoteResponse.transaction.data, // submit
        value: normalSwapQuoteResponse?.transaction.value
          ? BigInt(normalSwapQuoteResponse.transaction.value)
          : undefined, // value is used for native tokens
      })

      // setTransactionHash(tx.hash)
      const receipt = await tx.wait();
      if (receipt.status) {
        setScan(`${mapChainId2ViemChain[fromToken.chainId].blockExplorers?.default.url}/tx/${tx.hash}`)
        setTransactionProgress(100);
        setTransactionStatus('Transaction confirmed!');
      } else {
        setShowConfirmation(false);
        setFailedTransaction(true);
      }
    } catch (e) {
      //
      setShowConfirmation(false);
      setFailedTransaction(true);
    } finally {

    }
  }

  const {
    isLoading: isGaslessTransactionPending,
    hash: gaslessTransactionHash
  } = use0xGaslessSwapStatus(gaslessTradeHash)

  useEffect(() => {
    if (gaslessTransactionHash && !isGaslessTransactionPending) {
      setScan(`${mapChainId2ViemChain[fromToken.chainId].blockExplorers?.default.url}/tx/${gaslessTransactionHash}`)
      setTransactionProgress(100);
      setTransactionStatus('Transaction confirmed!');
    }
  }, [gaslessTransactionHash, isGaslessTransactionPending])

  const handleGaslessSwap = async () => {
    console.log("gasless");
    setShowConfirmation(true);
    if (kernelAccount || walletClient) {
      try {
        const gaslessQuote = quoteResponse as GaslessQuoteResponse
        const tradeSignature = await signTradeObject(walletType === WalletTypeEnum.EMBEDDED ? kernelAccount! : walletClient!, gaslessQuote); // Function to sign trade object
        const tradeDataToSubmit = await tradeSplitSigDataToSubmit(tradeSignature, gaslessQuote);
        const signature = await zeroxService.submitTrade(walletChainId, tradeDataToSubmit, approvalDataToSubmit);
        if (signature) {

          setGaslessTradeHash(signature ?? '');

        } else {
          setShowConfirmation(false);
          setFailedTransaction(true);
        }

      } catch (e) {
        setShowConfirmation(false);
        setFailedTransaction(true);
      } finally {

      }
    }
  }



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
        { progress: 50, status: 'Submitting to Protocol...' },
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
      }, 1500);

      return () => clearInterval(timer);
    }
  }, [showConfirmation]);

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
      <h3 className="mt-8 text-xl font-medium">Finding Best Rate</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Scanning DEXs for the best {fromToken.symbol} to {toToken.symbol} swap rate...
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        {/* <img 
          src={protocol.logoURI??''}
          alt={protocol?.name}
          className="w-12 h-12"
        /> */}
        <div>
          <h3 className="text-xl font-medium">Best Rate Found</h3>
          <p className="text-white/60">{protocol?.name} offers the best rate</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <TokenChainIcon src={fromToken?.logoURI} alt={fromToken?.name}
                size={"lg"} chainId={Number(fromToken?.chainId)} />
              <div>
                <div className="text-sm text-white/60">You pay</div>
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
              <span className="text-white/60">Rate</span>
              <span className="font-medium">1 {fromToken.symbol} = {formatNumberByFrac(Number(fromTokenPrice / toTokenPrice), 2)} {toToken.symbol} </span>
            </div>
          </div>
        </div>
        {!isQuoteLoading && (
          approvalRequired ?
            (
              <Button
                isLoading={isApproveLoading}
                className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
                loadingText={'Approving...'}
                colorScheme="blue"
                onClick={() => {
                  approve?.()
                }}
                isDisabled={false}
              >
                Approve {fromToken?.symbol}
              </Button>
            ) :
            (<Button
              onClick={() => handleTransaction()}
              colorScheme="blue"
              className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
            >
              Confirm Swap
            </Button>)
        )
        }
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
            Swapping {formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} {fromToken.symbol} for {formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} {toToken.symbol} via {protocol?.name}
          </p>
        </>
      ) : (
        <SuccessModal onClose={onClose} scan={scan} description={`You've successfully swapped ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} ${fromToken.symbol} for ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} ${toToken.symbol}`} />
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
          description={`Swap ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0))} ${fromToken.symbol} for ${formatNumberByFrac(convertCryptoAmount(fromAmount, 0) * fromTokenPrice / toTokenPrice)} ${toToken.symbol} via ${protocol?.name}`}
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