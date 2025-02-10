import React, { useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchHeaderProps {
    selectedCategory: string;
    searchQuery: string;
    onCategoryChange: (category: string) => void;
    onSearchChange: (query: string) => void;
}

const categories = ['All', 'token', 'meme'];

const SearchHeader: React.FC<SearchHeaderProps> = React.memo(({
    selectedCategory,
    searchQuery,
    onCategoryChange,
    onSearchChange
}) => {
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    }, [onSearchChange]);

    return (
        <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === category ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="relative">
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
    );
});

SearchHeader.displayName = 'SearchHeader';

export default SearchHeader;