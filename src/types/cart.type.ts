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
export interface TokenType {
  address: string;
  chainId: number;
  decimals: number;
  symbol: string;
  name: string;
  logoURI: string;
  category: string;
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
