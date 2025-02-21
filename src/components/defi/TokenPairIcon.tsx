import { useState } from "react";

interface TokenIconProps {
    icons: string[];
    alts: string[];
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
};

export function TokenPairIcon({ icons, alts, size = 'md', className = '' }: TokenIconProps) {
    const [loadError, setLoadError] = useState(false);

    return (
        <div className="flex relative">
            {
                icons.map((icon, index) => (
                    <img
                        key={index}
                        src={loadError ? "/images/error.svg" : icon}
                        alt={alts[index]}
                        className={`ml-[-10%] rounded-full ring-2 ring-white/10 group-hover:ring-blue-500/20 transition-all duration-300 ${sizeClasses[size]} ${className}`}
                        onError={() => {
                            setLoadError(true)
                        }}
                    />))
            }
        </div>
    );
}