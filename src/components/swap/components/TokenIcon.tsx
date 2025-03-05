import { useState } from "react";
import { v4 as uuid } from "uuid";

import ErrorImg from "../../../../public/images/token/error.svg"
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

  return (
    <img
      src={loadError ? ErrorImg : src}
      alt={alt}
      className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
      onError={() => {
        setLoadError(true)
      }}
    />
  );
}

export function TokenChainIcon({ src, alt, size = 'md', chainId, className = '' }: TokenChainIconProps) {
  const [loadError, setLoadError] = useState(false);
  return (
    <div className="relative">
      <img
        src={loadError ? ErrorImg : src}
        alt={alt}
        className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
        onError={() => {
          setLoadError(true)
        }}
      />
      <div className="border border-white-600 absolute right-[-5px] bottom-[-5px] rounded-full padding-1">
        <img src={getChainIcon(chainId) || ""} className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${chainSizeClasses[size]}`} />
      </div>
    </div>
  );
}

export function TokenChainListIcon({ src, alt, size = 'md', chainIds, className = '' }: TokenChainListIconProps) {
  const [loadError, setLoadError] = useState(false);

  const chainWidth = chainIconSize[size] * chainIds.length;

  return (
    <div className="relative">
      <img
        src={loadError ? ErrorImg : src}
        alt={alt}
        className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
        onError={() => {
          setLoadError(true)
        }}
      />
      <div className={`flex  mt-[-10px] padding-1 absolute ${chainListSizeClasses[size]} w-${chainWidth}`}>
        {
          chainIds.map((chainId, index) =>
            <div key={uuid()} className={`border border-white-600 rounded-full ${index === 0 ? "" : `ml-[-10px]`}`}>
              <img src={getChainIcon(Number(chainId) > 0 ? chainId : 1) || ""} className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${chainSizeClasses[size]}`} />
            </div>
          )
        }
      </div>
    </div>
  );
}