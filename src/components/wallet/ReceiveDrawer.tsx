import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ArrowLeft, Search, ChevronDown, Copy, CheckCircle, ArrowDown, X } from 'lucide-react';
import { Skeleton, useMediaQuery } from '@chakra-ui/react';
import * as QRCode from 'qrcode';

import { Web3AuthContext } from '../../providers/Web3AuthContext';
import { TokenIcon } from '../swap/components/TokenIcon';
import { getChainIcon } from '../../utils/getChainIcon';
import { SOLANA_CHAIN_ID } from '../../constants/solana.constants';
import { useStore } from '../../store/useStore';
import { PageType } from '../WalletDrawer';

interface ReceiveDrawerProps {
  // isOpen: boolean;
  // onClose: () => void;
  assets: {
    name: string;
    symbol: string;
    logo: string;
    chain: number;
  }[];
  setPage: (type: PageType) => void;
  page: PageType;
}

export const ReceiveDrawer: React.FC<ReceiveDrawerProps> = ({ setPage, page }) => {
  const chainList = [
    {
      name: "Ethereum",
      chain: 1,
    },
    {
      name: "Solana",
      chain: SOLANA_CHAIN_ID,
    },
    {
      name: "BNB Chain",
      chain: 56,
    },
    {
      name: "Polygon",
      chain: 137,
    },
    {
      name: "Avalanche",
      chain: 43114,
    },
    {
      name: "Optimism",
      chain: 10,
    },
    {
      name: "Arbitrum",
      chain: 42161,
    },
    {
      name: "Base",
      chain: 8453,
    },
  ];
  const { theme } = useStore();
  const [selectedAsset, setSelectedAsset] = useState(chainList[0] || {});
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatingQr, setGeneratingQr] = useState(false);

  const { solanaWalletInfo, address: evmAddress } = useContext(Web3AuthContext);
  const solanaAddress = solanaWalletInfo?.publicKey;


  const walletAddress = useMemo(() => {
    switch (Number(selectedAsset?.chain)) {
      case SOLANA_CHAIN_ID: // solana
        return solanaAddress;
      default:
        return evmAddress;
    }
  }, [selectedAsset, evmAddress, solanaWalletInfo])

  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const walletContainerWidth = useMemo(() => {
    if (isLargerThan1200) return 'w-[50%] rounded-xl';
    if (isLargerThan800) return 'w-[80%] rounded-xl';

    return 'w-full h-full rounded-none';

  }, [isLargerThan1200, isLargerThan800])

  useEffect(() => {
    if (page === "receive" && walletAddress) {
      setGeneratingQr(true);
      QRCode.toDataURL(walletAddress, {
        width: 200,
        margin: 1,
        // color: {
        //   dark: '#ffffff',
        //   light: '#00000000'
        // }
      })
        .then(url => setQrCode(url))
        .catch(err => console.error('Error generating QR code:', err))
        .finally(() => setGeneratingQr(false));
    }
  }, [page, walletAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const filteredChain = chainList.filter(chain =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // if (!isOpen) return null;

  return (
    <div className="mt-4 sm:mt-5 mx-4">

      <button className={`rounded-full ${theme === "dark" ? "text-white/70 hover:bg-white/10" : "text-black/70 hover:bg-black/10"}  p-2`} onClick={() => setPage("main")}>
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="space-y-6 mt-4">
        {/* Asset Selector */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Asset</label>
          <div className="relative">
            <button
              onClick={() => setShowAssetSelector(!showAssetSelector)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <TokenIcon src={getChainIcon(selectedAsset.chain) || ""} alt={selectedAsset.name} size={"lg"} />
              <div className="flex-1 text-left">
                <div className="font-medium">{selectedAsset.name}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>

            {showAssetSelector && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAssetSelector(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-lg z-20">
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search network..."
                      className="bg-transparent outline-none flex-1 text-sm"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {filteredChain.map((chain) => (
                      <button
                        key={chain.name}
                        disabled={chain.chain === SOLANA_CHAIN_ID && !solanaAddress}
                        onClick={() => {
                          setSelectedAsset(chain);
                          setShowAssetSelector(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors ${chain.chain === SOLANA_CHAIN_ID && !solanaAddress ? "opacity-50" : ""}`}
                      >
                        <TokenIcon src={getChainIcon(chain.chain) || ""} alt={chain.name} size={"lg"} />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{chain.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="w-52 h-52 bg-white/5 rounded-xl p-4 mb-4">
            {walletAddress || generatingQr ? (
              <div className='relative flex w-full align-center'>
                {
                  getChainIcon(Number(selectedAsset.chain)) &&
                  <img src={getChainIcon(Number(selectedAsset.chain)) || ""} className={`absolute left-20 top-20 rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 w-8 h-8`} />
                }
                <img
                  src={qrCode}
                  alt="Wallet QR Code"
                  className="w-full h-full"
                />
              </div>
            ) : <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'100%'}></Skeleton>}
          </div>
          <div className="text-sm text-white/60 mb-2">
            {`${selectedAsset.name} address`}
          </div>
        </div>

        {/* Address */}
        <div className='flex justify-center'>
          {
            walletAddress ?
              <div className="flex items-center cursor-pointer hover:text-white/80" onClick={handleCopy}>
                <div className="font-bold text-sm mr-2">
                  {walletAddress}
                </div>
                <button className="rounded-lg transition-colors">
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              : <Skeleton startColor="#444" endColor="#1d2837" w={'100%'} h={'3rem'}></Skeleton>
          }
        </div>

        {/* Network Info */}
        <div className="text-center text-sm text-white/60">
          {
            selectedAsset.name && `This address supports receiving tokens on the ${selectedAsset.name} network.`
          }
          <br />
          Sending assets from other networks may result in permanent loss.
        </div>
      </div>
    </div>
  );
};