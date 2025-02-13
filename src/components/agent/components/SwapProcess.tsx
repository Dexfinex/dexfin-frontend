import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CheckCircle2, X, ShieldClose } from 'lucide-react';
import { TokenType, Step, Protocol } from '../../../types/brian.type';
import { convertCryptoAmount } from '../../../utils/brian';
import { formatNumberByFrac } from '../../../utils/common.util';
import { useBrianTransactionMutation } from '../../../hooks/useBrianTransaction.ts';


interface SwapProcessProps {
  onClose: () => void;
  fromToken: TokenType;
  toToken: TokenType;
  fromAmount: string;
  receiver: string;
  steps: Step[];
  protocol: Protocol;
}

export const SwapProcess: React.FC<SwapProcessProps> = ({ steps, receiver, fromAmount, toToken, fromToken, protocol, onClose }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');
  const { mutate: sendTransactionMutate } = useBrianTransactionMutation();
  const [scan, setScan] = useState<string>('https://etherscan.io/');

  const handleTransaction = async (data: any) => {
    try {
      if (steps.length === 0) {
        console.error("No transaction details available");
        return;
      }
      setShowConfirmation(true);

      sendTransactionMutate(
        { transactions: data },
        {
          onSuccess: (receipt) => {
            setTransactionProgress(100);
            setTransactionStatus('Transaction confirmed!');
            setScan(receipt ?? '');
          },
          onError: (error) => {
            console.log(error);
            setShowConfirmation(false);
            setFailedTransaction(true);
          },
        },
      );

    } catch (error) {
      console.error("Error executing transactions:", error);
      setShowConfirmation(false);
      setFailedTransaction(true);
    }
  };


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
        { progress: 50, status: 'Submitting to Uniswap V3...' },
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
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={fromToken.logoURI}
                alt={fromToken.symbol}
                className="w-10 h-10"
              />
              <div>
                <div className="text-sm text-white/60">You pay</div>
                <div className="text-xl font-medium">{convertCryptoAmount(fromAmount, fromToken.decimals)} {fromToken.symbol}</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/40" />
            <div className="flex items-center gap-3">
              <img
                src={toToken.logoURI}
                alt={toToken.symbol}
                className="w-10 h-10"
              />
              <div>
                <div className="text-sm text-white/60">You receive</div>
                <div className="text-xl font-medium">{formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals) * fromToken.priceUSD / toToken.priceUSD)} {toToken.symbol}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Rate</span>
              <span className="font-medium">1 {toToken.symbol} = ${formatNumberByFrac(Number(toToken.priceUSD), 2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleTransaction(steps)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Confirm Swap
        </button>
      </div>
    </div>
  );

  const renderFailedTransaction = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <ShieldClose className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">Failed Transaction</h3>
      <p className="text-white/60 mb-2">
          Swap {convertCryptoAmount(fromAmount, fromToken.decimals)} {fromToken.symbol} for {formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals) * fromToken.priceUSD / toToken.priceUSD)} {toToken.symbol} via {protocol.name}
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg mt-6"
      >
        Close
      </button>
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
            Swapping {convertCryptoAmount(fromAmount, fromToken.decimals)} {fromToken.symbol} for {formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals) * fromToken.priceUSD / toToken.priceUSD)} {toToken.symbol} via {protocol.name}
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Swap Successful!</h3>
          <p className="text-white/60 mb-6">
            You've successfully swapped {convertCryptoAmount(fromAmount, fromToken.decimals)} {fromToken.symbol} for {formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals) * fromToken.priceUSD / toToken.priceUSD)} {toToken.symbol}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg"
          >
            Close
          </button>
        </>
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
      {failedTransaction && renderFailedTransaction()}
      {showConfirmation && !failedTransaction ? renderConfirmation() : (
        <div className="h-[calc(100%-60px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>
      )}
    </div>
  );
};