import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ChevronDown } from 'lucide-react';
import { coingeckoService } from '../../../services/coingecko.service';

interface Token {
    id: string;
    symbol: string;
    name: string;
    platforms?: Record<string, string>;
    thumb?: string;
    logoURI?: string;
}

interface SearchableTokenSelectProps {
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchableTokenSelect: React.FC<SearchableTokenSelectProps> = ({
    value,
    onChange,
    placeholder = 'Select token',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allTokens, setAllTokens] = useState<Token[]>([]);
    const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load tokens on initial render
    useEffect(() => {
        const loadTokens = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const tokenIds = await coingeckoService.getTokenIds();
                setAllTokens(tokenIds);

                if (isOpen) {
                    setFilteredTokens(tokenIds.slice(0, 50));
                }
            } catch (err) {
                console.error('Failed to load tokens:', err);
                setError('Failed to load tokens');
            } finally {
                setIsLoading(false);
            }
        };

        loadTokens();
    }, []);

    const handleOpenDropdown = () => {
        setIsOpen(true);
        if (!filteredTokens.length && allTokens.length) {
            setFilteredTokens(allTokens.slice(0, 50));
        }
    };

    // Handle input changes and update search results
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // If query is cleared, reset filtered tokens to default list
        if (!query.trim()) {
            setFilteredTokens(allTokens.slice(0, 50));
        }
    };

    // Filter tokens based on search query
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const query = searchQuery.toLowerCase().trim();

        // If query is empty, show default list
        if (!query) {
            setFilteredTokens(allTokens.slice(0, 50));
            return;
        }

        // Only search if query is at least 2 characters
        if (query.length < 2) {
            return;
        }

        const results = allTokens.filter(token =>
            token.name.toLowerCase() === query.toLocaleLowerCase() ||
            token.symbol.toLowerCase() === query.toLocaleLowerCase()
        ).slice(0, 50);

        setFilteredTokens(results);
    }, [searchQuery, isOpen, allTokens]);

    useEffect(() => {
        if (!value) {
            setSelectedToken(null);
            return;
        }

        const token = allTokens.find(t => t.id === value);
        if (token) {
            setSelectedToken(token);
        } else if (value && allTokens.length > 0) {
            const fetchTokenDetails = async () => {
                try {
                    const searchResults = await coingeckoService.searchCoins(value);
                    const foundToken = searchResults.find(t => t.id === value);

                    if (foundToken) {
                        setSelectedToken(foundToken);
                    }
                } catch (err) {
                    console.error('Error fetching token details:', err);
                }
            };

            fetchTokenDetails();
        }
    }, [value, allTokens]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTokenSelect = (token: Token) => {
        setSelectedToken(token);
        onChange(token.id);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClearSelection = () => {
        setSelectedToken(null);
        onChange('');
        setSearchQuery('');
        if (inputRef.current) {
            inputRef.current.focus();
        }

        // Reset filtered tokens when clearing selection
        if (allTokens.length) {
            setFilteredTokens(allTokens.slice(0, 50));
        }
    };

    // Clear the search box but keep dropdown open
    const handleClearSearch = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSearchQuery('');

        // Reset filtered tokens to default list
        if (allTokens.length) {
            setFilteredTokens(allTokens.slice(0, 50));
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus-within:border-white/20 cursor-pointer"
                onClick={handleOpenDropdown}
            >
                <Search className="w-4 h-4 text-white/40 mr-2" />

                {selectedToken ? (
                    <div className="flex-1 flex items-center gap-2">
                        <span className="font-medium">{selectedToken.name}</span>
                        <span className="text-white/60 text-sm">({selectedToken.symbol})</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClearSelection();
                            }}
                            className="ml-auto p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={() => setIsOpen(true)}
                            className="flex-1 bg-transparent outline-none"
                        />
                        {searchQuery ? (
                            <button
                                onClick={handleClearSearch}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <X className="w-4 h-4 text-white/40" />
                            </button>
                        ) : (
                            <ChevronDown className="w-4 h-4 text-white/40" />
                        )}
                    </>
                )}

                {isLoading && !selectedToken && (
                    <Loader2 className="w-4 h-4 text-white/40 animate-spin ml-2" />
                )}
            </div>

            {isOpen && !selectedToken && (
                <div className="absolute z-50 mt-2 w-full bg-gray-900/90 backdrop-blur glass border border-white/10 rounded-lg shadow-xl max-h-[300px] overflow-y-auto">
                    {error && (
                        <div className="p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col justify-center items-center p-6 space-y-2">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                            <p className="text-sm text-white/60">Loading tokens...</p>
                        </div>
                    )}

                    {!isLoading && filteredTokens.length === 0 && (
                        <div className="p-4 text-sm text-white/60 text-center">
                            {searchQuery.length > 0
                                ? 'No tokens found for your search'
                                : 'Type to search for tokens'}
                        </div>
                    )}

                    {filteredTokens.length > 0 && (
                        <ul className="py-1">
                            {filteredTokens.map((token) => (
                                <li
                                    key={token.id}
                                    onClick={() => handleTokenSelect(token)}
                                    className="flex flex-col px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors"
                                >
                                    <div className="font-medium">{token.name}</div>
                                    <div className="text-xs text-white/60">{token.symbol}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableTokenSelect;