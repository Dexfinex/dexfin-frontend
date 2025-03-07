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

const categories = ['All', 'meme', 'ethereum', 'base', 'avalanche', 'bsc', 'optimism'] as const;

// Sort option display names
const sortDisplayNames: Record<SortOption, string> = {
    'marketCap': 'Market cap',
    'priceChange24h': 'priceChange24h',
    'price': 'price',
    'marketCapRank': 'marketCapRank'
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
    const sortMenuRef = useRef<HTMLDivElement>(null);

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
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortMenu]);

    return (
        <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${selectedCategory === category ? "bg-white/10" : "hover:bg-white/5"
                            }`}
                    >
                        {category}
                    </button>
                ))}
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
                        <div className="absolute top-full right-0 mt-1  backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden z-50 w-48">
                            <div className="divide-y divide-white/10">
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'marketCap' ? 'text-red-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('marketCap')}
                                >
                                    {sortConfig.option === 'marketCap' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Market cap
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'priceChange24h' ? 'text-red-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('priceChange24h')}
                                >
                                    {sortConfig.option === 'priceChange24h' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Price Change 24
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'price' ? 'text-red-500' : 'text-white'
                                        }`}
                                    onClick={() => handleSortChange('price')}
                                >
                                    {sortConfig.option === 'price' && (sortConfig.direction === 'asc' ? '↑ ' : '↓ ')}Price
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${sortConfig.option === 'marketCapRank' ? 'text-red-500' : 'text-white'
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