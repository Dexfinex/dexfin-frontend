import React, { useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import { SearchHeaderProps } from '../../../types/cart.type';

const categories = ['All', 'token', 'meme', 'ethereum', 'base', 'avalanche', 'bsc', 'celo', 'optimism'] as const;

const SearchHeader: React.FC<SearchHeaderProps> = React.memo(({
    selectedCategory,
    searchQuery,
    onCategoryChange,
    onSearchChange
}) => {
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    }, [onSearchChange]);

    const categoryButtons = useMemo(() =>
        categories.map((category) => (
            <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === category ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
            >
                {category}
            </button>
        )), [selectedCategory, onCategoryChange]);

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
            <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search coins..."
                    className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
                />
            </div>
        </div>
    )
});

SearchHeader.displayName = 'SearchHeader';

export default SearchHeader;
