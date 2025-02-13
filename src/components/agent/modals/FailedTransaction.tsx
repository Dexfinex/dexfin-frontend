import { ShieldClose } from 'lucide-react';

interface FailedTransactionProps {
  onClose: () => void;
  description: string;
}
export const FailedTransaction: React.FC<FailedTransactionProps> = ({ onClose, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <ShieldClose className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">Failed Transaction</h3>
      <p className="text-white/60 mb-2">{description}</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg mt-6"
      >
        Close
      </button>
    </div>
  );
};