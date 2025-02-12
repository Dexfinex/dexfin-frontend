import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Tabs, TabList, TabPanels, Tab, TabPanel, MenuButton, Button, MenuList, MenuItem, Menu } from '@chakra-ui/react'
import TradeChart from './trade/TradingView';
import { Orion } from "./trade/OrionProtocol";
import { DEFAULT_PAIRS, CURRENCY_ICONS_URL, DEFAULT_ICON_URL, ORION_TRADE_CONFIG } from '../constants/mock/tradepairs';
import { TokenPairSelectModal } from "../components/trade/TokenPairSelection"
import { useOrionHook } from "../hooks/useOrionHook";
import { useOrionOrderbookHook } from "../hooks/useOrionOrderbookHook";
import { convertNumberIntoFormat, toFixedFloat } from "../utils/trade.util";
import { simpleFetch } from "simple-typed-fetch";
import Orderbook from "./trade/OrderBook/OrderBook";
import MarketAndLimitPanel from "./trade/BuySell/components/MarketAndLimitPanel";
import OrderHistorySection from "./trade/OrderHistorySection";
import "../components/trade/style.scss"
import { useStore } from '../store/useStore';




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
    <div className="flex chain-select-row">
      <img width="27" height="27" className={"icon-img"} src={network.icon} />
      <div className="name">{network.name}</div>
    </div>
  );
});

export const TradingViewModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
const { theme } = useStore();

  const {
    isTradeChartOpen,
    setIsTradeChartOpen
} = useStore();

useEffect(() => {
  document.body.setAttribute('data-theme', theme);
}, [theme]);
  const [currentMLIndex, setCurrentMLIndex] = useState(0);
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
  const [feeAssets, setFeeAssets] = useState({});
  const [networkGasFee, setNetworkGasFee] = useState(0);

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
  const [mobileTabClassName, setMobileTabClassName] = useState('exchange');
  const [mobileTabIndex, setMobileTabIndex] = useState([1, 0, 0]);
  const [isClosed, setIsClosed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 200 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const redColor = '#f03349', greenColor = '#179981';
  const handleMinimize = () => setIsMinimized(!isMinimized);

  const handleClose = () => {
    setIsClosed(true);
    onClose();

  }

  if (isClosed) return null;

  useEffect(() => {
    const classNames = ['exchange', 'chart'/*, 'history'*/, 'orderbook'];
    setMobileTabClassName(classNames[mobileTabIndex]);

  }, [mobileTabIndex])
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
      setSymbolToDataMap(prev => {
        const keys = Object.keys(priceFeedAll);
        const newData = {};
        keys.forEach(key => {

          let value = {};

          if (prev[key])
            value = { ...prev[key] };

          if (priceFeedAll[key]) {
            value.change24h = priceFeedAll[key].change24h.toNumber() === Infinity ? 0 : priceFeedAll[key].change24h.toNumber();
            value.fromCurrency = priceFeedAll[key].fromCurrency;
            value.high = priceFeedAll[key].high.toNumber();
            value.lastPrice = priceFeedAll[key].lastPrice.toNumber();
            value.low = priceFeedAll[key].low.toNumber();
            value.name = priceFeedAll[key].name;
            value.openPrice = priceFeedAll[key].openPrice.toNumber();
            value.toCurrency = priceFeedAll[key].toCurrency;
            value.vol24h = priceFeedAll[key].vol24h.toNumber();
            newData[key] = value;
          }
        })

        return {
          ...prev,
          ...newData
        };
      });

    }

  }, [priceFeedAll])

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
          // console.log("feeAssets", _feeAssets, info);

          const _quotedPriceInfo = await simpleFetch(
            unit.blockchainService.getPricesWithQuoteAsset
          )();
          setQuotedPriceInfo(_quotedPriceInfo);
        } catch (e) {
          console.error("------TRADE----", e);
        }
      })();
    }
  }, [currentPairSymbol, currentNetwork]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass  border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${isFullscreen
          ? 'w-full h-full rounded-none'
          : 'w-[90%] h-[90%] rounded-xl'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Trade</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 transition-colors rounded-lg hover:bg-white/10"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-73px)] overflow-y-auto ai-chat-scrollbar">
          {/* Header */}
          <div className="flex flex-col items-center justify-between gap-2 p-4 transition-all border-b lg:flex-row border-white/10" >
            <div className="flex items-center space-x-4" onClick={() => setIsPairSelectModalVisible(true)}>
              <div className='flex items-center space-x-2 cursor-pointer'>
                <img src={
                  CURRENCY_ICONS_URL +
                  currentPairSymbol.split("-")[0].toLowerCase() +
                  ".svg"
                }
                  onError={(e: any) => {
                    e.target.src = DEFAULT_ICON_URL;
                  }} alt="ETH" className="rounded-full w-9 h-9" />
                <span className="font-bold text-white transition-colors duration-200 text-1xl hover:text-green-400">{currentPairSymbol.split("-").join("/")}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <TokenPairSelectModal
              symbolToDataMap={symbolToDataMap}
              open={isPairSelectModalVisible}
              setOpen={setIsPairSelectModalVisible}
              setCurrentPairSymbol={setCurrentPairSymbol}
            />
            <div className="flex items-center h-full px-4 pl-5 pr-5 border-r border-white/10">
              <span className="text-2xl font-bold text-red-500" style={{
                color: change24 < 0 ? 'red' : 'green',
              }}>{lastPrice}</span>
            </div>

            <div className="flex h-full pl-1 pr-5">
              <div className="flex flex-col justify-center px-3 border-r lg:px-4 border-white/10">
                <div className="text-sm text-gray-500 lg:text-md">24h Change</div>
                <div className={`text-md font-bold flex items-center ${change24 < -0.004
                  ? 'text-red-500'
                  : change24 > 0.004
                    ? 'text-green-500'
                    : 'text-white'
                  }`}>
                  <span className="flex items-center">
                    {change24 < -0.004 ? (
                      <TrendingDown className="mr-1 trending-icon" size={16} />
                    ) : change24 > 0.004 ? (
                      <TrendingUp className="mr-1 trending-icon" size={16} />
                    ) : null}
                    {toFixedFloat(Math.abs(change24))}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center px-3 border-r lg:px-4 border-white/10">
                <div className="text-sm text-gray-500 lg:text-md">24h High</div>
                <div className="text-sm font-bold text-white lg:text-md">{high24}</div>
              </div>

              <div className="flex flex-col justify-center px-3 border-r lg:px-4 border-white/10">
                <div className="text-sm text-gray-500 lg:text-md">24h Low</div>
                <div className="text-sm font-bold text-white lg:text-md">{low24}</div>
              </div>

              <div className="flex flex-col justify-center px-3 border-r lg:px-4 border-white/10">
                <div className="text-sm text-gray-500 lg:text-md">24h Volume</div>
                <div className="text-sm font-bold text-white lg:text-md">{vol24}</div>
              </div>
            </div>
            <div className="flex items-center h-full gap-2 px-4 ml-auto border-white/10">
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
                        className="flex items-center w-full gap-2 px-3 py-2 transition-colors duration-200 hover:bg-white/5"
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
          <Tabs isFitted
            size='md'
            variant='enclosed'
            className="flex lg:!hidden">
            <TabList>
              <Tab onClick={() => setMobileTabIndex([1, 0, 0])}>Exchange</Tab>
              <Tab onClick={() => setMobileTabIndex([0, 1, 0])}>Chart</Tab>
              {/*<Tab>History</Tab>*/}
              <Tab onClick={() => setMobileTabIndex([0, 0, 1])}>Order book</Tab>
            </TabList>
          </Tabs>
          <div className="w-full">
            <div className="block w-full lg:grid lg:grid-cols-6">
              <div className="block w-full lg:col-span-5 rounded-xl">
                <div className='w-full'>
                  <div className='flex w-full lg:grid lg:grid-cols-4'>
                    <div
                      className={`lg:col-span-3 ${mobileTabIndex[1]
                        ? "w-full h-screen flex flex-col"
                        : "hidden"
                        } lg:block w-full border-t border-gray-800`}
                    >
                      <div className="flex-1 h-full glass">
                        <TradeChart
                          pairSymbol={currentPairSymbol}
                          className="w-full h-full glass"
                          isOpen={isTradeChartOpen}
                          onClose={() => setIsTradeChartOpen(false)}
                        />
                      </div>
                    </div>

                    <div className={`flex w-full ${mobileTabIndex[2] ? "" : "hidden"} lg:flex border-t border-gray-800`}>
                      <div className="w-full h-full rounded-xl">
                        {/* Mobile view */}
                        <div className="block w-full lg:hidden">
                          {mobileTabIndex[2] ? (
                            <div className="w-full h-full overflow-auto">
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
                          ) : <></>
                          }
                        </div>

                        {/* Desktop view */}
                        <div className="hidden lg:block">
                          <div className="h-full overflow-auto">
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden border-t border-gray-800 lg:flex">
                  <div className="w-full col-span-1 lg:col-span-3 bg-white/5 rounded-xl">
                    <div className="flex flex-col h-full">
                      <OrderHistorySection
                        balances={balances}
                        orderHistories={orderHistories}
                        chainServiceInfo={chainServiceInfo}
                        networkGasFee={networkGasFee}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${mobileTabIndex[0] ? "flex" : "hidden"} border-b border-gray-800 rounded-xl lg:flex`}>
                <div className="flex flex-col w-full h-full glass">
                  <Tabs
                    isFitted
                    size='md'
                    onChange={(index) => setCurrentMLIndex(index)}
                    variant='enclosed'
                    className="orderbook-tabs"
                  >
                    <TabList>
                      <Tab>Market</Tab>
                      <Tab>Limit</Tab>
                    </TabList>
                  </Tabs>
                  <div className="flex-1 overflow-auto">
                    <MarketAndLimitPanel
                      balances={balances}
                      feeAssets={feeAssets}
                      chainServiceInfo={chainServiceInfo}
                      quotedPriceInfo={quotedPriceInfo}
                      pairConfig={pairConfig}
                      currentTabIndex={currentMLIndex}
                      currentPairSymbol={currentPairSymbol}
                      symbolAssetIn={symbolAssetIn}
                      symbolAssetOut={symbolAssetOut}
                      defaultBuyPrice={(asks && asks.length > 0) ? asks[0].price : 0}
                      defaultSellPrice={(bids && bids.length > 0) ? bids[0].price : 0}
                      setGlobalNetworkGasFee={setNetworkGasFee}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};