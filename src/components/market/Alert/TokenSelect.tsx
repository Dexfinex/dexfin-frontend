import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, ChevronDown } from "lucide-react";
import { coingeckoService } from "../../../services/coingecko.service";

import { Token } from "../../../types/markets-alert.type";
import { SearchableTokenSelectProps } from "../../../types/markets-alert.type";

export const SearchableTokenSelect: React.FC<SearchableTokenSelectProps> = ({
  value,
  onChange,
  placeholder = "Select token",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTokensLoaded, setInitialTokensLoaded] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadInitialTokens = async () => {
      if (initialTokensLoaded) return;

      try {
        setIsLoading(true);
        setError(null);

        const tokenIds = await coingeckoService.getTokenIds();
        console.log(tokenIds.length, tokenIds);
        setAllTokens(tokenIds);
        setInitialTokensLoaded(true);

        if (isOpen) {
          setFilteredTokens(tokenIds.slice(0, 20));
        }
      } catch (err) {
        console.error("Failed to load initial tokens:", err);
        setError("Failed to load tokens");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTokens();
  }, [initialTokensLoaded, isOpen]);

  useEffect(() => {
    if (!value) {
      setSelectedToken(null);
      return;
    }

    if (selectedToken?.id === value) {
      return;
    }

    // First check if the token is in our already loaded tokens
    const token = allTokens.find((t) => t.id === value);
    if (token) {
      setSelectedToken(token);
      return;
    }

    const fetchTokenDetails = async () => {
      try {
        setIsLoading(true);
        const searchResults = await coingeckoService.searchCoins(value);
        console.log(searchResults);
        const foundToken = searchResults.find((t) => t.id === value);

        if (foundToken) {
          setSelectedToken(foundToken);
        }
      } catch (err) {
        console.error("Error fetching token details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (value && allTokens.length > 0) {
      fetchTokenDetails();
    }
  }, [value, allTokens, selectedToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenDropdown = useCallback(() => {
    setIsOpen(true);

    if (filteredTokens.length === 0 && allTokens.length > 0) {
      setFilteredTokens(allTokens.slice(0, 20));
    }
  }, [filteredTokens.length, allTokens]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setFilteredTokens(allTokens.slice(0, 20));
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim().length < 2) return;

      setIsLoading(true);

      const results = allTokens
        .filter(
          (token) =>
            token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.symbol.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 50);

      if (results.length > 0) {
        setFilteredTokens(results);
        setIsLoading(false);
        return;
      }

      const searchAPI = async () => {
        try {
          const apiResults = await coingeckoService.searchCoins(query);
          console.log(apiResults);
          setFilteredTokens(apiResults.slice(0, 50));
        } catch (err) {
          console.error("Failed to search tokens:", err);
          setError("Failed to search tokens");
        } finally {
          setIsLoading(false);
        }
      };

      searchAPI();
    }, 300);
  };

  const handleTokenSelect = useCallback(
    (token: Token) => {
      setSelectedToken(token);
      onChange(token.id);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onChange]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedToken(null);
    onChange("");
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (allTokens.length) {
      setFilteredTokens(allTokens.slice(0, 20));
    }
  }, [onChange, allTokens]);

  const handleClearSearch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchQuery("");

      // Reset to default tokens
      if (allTokens.length) {
        setFilteredTokens(allTokens.slice(0, 20));
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [allTokens]
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus-within:border-white/20 cursor-pointer"
        onClick={handleOpenDropdown}
      >
        <Search className="w-4 h-4 text-white/40 mr-2" />

        {selectedToken ? (
          <div className="flex-1 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
              <img
                src={selectedToken.logo}
                alt={selectedToken.symbol}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/20";
                }}
              />
            </div>
            <span className="font-medium">{selectedToken.name}</span>
            <span className="text-white/60 text-sm">
              ({selectedToken.symbol})
            </span>
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
          {error && <div className="p-3 text-sm text-red-400">{error}</div>}

          {isLoading && (
            <div className="flex flex-col justify-center items-center p-6 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <p className="text-sm text-white/60">Loading tokens...</p>
            </div>
          )}

          {!isLoading && filteredTokens.length === 0 && (
            <div className="p-4 text-sm text-white/60 text-center">
              {searchQuery.length > 0
                ? "No tokens found for your search"
                : "Type to search for tokens"}
            </div>
          )}

          {filteredTokens.length > 0 && (
            <ul className="py-1">
              {filteredTokens.map((token) => (
                <li
                  key={token.id}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-white/5">
                    {token.logo && (
                      <img
                        src={token.logo}
                        alt={token.symbol}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/24";
                        }}
                      />
                    )}
                    {token.thumb && (
                      <img
                        src={token.thumb}
                        alt={token.symbol}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/24";
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-white/60">
                      {token.symbol.toUpperCase()}
                    </div>
                  </div>
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
