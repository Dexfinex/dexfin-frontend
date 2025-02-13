import { CheckCircle2 } from 'lucide-react';
import { Link } from '@chakra-ui/react';

interface SuccessModalProps {
  onClose: () => void;
  description: string;
  scan: string;
}
export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, description, scan }) => {
  return (
    <>
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">Transaction Successful!</h3>
      <p className="text-white/60 mb-2">
        {description}
      </p>
      <Link
        href={scan}
        isExternal
        color="blue.500"
        _hover={{ textDecoration: 'underline' }}
      >
        View Transaction
      </Link>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg mt-6"
      >
        Close
      </button>
    </>
  );
};