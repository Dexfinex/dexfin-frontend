import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { shrinkAddress } from '../../utils/common.util';

interface IClipboard {
    address: string;
    ensName: string;
}

export const Clipboard: React.FC<IClipboard> = ({ address, ensName }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); // Hide tooltip after 2 seconds
    }

    return (
        <button className='relative text-sm text-white/40 flex items-center gap-1' onClick={handleCopy}>
            {ensName ? <span>{ensName} | {shrinkAddress(address)}</span> : <span>{shrinkAddress(address)}</span>}
            <Copy className='w-4 h-4' />
            {copied && <span className='absolute text-white/90 right-[10px] top-[-28px] bg-black p-1 rounded-md'>Copied</span>}
        </button>
    )
}