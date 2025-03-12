
import React, { useCallback, useState, useRef, useEffect, useContext } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { SearchHeaderProps } from '../../../types/cart.type';
import { Web3AuthContext } from '../../../providers/Web3AuthContext';
import { Button } from '@chakra-ui/react';

// Sort options
export type SortOption = 'marketCap' | 'priceChange24h' | 'price' | 'marketCapRank';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    option: SortOption;
    direction: SortDirection;
}

const categories = ['All', 'meme', 'ethereum', 'base', 'avalanche', 'bsc', 'optimism'] as const;

// Chain ID mapping for network switching
const networkToChainId: Record<string, number> = {
    'ethereum': 1,
    'base': 8453,
    'avalanche': 43114,
    'bsc': 56,
    'optimism': 10
};

// Sort option display names
const sortDisplayNames: Record<SortOption, string> = {
    'marketCap': 'Market cap',
    'priceChange24h': 'Price Change 24',
    'price': 'Price',
    'marketCapRank': 'Market Cap Rank'
};

interface SearchHeaderWithSortProps extends SearchHeaderProps {
    sortConfig: SortConfig;
    onSortChange: (sort: SortConfig) => void;
}

const SearchHeader: React.FC<SearchHeaderWithSortProps> = React.memo(({
    selectedCategory,
    searchQuery,
    onCategoryChange,
    onSearchChange,
    sortConfig,
    onSortChange
}) => {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [switchingNetwork, setSwitchingNetwork] = useState(false);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    
    // Get chainId and switchChain from Web3AuthContext
    const { chainId, switchChain, isChainSwitching } = useContext(Web3AuthContext);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    }, [onSearchChange]);

    const handleSortChange = useCallback((option: SortOption) => {
        if (option === sortConfig.option) {
            onSortChange({
                option,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
            });
        } else {
            onSortChange({
                option,
                direction: 'desc'
            });
        }
        setShowSortMenu(false);
    }, [sortConfig, onSortChange]);

    // Handle category selection with network switching
    const handleCategoryChange = useCallback(async (category: string) => {
        onCategoryChange(category);
        
        // Check if category is a network that requires switching
        if (category !== 'All' && category !== 'meme' && networkToChainId[category]) {
            const targetChainId = networkToChainId[category];
            
            // Only switch if the current chain is different
            if (chainId !== targetChainId) {
                try {
                    setSwitchingNetwork(true);
                    console.log(`Switching network to ${category} (Chain ID: ${targetChainId})`);
                    await switchChain(targetChainId);
                    console.log(`Successfully switched to ${category}`);
                } catch (error) {
                    console.error(`Failed to switch to ${category}:`, error);
                } finally {
                    setSwitchingNetwork(false);
                }
            }
        }
    }, [chainId, onCategoryChange, switchChain]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (showSortMenu &&
                sortMenuRef.current &&
                event.target instanceof Node &&
                !sortMenuRef.current.contains(event.target)) {
                setShowSortMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortMenu]);

    // Get current network from chainId
    const getCurrentNetwork = () => {
        const entries = Object.entries(networkToChainId);
        const currentNetwork = entries.find(([_, id]) => id === chainId);
        return currentNetwork ? currentNetwork[0] : null;
    };

    const currentNetwork = getCurrentNetwork();

    return (
        <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 overflow-x-auto -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10">
                    {categories.map((category) => {
                        const isNetworkCategory = category !== 'All' && category !== 'meme';
                        const isCurrentNetwork = isNetworkCategory && category === currentNetwork;
                        const isSelectedCategory = selectedCategory === category;
                        
                        return (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                disabled={isChainSwitching || switchingNetwork}
                                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                                    isSelectedCategory 
                                        ? "bg-blue-500 text-white" 
                                        : isCurrentNetwork
                                            ? "bg-blue-500/30 hover:bg-blue-500/50"
                                            : "hover:bg-white/10"
                                }`}
                            >
                                {category}
                                {isChainSwitching && isNetworkCategory && selectedCategory === category && (
                                    <span className="ml-2 inline-block animate-spin">↻</span>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {currentNetwork && (
                    <div className="text-sm text-white/60 hidden md:block">
                        Current Network: <span className="text-blue-400">{currentNetwork}</span>
                    </div>
                )}
            </div>
            
            <div className="relative mt-2 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search coins..."
                        className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
                    />
                </div>

                {/* Sort dropdown positioned right */}
                <div className="relative" ref={sortMenuRef}>
                    <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>{sortConfig.direction === 'asc' ? '↑ ' : '↓ '}{sortDisplayNames[sortConfig.option]}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showSortMenu && (
                        <div className="absolute top-full right-0 mt-1 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden z-50 w-48">
                            <div className="divide-y divide-white/10">
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'marketCap' ? 'text-blue-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('marketCap')}
                                >
                                    {sortConfig.option === 'marketCap' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Market cap
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'priceChange24h' ? 'text-blue-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('priceChange24h')}
                                >
                                    {sortConfig.option === 'priceChange24h' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Price Change 24
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'price' ? 'text-blue-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('price')}
                                >
                                    {sortConfig.option === 'price' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Price
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'marketCapRank' ? 'text-blue-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('marketCapRank')}
                                >
                                    {sortConfig.option === 'marketCapRank' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Market Cap Rank
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

SearchHeader.displayName = 'SearchHeader';

export default SearchHeader;