export interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export interface CoinData {
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
  }
  
  export interface CartItem {
    id: string;
    name: string;
    symbol: string;
    price: number;
    logo: string;
    category: string;
    quantity: number;
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