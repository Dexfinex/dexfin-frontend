import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Skeleton } from "@chakra-ui/react";

import ErrorImg from "/images/token/error.svg"
import { getChainIcon } from "../../../utils/getChainIcon";

interface TokenChainListIconProps {
  src: string;
  alt: string;
  chainIds: number[],
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface TokenChainIconProps {
  src: string;
  alt: string;
  chainId: number,
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface TokenIconProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const chainSizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const chainListSizeClasses = {
  sm: 'left-3',
  md: 'left-4',
  lg: 'left-5',
};

const chainIconSize = {
  sm: 2,
  md: 3,
  lg: 4,
};

export function TokenIcon({ src, alt, size = 'md', className = '' }: TokenIconProps) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <img
        src={loadError ? ErrorImg : src}
        alt={alt}
        className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className} ${loading ? "hidden" : "block"}`}
        onError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        onLoad={() => {
          setLoading(false)
        }}
      />
      {loading && <Skeleton className={`${sizeClasses[size]} ml-[3px]`} />}
    </div>
  );
}

export function TokenChainIcon({ src, alt, size = 'md', chainId, className = '' }: TokenChainIconProps) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chainLoadError, setChainLoadError] = useState(false);
  const [chainLoading, setChainLoading] = useState(true);
  return (
    <div className="relative">
      <img
        src={loadError ? ErrorImg : src}
        alt={alt}
        className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className} ${loading ? "hidden" : "block"}`}
        onError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        onLoad={() => {
          setLoading(false);
        }}
      />
      {loading && <Skeleton className={sizeClasses[size]} />}
      <div className="border border-white-600 absolute right-[-5px] bottom-[-5px] rounded-full padding-1">
        <img
          src={chainLoadError ? ErrorImg : (getChainIcon(chainId) || ErrorImg)}
          className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${chainSizeClasses[size]} ${chainLoading ? "hidden" : "block"}`}
          onError={() => {
            setChainLoading(false);
            setChainLoadError(true);
          }}
          onLoad={() => {
            setChainLoading(false);
          }}
        />
      </div>
    </div>
  );
}

export function TokenChainListIcon({ src, alt, size = 'md', chainIds, className = '' }: TokenChainListIconProps) {
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chainLoadError, setChainLoadError] = useState<Record<number, boolean>>({});
  const [chainLoading, setChainLoading] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const chainWidth = chainIconSize[size] * chainIds.length;

  return (
    <div className="relative">
      <img
        src={loadError ? ErrorImg : src}
        alt={alt}
        className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className} ${loading ? "hidden" : "block"}`}
        onError={() => {
          setLoading(false);
          setLoadError(true);
        }}
        onLoad={() => {
          setLoading(false);
        }}
      />
      {loading && <Skeleton className={sizeClasses[size]} />}
      <div className={`flex  mt-[-10px] padding-1 absolute ${chainListSizeClasses[size]} w-${chainWidth}`}>
        {
          chainIds.map((chainId, index) =>
            <div key={uuid()} className={`border border-white-600 rounded-full ${index === 0 ? "" : `ml-[-10px]`}`}>
              <img
                src={chainLoadError[index] ? ErrorImg : (getChainIcon(Number(chainId) > 0 ? chainId : 1) || ErrorImg)}
                className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${chainSizeClasses[size]} ${chainLoading[index] ? "hidden" : "block"}`}
                onError={() => {
                  setChainLoading((prev) => {
                    let _prev: Record<number, boolean> = { ...prev };
                    _prev[index] = false;
                    return _prev;
                  });
                  setChainLoadError((prev) => {
                    let _prev: Record<number, boolean> = { ...prev };
                    _prev[index] = true;
                    return _prev;
                  });;
                }}
                onLoad={() => {
                  setChainLoading((prev) => {
                    let _prev: Record<number, boolean> = { ...prev };
                    _prev[index] = false;
                    return _prev;
                  });
                }}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}