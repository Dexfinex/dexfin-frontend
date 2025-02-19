import React, { useEffect, useState } from 'react';
import { ArrowRight, Wallet, X, ShieldClose } from 'lucide-react';

import { TokenType, Step } from '../../../types/brian.type';
import { convertCryptoAmount } from '../../../utils/brian';
import { shrinkAddress } from '../../../utils/common.util';
import { mapChainId2ViemChain } from '../../../config/networks';
import { useBrianTransactionMutation } from '../../../hooks/useBrianTransaction.ts';
import { FailedTransaction } from '../modals/FailedTransaction.tsx';
import { SuccessModal } from '../modals/SuccessModal.tsx';
import { formatNumberByFrac } from '../../../utils/common.util';

interface SendProcessProps {
  onClose: () => void;
  fromToken: TokenType;
  toToken: TokenType;
  fromAmount: string;
  receiver: string;
  steps: Step[];
}

export const SendProcess: React.FC<SendProcessProps> = ({ steps, receiver, fromAmount, toToken, fromToken, onClose }) => {
  const [step/*, setStep*/] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');
  const [scan, setScan] = useState<string>('https://etherscan.io/');
  const { mutate: sendTransactionMutate } = useBrianTransactionMutation();

  const handleTransaction = async (data: any) => {
    try {

      if (steps.length === 0) {
        console.error("No transaction details available");
        return;
      }
      setShowConfirmation(true);

      sendTransactionMutate(
        { transactions: data, duration: 0 },
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
    if (showConfirmation) {
      const stages = [
        { progress: 25, status: 'Preparing transaction...' },
        { progress: 50, status: 'Submitting to network...' },
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

  const renderPreview = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Send {fromToken?.symbol}</h3>
          <p className="text-white/60">Review transaction details</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img
                src={fromToken.logoURI}
                alt="USDC"
                className="w-10 h-10"
              />
              <div>
                <div className="text-sm text-white/60">Amount</div>
                <div className="text-xl font-medium">{fromToken ? formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals)) : ''} {fromToken?.symbol}</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white/40 hidden md:block" />
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik"
                alt="Vitalik"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm text-white/60">Recipient</div>
                <div className="text-xl font-medium">{shrinkAddress(receiver)}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Network</span>
              <span className="font-medium">{mapChainId2ViemChain[fromToken.chainId].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Amount</span>
              <span className="font-medium">{formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals))} {fromToken?.symbol}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleTransaction(steps)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Confirm Send
        </button>
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
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik"
              alt="Vitalik"
              className="w-12 h-12 rounded-full"
            />
          </div>
          <p className="mt-4 text-white/60">
            Sending {formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals))} {fromToken?.symbol} to {shrinkAddress(receiver)}
          </p>
        </>
      ) : (
        <SuccessModal onClose={onClose} scan={scan} description={`Successfully sent ${formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals))} ${fromToken?.symbol} to ${shrinkAddress(receiver)}`} />
      )}
    </div>
  );

  const renderFailedTransaction = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <ShieldClose className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">Failed Transaction</h3>
      <p className="text-white/60 mb-2">
        Failed {formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals))} {fromToken?.symbol} to {shrinkAddress(receiver)}
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg mt-6"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500' : 'bg-white/10'
              }`}>
              <span>1</span>
            </div>
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
        <FailedTransaction onClose={onClose} description={`Send ${formatNumberByFrac(convertCryptoAmount(fromAmount, fromToken.decimals))} ${fromToken?.symbol} to ${shrinkAddress(receiver)}`} />
      }
      {showConfirmation && !failedTransaction ? renderConfirmation() : (
        <div className="h-[calc(100%-60px)]">
          {renderPreview()}
        </div>
      )}
    </div>
  );
};