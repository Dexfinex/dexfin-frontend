import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import TradeChart from './trade/tradingview';
import { Orion } from "./trade/orionprotocol";
import { DEFAULT_PAIRS, CURRENCY_ICONS_URL, DEFAULT_ICON_URL, ORION_TRADE_CONFIG } from '../constants/mock/tradepairs';
import { TokenPairSelectModal } from "../components/trade/TokenPairSelection"
import { useOrionHook } from "../hooks/useOrionHook";
import { useOrionOrderbookHook } from "../hooks/useOrionOrderbookHook";
import { convertNumberIntoFormat, toFixedFloat } from "../utils/trade.util";
import { simpleFetch } from "simple-typed-fetch";
import Orderbook from "../components/trade/OrderBook/orderboox";

export let unit = new Orion().getUnit("eth");

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Token {
  name: string;
  symbol: string;
  amount: number;
  value: number;
  change24h: number;
  allocation: number;
  logo: string;
}

declare global {
  interface Window {
    savedPairsMap: Record<string, string[]>;
  }
}

// Define interfaces for your data structures
interface PairsMap {
  [key: string]: string[];
}

interface SymbolData {
  networks: string[];
  change24h?: number;
  fromCurrency?: string;
  high?: number;
  lastPrice?: number;
  low?: number;
  name?: string;
  openPrice?: number;
  toCurrency?: string;
  vol24h?: number;
}

interface SymbolToDataMap {
  [key: string]: SymbolData;
}

interface PriceFeedItem {
  change24h: { toNumber: () => number };
  fromCurrency: string;
  high: { toNumber: () => number };
  lastPrice: { toNumber: () => number };
  low: { toNumber: () => number };
  name: string;
  openPrice: { toNumber: () => number };
  toCurrency: string;
  vol24h: { toNumber: () => number };
}

interface PriceFeedAll {
  [key: string]: PriceFeedItem;
}

interface PriceFeed {
  lastPrice: { toNumber: () => number };
  change24h: { toNumber: () => number };
  high: { toNumber: () => number };
  low: { toNumber: () => number };
  vol24h: { toNumber: () => number };
}

interface PairConfig {
  pricePrecision: number;
}


const tokens: Token[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: 0.125,
    value: 8405.73,
    change24h: 1.86,
    allocation: 54.56,
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    amount: 1.5,
    value: 4875.51,
    change24h: -2.14,
    allocation: 31.65,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    amount: 15.8,
    value: 1250.32,
    change24h: 5.23,
    allocation: 8.12,
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    amount: 2500,
    value: 875.25,
    change24h: -0.95,
    allocation: 5.68,
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    amount: 150,
    value: 750.45,
    change24h: 3.12,
    allocation: 4.87,
    logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    amount: 100,
    value: 650.80,
    change24h: 2.45,
    allocation: 4.22,
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    amount: 25,
    value: 550.25,
    change24h: -1.75,
    allocation: 3.57,
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    amount: 1000,
    value: 450.60,
    change24h: 4.32,
    allocation: 2.93,
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  }
];

const performanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [12000, 13500, 14200, 14800, 15200, 15406],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

const distributionData = {
  labels: ['Spot', 'Staked', 'Lending', 'LP'],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: [
        '#10B981', // Spot - Green
        '#3B82F6', // Staked - Blue
        '#8B5CF6', // Lending - Purple
        '#F59E0B'  // LP - Orange
      ],
      borderWidth: 0
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        callback: (value: number) => '$' + value.toLocaleString()
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    }
  }
};

const ChainSelectRow = React.memo(({ network, hasIcon }) => {
  return (
    <div className="chain-select-row flex">
      <img width="27" height="27" className={"icon-img"} src={network.icon} />
      <div className="name">{network.name}</div>
    </div>
  );
});

export const TradingViewModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastPrice, setLastPrice] = useState(0);
  const [change24, setChange24] = useState(0);
  const [high24, setHigh24] = useState(0);
  const [low24, setLow24] = useState(0);
  const [vol24, setVol24] = useState(0);
  const [pairConfig, setPairConfig] = useState({
    pricePrecision: 2,
    qtyPrecision: 5,
  });
  const [open, setIsOpen] = useState(false);
  const [chainServiceInfo, setChainServiceInfo] = useState(null);
  const [quotedPriceInfo, setQuotedPriceInfo] = useState(null);
  const [symbolAssetIn, setSymbolAssetIn] = useState("");
  const [symbolAssetOut, setSymbolAssetOut] = useState("");
  const [selectedTab, setSelectedTab] = useState('tokens');
  const [currentPairSymbol, setCurrentPairSymbol] = useState(
    "ETH-USDT"
  );

  const { priceFeedAll, balances, orderHistories } = useOrionHook(unit);
  const { currentPriceFeed, asks, bids } = useOrionOrderbookHook(
    currentPairSymbol,
    unit
  );

  const [symbolToDataMap, setSymbolToDataMap] = useState({});
  const [pairs, setPairs] = useState({});
  const [isPairSelectModalVisible, setIsPairSelectModalVisible] =
    useState(false);
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const [currentNetwork, setCurrentNetwork] = useState(
    ORION_TRADE_CONFIG.networks[1]
  );

  const [selectableNetworks, setSelectableNetworks] = useState(
    Object.values(ORION_TRADE_CONFIG.networks)
  );

  useEffect(() => {
    (async () => {
      try {
        const orion = new Orion();
        orion.getUnit("eth");
        let _pairs: PairsMap = {};
        try {
          _pairs = await orion.getPairs("spot");
        } catch (e) {
          _pairs = DEFAULT_PAIRS;
        }
        window.savedPairsMap = _pairs;
        setPairs(_pairs);
        setSymbolToDataMap((prev: SymbolToDataMap) => {
          const newData: SymbolToDataMap = {};
          const keys = Object.keys(_pairs);
          keys.forEach((key) => {
            let value: SymbolData = { networks: [] };
            if (prev[key]) value = { ...prev[key] };

            value.networks = _pairs[key].sort((a, b) => (a > b ? 1 : -1));
            newData[key] = value;
          });

          return {
            ...prev,
            ...newData,
          };
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (priceFeedAll) {
      setSymbolToDataMap((prev: SymbolToDataMap) => {
        const keys = Object.keys(priceFeedAll);
        const newData: SymbolToDataMap = {};

        keys.forEach((key) => {
          let value: Partial<SymbolData> = {};

          if (prev[key]) value = { ...prev[key] };

          if (priceFeedAll[key]) {
            const feed = priceFeedAll[key];
            value.change24h = feed.change24h.toNumber() === Infinity ? 0 : feed.change24h.toNumber();
            value.fromCurrency = feed.fromCurrency;
            value.high = feed.high.toNumber();
            value.lastPrice = feed.lastPrice.toNumber();
            value.low = feed.low.toNumber();
            value.name = feed.name;
            value.openPrice = feed.openPrice.toNumber();
            value.toCurrency = feed.toCurrency;
            value.vol24h = feed.vol24h.toNumber();
            newData[key] = value as SymbolData;
          }
        });

        return {
          ...prev,
          ...newData,
        };
      });
    }
  }, [priceFeedAll]);

  useEffect(() => {
    if (currentPriceFeed) {
      setLastPrice(
        toFixedFloat(
          currentPriceFeed.lastPrice.toNumber(),
          pairConfig.pricePrecision
        )
      );

      setChange24(
        currentPriceFeed.change24h.toNumber() === Infinity
          ? 0
          : currentPriceFeed.change24h.toNumber()
      );

      setHigh24(
        currentPriceFeed.high.toNumber() === 0
          ? "N/A"
          : toFixedFloat(
            currentPriceFeed.high.toNumber(),
            pairConfig.pricePrecision
          )
      );

      setLow24(
        currentPriceFeed.low.toNumber() === 0
          ? "N/A"
          : toFixedFloat(
            currentPriceFeed.low.toNumber(),
            pairConfig.pricePrecision
          )
      );

      setVol24(convertNumberIntoFormat(currentPriceFeed.vol24h.toNumber()));
    }
  }, [currentPriceFeed, pairConfig.pricePrecision]);

  useEffect(() => {
    if (currentPairSymbol && currentPairSymbol.length > 0) {
      const terms = currentPairSymbol.split("-");
      setSymbolAssetIn(terms[0]);
      setSymbolAssetOut(terms[1]);

      let networks = pairs[currentPairSymbol];

      if (networks && networks.length > 0) {
        let _selectableNetworks = [];
        networks.forEach((chainId) => {
          ORION_TRADE_CONFIG.networks[chainId]
            ? _selectableNetworks.push(ORION_TRADE_CONFIG.networks[chainId])
            : null;
        });

        setSelectableNetworks(_selectableNetworks);

        let targetChainId = currentNetwork.chainId;

        if (networks.indexOf(currentNetwork.chainId) < 0) {
          // currentNetwork is not included in selectable networks
          setCurrentNetwork(_selectableNetworks[0]);
          targetChainId = _selectableNetworks[0].chainId;
        }

        console.log("unit = ", targetChainId);
        unit = new Orion().getUnit(targetChainId); // ready to go
      }

      (async () => {
        try {
          const newPairConfig = await simpleFetch(
            unit.aggregator.getPairConfig
          )(currentPairSymbol);
          setPairConfig(newPairConfig);

          const info = await simpleFetch(unit.blockchainService.getInfo)();

          const assetSymbols = Object.keys(info.assetToAddress);
          for (let i = 0; i < assetSymbols.length; i++) {
            if (
              info.assetToAddress[assetSymbols[i]] ===
              "0x0000000000000000000000000000000000000000"
            ) {
              info.baseSymbol = assetSymbols[i];
              break;
            }
          }
          // -------- ---- ----------

          setChainServiceInfo(info);
          console.log("serviceInfo", info);

          const _feeAssets = await simpleFetch(
            unit.blockchainService.getTokensFee
          )();
          delete _feeAssets["ORN"];
          setFeeAssets(_feeAssets);
          console.log("feeAssets", _feeAssets, info);

          const _quotedPriceInfo = await simpleFetch(
            unit.blockchainService.getPricesWithQuoteAsset
          )();
          console.log("quotedPriceInfo", _quotedPriceInfo);
          setQuotedPriceInfo(_quotedPriceInfo);
        } catch (e) {
          console.error("------TRADE----", e);
        }
      })();
    }
  }, [currentPairSymbol, currentNetwork]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[90%] h-[90%] rounded-xl'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Trade</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 h-[calc(100%-73px)] overflow-y-auto ai-chat-scrollbar">
          <div className="flex items-center bg-white/5 rounded-xl p-1 pl-2 mb-6" >
            <div className="flex items-center gap-2 h-full border-r border-white/10 pr-5 cursor-pointer duration-200" onClick={() => setIsPairSelectModalVisible(true)}>
              <img src={
                CURRENCY_ICONS_URL +
                currentPairSymbol.split("-")[0].toLowerCase() +
                ".svg"
              }
                onError={(e: any) => {
                  e.target.src = DEFAULT_ICON_URL;
                }} alt="ETH" className="rounded-full w-9 h-9" />
              <span className="text-1xl font-bold text-white hover:text-green-400 transition-colors duration-200">{currentPairSymbol.split("-").join("/")}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <TokenPairSelectModal
              symbolToDataMap={symbolToDataMap}
              open={isPairSelectModalVisible}
              setOpen={setIsPairSelectModalVisible}
              setCurrentPairSymbol={setCurrentPairSymbol}
            />
            <div className="px-4 border-r border-white/10 h-full flex items-center pr-5 pl-5">
              <span className="text-red-500 text-2xl font-bold" style={{
                color: change24 < 0 ? 'red' : 'green',
              }}>{lastPrice}</span>
            </div>

            <div className="flex h-full pr-5 pl-1">
              <div className="px-4 border-r border-white/10 h-full flex flex-col justify-center">
                <div className="text-md text-gray-500">24h Change</div>
                <div className={`text-md font-bold flex items-center ${change24 < -0.004
                  ? 'text-red-500'
                  : change24 > 0.004
                    ? 'text-green-500'
                    : 'text-white'
                  }`}>
                  <span className="flex items-center">
                    {change24 < -0.004 ? (
                      <TrendingDown className="trending-icon mr-1" size={16} />
                    ) : change24 > 0.004 ? (
                      <TrendingUp className="trending-icon mr-1" size={16} />
                    ) : null}
                    {toFixedFloat(Math.abs(change24))}%
                  </span>
                </div>
              </div>

              <div className="px-4 border-r border-white/10 h-full flex flex-col justify-center pr-5 pl-5">
                <div className="text-md text-gray-500">24h High</div>
                <div className="text-md font-bold text-white">{high24}</div>
              </div>

              <div className="px-4 border-r border-white/10 h-full flex flex-col justify-center pr-5 pl-5">
                <div className="text-md text-gray-500">24h Low</div>
                <div className="text-md font-bold text-white">{low24}</div>
              </div>

              <div className="px-4 border-r border-white/10 h-full flex flex-col justify-center pr-5 pl-5">
                <div className="text-md text-gray-500">24h Volume</div>
                <div className="text-md font-bold text-white">{vol24}</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 h-full border-white/10">
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!open)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 
                   rounded-lg border border-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={currentNetwork.icon}
                      alt={currentNetwork.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {currentNetwork.name}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {open && (
                  <div className="absolute top-full mt-1 w-full min-w-[145px] py-1 
                      bg-gray-900/95 backdrop-blur-sm border border-white/10 
                      rounded-lg shadow-xl z-50">
                    {selectableNetworks.map((network, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentNetwork(network);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 
                         hover:bg-white/5 transition-colors duration-200"
                      >
                        <img
                          src={network.icon}
                          alt={network.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-white">
                          {network.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="col-span-3 bg-white/5 rounded-xl p-1">
              <div className="flex items-center justify-between mb-4">
              </div>
              <div className="h-[600px]">
                <TradeChart
                  pairSymbol={currentPairSymbol}
                />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Order Book</h3>
              </div>
              <Orderbook
                pricePrecision={pairConfig.pricePrecision}
                asks={asks}
                bids={bids}
                symbolAssetIn={symbolAssetIn}
                symbolAssetOut={symbolAssetOut}
                lastPrice={lastPrice}
                pairConfig={pairConfig}
                pairSymbol={currentPairSymbol}
              />
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 p-2">
              {['tokens', 'defi', 'nfts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${selectedTab === tab
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4">
              {selectedTab === 'tokens' && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto ai-chat-scrollbar">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={token.logo}
                        alt={token.name}
                        className="w-8 h-8"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{token.name}</span>
                          <span className="text-white/60">{token.symbol}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{token.amount} {token.symbol}</span>
                          <span className="text-white/40">•</span>
                          <span>${token.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg">${token.value.toLocaleString()}</div>
                        <div className={`flex items-center gap-1 justify-end text-sm ${token.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                          {token.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{Math.abs(token.change24h)}%</span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-white/60">Allocation</span>
                          <span>{token.allocation}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${token.allocation}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};