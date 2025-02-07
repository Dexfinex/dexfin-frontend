import React, { useState } from 'react';
import { Copy } from 'lucide-react';

interface IClipboard {
    address: string;
}

export const Clipboard: React.FC<IClipboard> = ({ address }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); // Hide tooltip after 2 seconds
    }

    return (
        <button className='relative text-sm text-white/40 flex items-center gap-1' onClick={handleCopy}>
            {address}
            <Copy className='w-4 h-4' />
            {copied && <span className='absolute text-white/90 right-[10px] top-[-28px] bg-black p-1 rounded-md'>Copied</span>}
        </button>
    )
}