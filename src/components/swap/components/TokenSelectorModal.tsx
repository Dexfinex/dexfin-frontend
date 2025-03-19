import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactDOM from 'react-dom';
import { Search, Star, X, ExternalLink, MessageSquareWarning } from 'lucide-react';
import { TokenType } from "../../../types/swap.type.ts";
import { mapPopularTokens, NETWORK, NETWORKS } from "../../../config/networks.ts";
// import {coingeckoService} from "../../../services/coingecko.service.ts";
import { isValidAddress, shrinkAddress } from "../../../utils/common.util.ts";
// import { savedTokens } from "../../../config/tokens.ts";
import { Button, HStack, Image, Text } from "@chakra-ui/react";
import useLocalStorage from "../../../hooks/useLocalStorage.ts";
import { useStore } from '../../../store/useStore.ts';
import { LOCAL_STORAGE_STARRED_TOKENS, LOCAL_STORAGE_ADDED_TOKENS } from "../../../constants";
import { getTokenInfo } from '../../../utils/token.util.ts';
import { mapChainId2ExplorerUrl } from '../../../config/networks.ts';
import { SOLANA_CHAIN_ID } from '../../../constants/solana.constants.ts';
import useTrendingTokensStore from '../../../store/useTrendingTokensStore.ts';
import { TokenChainIcon } from './TokenIcon.tsx';
import { debounce } from 'lodash';
import { dexfinv3Service } from '../../../services/dexfin.service.ts';

/*
const CATEGORIES = [
  { id: 'all', label: 'All Tokens', icon: TrendingUp },
  { id: 'meme', label: 'Meme Coins', icon: Sparkles },
] as const;
*/

interface TokenSelectorModalProps {
    isOpen: boolean;
    selectedToken?: TokenType | null;
    selectedChainId?: number | null;
    onSelect: (token: TokenType) => void;
    onClose: () => void;
}


interface ApproveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    token: TokenType | null;
    chainId: number;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ isOpen, onClose, onContinue, token, chainId }) => {
    const { theme } = useStore();
    const [tokenUrl, setTokenUrl] = useState("");

    const handleContinue = () => {
        onContinue()
        onClose()
    }

    useEffect(() => {
        if (chainId === SOLANA_CHAIN_ID) {
            setTokenUrl(`${mapChainId2ExplorerUrl[chainId]}/token/${token?.address}`)
        } else {
            setTokenUrl(`${mapChainId2ExplorerUrl[chainId]}/address/${token?.address}`)
        }
    }, [token, chainId])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-[340px] md:w-[520px] glass border border-white/10 rounded-xl overflow-hidden p-8">
                <div className='flex justify-center mb-4'>
                    <MessageSquareWarning className='w-8 h-8 text-yellow-500' />
                </div>
                <p className='text-center mb-8'>Confirm Token</p>
                <p className='text-center mb-4 text-yellow-500'>
                    This token is not on the default token lists.
                </p>
                <p className='mb-4 text-white/70 text-sm'>
                    By Clicking below, you understand that you are fully responsible for confirming the token you are trading.
                </p>
                <a className='mb-4 rounded-md flex items-center justify-between p-4 bg-white/5 cursor-pointer'
                    href={tokenUrl} target='_blank'>
                    <div className='flex items-center gap-4'>
                        <img src={token?.logoURI} className='w-8 h-8' />
                        <span>{token?.name}</span>
                    </div>
                    <ExternalLink className='text-white/70 w-5 h-5' />
                </a>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <button className={`${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'} rounded-xl py-1 w-full`} onClick={handleContinue}>
                        I understand, confirm
                    </button>
                    <button className={`${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} rounded-xl py-1 w-full`} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div >
    )
}

export function TokenSelectorModal({
    isOpen,
    // selectedToken,
    selectedChainId,
    onSelect,
    onClose,
}: TokenSelectorModalProps) {
    const { trendingTokens } = useTrendingTokensStore();
    // const [loading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState<NETWORK | null>(null);
    const [starredTokenMap, setStarredTokenMap] = useLocalStorage<Record<string, boolean> | null>(LOCAL_STORAGE_STARRED_TOKENS, {})
    const [addedTokens, setAddedTokens] = useLocalStorage<Array<TokenType> | null>(LOCAL_STORAGE_ADDED_TOKENS, [])
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [selectedCategory] = useState<'all' | 'meme'>('all');
    const [isSearchToken, setIsSearchToken] = useState(false);
    const [loadingToken, setLoadingToken] = useState(false);
    const [newToken, setNewToken] = useState<TokenType | null>(null);
    const [approveModalActive, setApproveModalActive] = useState(false);
    const [tokens, setTokens] = useState<Array<TokenType>>([]);

    const { ref, inView } = useInView({
        threshold: 0.1, // Trigger when 10% of the element is visible
        triggerOnce: false, // Allow multiple triggers
    });

    useEffect(() => {
        if (inView) {
            loadMoreItems();
        }
    }, [inView]);


    const loadMoreItems = async () => {
        const result: TokenType[] = await dexfinv3Service.getTrendingTokens(tokens.length, selectedNetwork?.chainId)
        setTokens([...tokens, ...result])
    }
    // const tokens = useMemo(() => {
    //     if (addedTokens && addedTokens.length > 0) {
    //         if (selectedNetwork?.id) {
    //             const filtered = addedTokens.filter((token: TokenType) => token.chainId == selectedNetwork.chainId)

    //             return [...(filtered.reverse()), ...trendingTokens[selectedNetwork.id]]
    //         } else {
    //             return [...(addedTokens.reverse()), ...trendingTokens['all']]
    //         }
    //     }

    //     return trendingTokens[selectedNetwork?.id ?? 'all']
    // }, [selectedNetwork])

    useEffect(() => {
        if (searchQuery) {
            handleSearchToken()
        } else {
            setTokenValues()
        }
    }, [selectedNetwork])

    const filteredTokens = useMemo(() => {
        const filteredList = tokens.filter((token: TokenType) => {
            // const matchesSearch =
            //     (token?.symbol || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     (token?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     (token?.address || "").toLowerCase().includes(searchQuery.toLowerCase());
            // const matchesNetwork = !selectedNetwork || token.chainId.toString() === selectedNetwork;
            const matchesStarred = !showStarredOnly || starredTokenMap?.[`${token.chainId}:${token.address}`]
            const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
            // return matchesSearch && matchesStarred && matchesCategory;
            return matchesStarred && matchesCategory;
        })
        return filteredList.length > 100 ? filteredList.slice(0, 100) : filteredList
    }, [tokens, showStarredOnly, starredTokenMap, selectedCategory])

    const setTokenValues = () => {
        if (addedTokens && addedTokens.length > 0) {
            if (selectedNetwork?.id) {
                const filtered = addedTokens.filter((token: TokenType) => token.chainId == selectedNetwork.chainId)

                setTokens([...(filtered.reverse()), ...trendingTokens[selectedNetwork.id]])
            } else {
                setTokens([...(addedTokens.reverse()), ...trendingTokens['all']])
            }
        } else {
            setTokens(trendingTokens[selectedNetwork?.id ?? 'all'])
        }
    }

    useEffect(() => {
        if (selectedChainId) {
            setSelectedNetwork(NETWORKS.filter(network => network.chainId === selectedChainId)[0] ?? null)
        }
    }, [selectedChainId, isOpen])

    useEffect(() => {
        const handler = debounce(() => {
            handleSearchToken();
        }, 500);

        handler(); // Call the debounced function
        return () => handler.cancel(); // Cleanup on unmount or text change
    }, [searchQuery]); // Runs when text changes

    const handleSearchToken = async () => {
        if (!searchQuery) {
            setTokenValues()
            return
        }

        setLoadingToken(true)
        let result: TokenType[] = []

        if (selectedNetwork?.chainId) {
            result = await dexfinv3Service.searchTrendingTokens(searchQuery, selectedNetwork?.chainId)
        } else {
            result = await dexfinv3Service.searchTrendingTokens(searchQuery)
        }

        setTokens(result)

        // search new token in chain
        if (result.length === 0 && isValidAddress(searchQuery, selectedNetwork?.chainId || 0)) {
            setNewToken(null)
            setIsSearchToken(true)
            const tokenInfo = await getTokenInfo(searchQuery, selectedNetwork?.chainId || 0)
            if (tokenInfo) {
                setNewToken(tokenInfo as TokenType);
            }
        } else if (isSearchToken) {
            setIsSearchToken(false)
        }

        setLoadingToken(false)
    }

    /*
      useEffect(() => {
        async function fetchTokens() {
          try {
            const tokenList = await coingeckoService.getTokenList() as TokenType[];
            setTokens(tokenList);
          } catch (error) {
            console.error('Failed to fetch tokens:', error);
          } finally {
            setLoading(false);
          }
        }
        fetchTokens();
      }, []);
    */

    const toggleStar = (e: React.MouseEvent, chainId: number, address: string) => {
        e.stopPropagation();
        console.log("setStarredTokenMap")
        setStarredTokenMap(prev => {
            if (!prev) return {}

            const tokenKey = `${chainId}:${address}`
            if (prev[tokenKey]) {
                const { [tokenKey]: _, ...rest } = prev
                return rest
            }

            return {
                ...prev,
                [tokenKey]: true
            }
        })
    };

    const selectSearchedToken = async () => {
        if (newToken) {
            await setAddedTokens(prev => {
                if (prev && prev?.length > 0) {
                    return [...prev, newToken];
                } else {
                    return [newToken];
                }
            })

            onSelect(newToken)
            onClose()
        }
    }

    const popularTokens = useMemo(() => {
        return (mapPopularTokens[selectedNetwork === null ? 1 : (selectedNetwork?.chainId ?? -1)]) ?? []
    }, [selectedNetwork])

    // const handleSearchChange = useCallback(
    //     debounce((value) => {
    //         if (value) {
    //             handleSearchFromApi(value)
    //         }
    //     }, 500),
    //     []);

    return ReactDOM.createPortal(
        <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 z-[10000] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } transition-opacity duration-200`}>
            <div
                className="glass rounded-2xl w-full max-w-xl border border-white/5 mt-[10vh] animate-modal-slide-down">
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Select Token</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowStarredOnly(!showStarredOnly)}
                                className={`p-2 rounded-lg transition-colors group ${showStarredOnly ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-yellow-400'
                                    }`}
                            >
                                <Star className="w-5 h-5" fill={showStarredOnly ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/*
          <div className="flex items-center gap-2 rounded-lg p-1 mb-4">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedCategory === id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
*/}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by token name or paste address"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full glass rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                        />
                    </div>
                </div>

                <div className="p-4 border-b border-white/10">
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setSelectedNetwork(null)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${!selectedNetwork ? 'text-white' : 'border-transparent hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        {NETWORKS.map(network => (
                            <button
                                key={network.id}
                                onClick={() => setSelectedNetwork(network)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors border ${selectedNetwork === network ? 'text-white' : 'border-transparent hover:text-white'
                                    }`}
                            >
                                <img src={network.icon} alt={network.name} className="w-5 h-5 rounded-full" />
                                {/*<span>{network.name}</span>*/}
                            </button>
                        ))}
                    </div>
                </div>

                {
                    popularTokens?.length > 0 && (
                        <>
                            <div className="text-sm text-gray-400 px-4 mt-3">
                                {selectedNetwork === null ? 'Most popular on Ethereum' : 'Most popular'}
                            </div>
                            <div className="p-4">
                                <div className="flex flex-wrap gap-1">
                                    {popularTokens.map(popularToken => (
                                        <Button
                                            key={popularToken.name + popularToken.chainId}
                                            variant="ghost"
                                            onClick={() => {
                                                onSelect(popularToken);
                                                onClose();
                                            }}
                                            _hover={{ bg: 'whiteAlpha.200' }}
                                            style={{
                                                padding: '0px 0.75rem'
                                            }}
                                        >
                                            <HStack>
                                                <Image src={popularToken.logoURI} boxSize='24px' className="rounded-full" />
                                                <Text className="text-sm text-white">{popularToken.symbol}</Text>
                                            </HStack>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {!isSearchToken ? <div className="text-gray-400 text-sm px-4 mt-2">
                                Trending
                            </div> : <div className="text-gray-400 text-sm px-4 mt-2">
                                New Tokens
                            </div>}
                        </>
                    )
                }
                {!isSearchToken ? <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loadingToken ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                    ) : (
                        <div className="p-2">
                            {filteredTokens.map((token: TokenType) => (
                                <div
                                    key={token.address}
                                    onClick={() => {
                                        onSelect(token);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={(e) => toggleStar(e, token.chainId, token.address)}
                                            className={`p-1.5 rounded-lg transition-colors ${starredTokenMap?.[`${token.chainId}:${token.address}`]
                                                ? 'text-yellow-400 bg-yellow-400/10'
                                                : 'text-gray-400 hover:text-yellow-400'
                                                } cursor-pointer`}
                                        >
                                            <Star className="w-4 h-4"
                                                fill={starredTokenMap?.[`${token.chainId}:${token.address}`] ? "currentColor" : "none"} />
                                        </div>
                                        <TokenChainIcon src={token.logoURI} alt={token.name} size={"lg"} chainId={Number(token.chainId)} />
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-medium text-white">{token.symbol}</span>
                                                {token.category === 'meme' && (
                                                    <span
                                                        className="px-1.5 py-0.5 text-[10px] bg-blue-500/10 text-blue-400 rounded-md">
                                                        MEME
                                                    </span>
                                                )}
                                                {/*
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Show token info modal
                            console.log('Show token info:', token);
                          }}
                          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <span className={`text-xs ${
                          (token.priceChange24h ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {(token.priceChange24h ?? 0) >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2)}%
                        </span>
*/}
                                            </div>
                                            <div className="text-sm text-gray-400">{token.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">{shrinkAddress(token.address)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={ref} className="p-1"></div>
                        </div>
                    )}
                </div> : <div>
                    {
                        loadingToken ?
                            <div className="flex items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                            </div>
                            :
                            <div className='p-2'>
                                {newToken ? <div
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                                    onClick={() => setApproveModalActive(true)}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={newToken.logoURI} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-medium text-white">{newToken?.symbol}</span>
                                            </div>
                                            <div className="text-sm text-gray-400">{newToken?.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">{shrinkAddress(newToken?.address)}</div>
                                        </div>
                                    </div>
                                </div> : <div className='text-center p-2 text-gray-400 text-sm'>
                                    No results found for this address. Please check and try again.
                                </div>}
                            </div>
                    }
                </div>}
            </div>

            <ApproveModal
                isOpen={approveModalActive}
                onClose={() => setApproveModalActive(false)}
                onContinue={selectSearchedToken}
                token={newToken}
                chainId={selectedNetwork?.chainId || -1}
            />
        </div>,
        document.body
    );
}