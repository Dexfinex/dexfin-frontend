import { getChainIcon } from "../../../utils/getChainIcon";

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

export function TokenIcon({ src, alt, size = 'md', className = '' }: TokenIconProps) {

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
    />
  );
}

export function TokenChainIcon({ src, alt, size = 'md', chainId, className = '' }: TokenChainIconProps) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
      />
      <div className="border border-white-600 absolute right-[-5px] bottom-[-5px] rounded-full padding-1">
        <img src={getChainIcon(chainId)} className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${chainSizeClasses[size]}`} />
      </div>
    </div>
  );
}