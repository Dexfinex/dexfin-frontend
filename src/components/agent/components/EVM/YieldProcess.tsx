import React, { useState, useContext, useEffect } from 'react';
import { Bot, Search, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Yield } from '../../../../types/brian.type.ts';
import { useAgentMutation } from '../../../../hooks/useAgentAction.ts';
import { Web3AuthContext } from '../../../../providers/Web3AuthContext.tsx';
import { formatVolume } from '../../../../utils/agent.util.tsx';
import { FailedTransaction } from '../../modals/FailedTransaction.tsx';
import { SuccessModal } from '../../modals/SuccessModal.tsx';
import { protocolLogos } from '../../../../constants/agent.constants.ts'
interface YieldProcessProps {
  onClose: () => void;
  yields: Yield[];
}

export const YieldProcess: React.FC<YieldProcessProps> = ({ yields, onClose }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(0);
  const { address } = useContext(Web3AuthContext);
  const [progress, setProgress] = useState(0);
  const [scan, setScan] = useState<string>('https://etherscan.io/');
  const [selectedProtocol, setSelectedProtocol] = useState<Yield | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [failedTransaction, setFailedTransaction] = useState(false);
  const [transactionProgress, setTransactionProgress] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState('Initializing transaction...');
  const { mutate: sendTransactionMutate } = useAgentMutation();
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

  const handleTransaction = async (data: any) => {
    try {
      if (!selectedProtocol) {
        console.error("No transaction details available");
        return;
      }
      setShowConfirmation(true);

      sendTransactionMutate(
        { transaction: data, fromAddress: address, amount: amount },
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
      <h3 className="mt-8 text-xl font-medium">Observer Agent</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Analyzing market conditions and scanning protocols for the best USDC yield opportunities...
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Search className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-medium">Task Manager Agent</h3>
          <p className="text-white/60">Reviewing and analyzing yield opportunities</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {yields.map((yieldItem, index) => (
          <div
            key={index}
            onClick={() => setSelectedProtocol(yieldItem)}
            className={`p-4 rounded-xl transition-all cursor-pointer ${selectedProtocol?.address === yieldItem.address
              ? 'bg-blue-500/20 border border-blue-500/50'
              : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
          >
            <div className="flex items-center gap-4 mb-2">

              {yieldItem?.protocolLogo &&
                <img
                  src={protocolLogos[yieldItem?.protocol] ? protocolLogos[yieldItem?.protocol] : yieldItem?.protocolLogo[0] + '?raw=true'}
                  alt={yieldItem?.protocol}
                  className="w-8 h-8 object-contain rounded"
                />
              }
              <div className="flex-1 flex items-center justify-between">

                <h4 className="font-medium">{yieldItem.protocol}</h4>
                <div className="text-lg font-semibold text-blue-400">
                  {yieldItem.apy.toFixed(2)}% APY
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <span className="text-white/40">TVL:</span>{' '}
                  <span className="text-white/80">
                    {yieldItem.tvl > 1000000000000000 ? formatVolume(yieldItem.tvl / 100000000) : formatVolume(yieldItem.tvl)}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  {yieldItem.symbol}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end items-center">
        <input
          type="number"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-36 px-2 py-2 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-colors"
        />
        <div className="pr-3 pl-1">
          {"USDC"}
        </div>
        <button
          onClick={() => selectedProtocol && setStep(3)}
          disabled={!selectedProtocol || !amount}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          {selectedProtocol?.protocolLogo &&
            <img
              src={protocolLogos[selectedProtocol?.protocol] ? protocolLogos[selectedProtocol?.protocol] : selectedProtocol?.protocolLogo[0] + '?raw=true'}
              alt={selectedProtocol?.protocol}
              className="w-8 h-8 object-contain rounded"
            />
          }
        </div>
        <div>
          <h3 className="text-xl font-medium">{selectedProtocol?.protocol}</h3>
          <p className="text-white/60">Ready to execute yield strategy</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 rounded-xl p-6">
        <h4 className="text-lg font-medium mb-4">Transaction Summary</h4>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">

              <img
                src="https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694"
                alt="USDC"
                className="w-8 h-8 object-contain"
              />
              <div>
                <div className="text-sm text-white/60">Amount</div>
                <div className="text-lg font-medium">{amount} USDC</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/40" />
            <div className="flex items-center gap-3">
              {selectedProtocol?.logosUri[0] &&
                <img
                  src={selectedProtocol?.logosUri[0]}
                  alt={selectedProtocol?.name}
                  className="w-8 h-8"
                />
              }
              <div className="text-right">
                <div className="text-sm text-white/60"></div>
                <div className="text-lg font-medium">{selectedProtocol?.symbol}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-white/60">Expected APY</span>
              <span className="text-blue-400 font-medium">
                {selectedProtocol?.apy.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between mb-2">

            </div>

          </div>
        </div>

        <button
          onClick={() => handleTransaction(selectedProtocol)}
          className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg font-medium"
        >
          Confirm Deposit
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
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
              alt="USDC"
              className="w-12 h-12"
            />
            <ArrowRight className="w-6 h-6 text-white/40" />
            {selectedProtocol?.logosUri[0] &&
              <img
                src={selectedProtocol?.logosUri[0]}
                alt={selectedProtocol?.name}
                className="w-12 h-12"
              />
            }
          </div>
          <p className="mt-4 text-white/60">
            Depositing {amount} USDC into {selectedProtocol?.name}
          </p>
        </>
      ) : (
        <SuccessModal onClose={onClose} scan={scan} description={`Your USDC has been successfully deposited into ${selectedProtocol?.name}`} />
      )}
    </div>
  );

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-blue-500' : 'bg-white/10'
                  }`}>
                  {step > s ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{s}</span>
                  )}
                </div>
                {s < 3 && (
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
          description={`Deposit  ${amount} USDC for ${selectedProtocol?.name} via ${selectedProtocol?.protocol}`}
          onClose={onClose}
        />}
      {showConfirmation && !failedTransaction ? renderConfirmation() : (
        <div className="h-[calc(100%-60px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      )}
    </div>
  );
};