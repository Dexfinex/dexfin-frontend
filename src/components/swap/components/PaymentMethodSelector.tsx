import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import { PaymentMethod } from '../../../types/swap.type';
import {PaymentMethodModal} from "../modals/PaymentMethodModal";

interface PaymentMethodSelectorProps {
  selectedMethods: PaymentMethod[];
  onMethodsChange: (methods: PaymentMethod[]) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'usdt',
    name: 'USDT',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    network: 'Ethereum',
    balance: 1500,
    price: 1.001,
    priceChange: 0.00,
  },
  {
    id: 'usdc',
    name: 'USDC',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    network: 'Ethereum',
    balance: 2500,
    price: 1,
    priceChange: -0.01,
  },
  {
    id: 'eth',
    name: 'ETH',
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    network: 'Ethereum',
    balance: 1.5,
    price: 3571.76,
    priceChange: 0.27,
  },
  {
    id: 'btc',
    name: 'BTC',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    network: 'Bitcoin',
    balance: 0.15,
    price: 95329.92,
    priceChange: 0.64,
  },
  {
    id: 'sol',
    name: 'SOL',
    icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    network: 'Solana',
    balance: 25,
    price: 224.47,
    priceChange: 0.99,
  },
];

export function PaymentMethodSelector({
  selectedMethods,
  onMethodsChange,
}: PaymentMethodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#222] hover:bg-[#2a2a2a] rounded-lg p-2 transition-colors"
      >
        <div className="flex -space-x-2">
          {PAYMENT_METHODS.slice(0, 3).map((method) => (
            <img
              key={method.id}
              src={method.icon}
              alt={method.name}
              className="w-6 h-6 rounded-full ring-2 ring-[#191919]"
            />
          ))}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <PaymentMethodModal
          selectedMethods={selectedMethods}
          onMethodsChange={onMethodsChange}
          onClose={() => setIsOpen(false)}
          methods={PAYMENT_METHODS}
        />
      )}
    </div>
  );
}