interface TokenIconProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TokenIcon({ src, alt, size = 'md', className = '' }: TokenIconProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
    />
  );
}