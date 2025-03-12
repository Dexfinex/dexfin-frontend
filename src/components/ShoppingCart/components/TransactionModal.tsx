
import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { TokenPurchaseDetails } from '../../../types/cart.type';

interface TransactionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionHashes: string[];
  chainExplorerUrl: string;
  tokenDetails: TokenPurchaseDetails[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  setOpen,
  transactionHashes,
  chainExplorerUrl,
  tokenDetails
}) => {
  if (!open) return null;

  const getTotalCost = () => {
    return tokenDetails.reduce((total, token) => total + token.costInUSD, 0);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-gray-800 max-w-md mx-auto rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold">Purchase Successful!</h3>
          <p className="text-gray-400">
            Your purchase of {tokenDetails.length} {tokenDetails.length === 1 ? 'token' : 'tokens'} for approximately ${getTotalCost().toFixed(2)} was successful.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="font-medium">Purchased Tokens:</h4>
          <div className="space-y-2">
            {tokenDetails.map((detail, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700/30 rounded-lg p-3">
                <div>
                  <div className="font-medium">{detail.tokenSymbol}</div>
                  <div className="text-sm text-gray-400">Amount: {detail.amount}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${detail.costInUSD.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Transaction Details:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactionHashes.map((hash, index) => (
              <a
                key={index}
                href={`${chainExplorerUrl}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors"
              >
                <div className="truncate mr-2 max-w-[200px]">{hash}</div>
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;