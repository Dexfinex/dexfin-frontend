export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  marketCapRank: number;
  volume24h: number;
  sparkline: number[];
  category: string;
  platform: string;
  quantity: number

}
export interface CartItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  logo: string;
  category: string;
  quantity: number;
  chainId: number;
  decimals: number;
}
export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
    };
    tooltip: {
      enabled: boolean;
    };
  };
  scales: {
    x: {
      display: boolean;
    };
    y: {
      display: boolean;
    };
  };
  elements: {
    point: {
      radius: number;
    };
  };
}
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    borderColor: string;
    borderWidth: number;
    fill: boolean;
    backgroundColor: string;
    tension: number;
  }[];
}
export interface PurchaseStatus {
  status: 'idle' | 'loading' | 'quoting' | 'success' | 'error';
  message: string;
}
export interface PlatformAddresses {
  'arbitrum-one'?: string;
  'avalanche'?: string;
  'binance-smart-chain'?: string;
  'ethereum'?: string;
  'fantom'?: string;
  'harmony-shard-0'?: string;
  'huobi-token'?: string;
  'milkomeda-cardano'?: string;
  'near-protocol'?: string;
  'optimistic-ethereum'?: string;
  'osmosis'?: string;
  'polygon-pos'?: string;
  'sora'?: string;
  'xdai'?: string;
  [key: string]: string | undefined;
}
export interface TokenTypeB {
  category: string;
  chainId: number;
  decimals: number;
  id: string;
  logoURI: string;
  marketCap: number;
  marketCapRank: number;
  name: string;
  platforms: PlatformAddresses;
  price: number;
  priceChange24h: number;
  sparkline: number[];
  symbol: string;
  volume24h: number;
  address: string;
}
export interface TokenPurchaseDetails {
  tokenSymbol: string;
  amount: number;
  costInUSD: number;
}
export interface ZeroxQuoteRequestType {
  chainId: number;
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellTokenAmount: string;
  takerAddress: string;
}
export interface QuoteResponse {
  price: string;
  guaranteedPrice: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
  buyAmount: string;
  sources: any[];
  protocolFee: string;
  minimumProtocolFee: string;
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
}
export interface CoinGridProps {
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (coin: any) => void;
  walletChainId: number;
}
export interface SearchHeaderProps {
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}
export interface CheckoutSectionProps {
  cartItems: any[];
  tokenPrices: Record<string, number>;
  walletAddress: string | null;
  buyError: string | null;
  processingBuy: boolean;
  isBuyPending: boolean;
  onClose: () => void;
  onExecuteBuy: () => Promise<void>;
}
export interface TokenPurchaseDetails {
  tokenSymbol: string;
  amount: number;
  costInUSD: number;
}

export interface TransactionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionHashes: string[];
  chainExplorerUrl: string;
  tokenDetails: TokenPurchaseDetails[];
}
export interface CartListProps {
  cartItems: any[];
  tokenPrices: Record<string, number>;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

export interface CartItemProps {
  item: any;
  coinPrice: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}