import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { SearchHeaderProps } from '../../../types/cart.type';

// Sort options
export type SortOption = 'marketCap' | 'priceChange24h' | 'price' | 'marketCapRank';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    option: SortOption;
    direction: SortDirection;
}

// Updated category list with exact case matching as shown in screenshot
const categories = [
    'All', 
    'Meme', 
    'DeFi', 
    'AI', 
    'DeFi AI', 
    'Layer 2',
    'GameFi',
    'Metaverse',
    'Infrastructure',
    'Social',
    'Sports',
    'Ethereum', 
    'Base', 
    'Avalanche', 
    'Bsc', 
    'Optimism'
] as const;

// Network logos and colors
const networkLogos: Record<string, { logo: string, color: string }> = {
    'Ethereum': { 
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg', 
        color: '#627EEA'
    },
    'Base': { 
        logo: 'https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png', 
        color: '#0052FF'
    },
    'Avalanche': { 
        logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg', 
        color: '#E84142'
    },
    'Bsc': { 
        logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg', 
        color: '#F3BA2F' 
    },
    'Optimism': { 
        logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg', 
        color: '#FF0420'
    },
    'All': { 
        logo: '/placeholder.svg', 
        color: '#FFFFFF' 
    },
    'Meme': { 
        logo: '/placeholder.svg', 
        color: '#FFFFFF' 
    },
    'DeFi': { 
        logo: '/placeholder.svg', 
        color: '#2775CA' 
    },
    'AI': { 
        logo: '/placeholder.svg', 
        color: '#6B8AFF' 
    },
    'DeFi AI': { 
        logo: '/placeholder.svg', 
        color: '#35CA72' 
    },
    'Layer 2': {
        logo: '/placeholder.svg',
        color: '#7B61FF'
    },
    'GameFi': {
        logo: '/placeholder.svg',
        color: '#FF6B8A'
    },
    'Metaverse': {
        logo: '/placeholder.svg',
        color: '#00C3F9'
    },
    'Infrastructure': {
        logo: '/placeholder.svg',
        color: '#FFA726'
    },
    'Social': {
        logo: '/placeholder.svg',
        color: '#FF4081'
    },
    'Sports': {
        logo: '/placeholder.svg',
        color: '#43A047'
    }
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
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const categoryMenuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (showSortMenu &&
                sortMenuRef.current &&
                event.target instanceof Node &&
                !sortMenuRef.current.contains(event.target)) {
                setShowSortMenu(false);
            }
            if (showCategoryMenu &&
                categoryMenuRef.current &&
                event.target instanceof Node &&
                !categoryMenuRef.current.contains(event.target)) {
                setShowCategoryMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortMenu, showCategoryMenu]);

    // Network categories that should be displayed in the right section
    const networkCategories = ['Ethereum', 'Base', 'Avalanche', 'Bsc', 'Optimism'];
    const tokenCategories = [
        'All', 'Meme', 'DeFi', 'AI', 'DeFi AI', 'Layer 2', 'GameFi', 
        'Metaverse', 'Infrastructure', 'Social', 'Sports'
    ];

    return (
        <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
                {/* Left side categories - now as dropdown */}
                <div className="relative" ref={categoryMenuRef}>
                    <button
                        onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>{selectedCategory || 'All'}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showCategoryMenu && (
                        <div className="absolute top-full left-0 mt-1 backdrop-blur-lg glass rounded-lg overflow-hidden z-50 w-64 max-h-96 overflow-y-auto">
                            <div className="divide-y divide-white/10">
                                {tokenCategories.map((category) => (
                                    <button
                                        key={category}
                                        className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                                            selectedCategory === category ? 'bg-white/10' : ''
                                        }`}
                                        onClick={() => {
                                            onCategoryChange(category);
                                            setShowCategoryMenu(false);
                                        }}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Right side chain logos */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                    {networkCategories.map((network) => (
                        <button
                            key={network}
                            onClick={() => onCategoryChange(network)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                                selectedCategory === network ? "bg-white/10" : "hover:bg-white/5"
                            }`}
                            style={{
                                borderColor: selectedCategory === network ? networkLogos[network].color : 'transparent',
                                borderWidth: selectedCategory === network ? '1px' : '0px'
                            }}
                        >
                            <img 
                                src={networkLogos[network].logo} 
                                alt={network} 
                                className="w-4 h-4"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                            />
                            <span>{network}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="relative mt-4 flex gap-2">
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
                        <span>
                            {sortConfig.direction === 'asc' ? 
                                <span className="text-green-500">↑</span> : 
                                <span className="text-red-500">↓</span>
                            } {sortDisplayNames[sortConfig.option]}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showSortMenu && (
                        <div className="absolute top-full right-0 mt-1 backdrop-blur-lg glass rounded-lg overflow-hidden z-50 w-48">
                            <div className="divide-y divide-white/10">
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                                        sortConfig.option === 'marketCap' ? 
                                            (sortConfig.direction === 'desc' ? 'text-red-500' : 'text-green-500') : 
                                            'text-white'
                                    }`}
                                    onClick={() => handleSortChange('marketCap')}
                                >
                                    {sortConfig.option === 'marketCap' && 
                                        (sortConfig.direction === 'asc' ? 
                                            <span className="text-green-500">↑ </span> : 
                                            <span className="text-red-500">↓ </span>
                                        )
                                    }
                                    Market cap
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                                        sortConfig.option === 'priceChange24h' ? 
                                            (sortConfig.direction === 'desc' ? 'text-red-500' : 'text-green-500') : 
                                            'text-white'
                                    }`}
                                    onClick={() => handleSortChange('priceChange24h')}
                                >
                                    {sortConfig.option === 'priceChange24h' && 
                                        (sortConfig.direction === 'asc' ? 
                                            <span className="text-green-500">↑ </span> : 
                                            <span className="text-red-500">↓ </span>
                                        )
                                    }
                                    Price Change 24
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                                        sortConfig.option === 'price' ? 
                                            (sortConfig.direction === 'desc' ? 'text-red-500' : 'text-green-500') : 
                                            'text-white'
                                    }`}
                                    onClick={() => handleSortChange('price')}
                                >
                                    {sortConfig.option === 'price' && 
                                        (sortConfig.direction === 'asc' ? 
                                            <span className="text-green-500">↑ </span> : 
                                            <span className="text-red-500">↓ </span>
                                        )
                                    }
                                    Price
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                                        sortConfig.option === 'marketCapRank' ? 
                                            (sortConfig.direction === 'desc' ? 'text-red-500' : 'text-green-500') : 
                                            'text-white'
                                    }`}
                                    onClick={() => handleSortChange('marketCapRank')}
                                >
                                    {sortConfig.option === 'marketCapRank' && 
                                        (sortConfig.direction === 'asc' ? 
                                            <span className="text-green-500">↑ </span> : 
                                            <span className="text-red-500">↓ </span>
                                        )
                                    }
                                    Market Cap Rank
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