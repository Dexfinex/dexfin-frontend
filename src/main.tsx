import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StytchProvider } from '@stytch/react';
import { StytchUIClient } from "@stytch/vanilla-js";
import App from './App.tsx';
import './index.css';
import Web3AuthProvider from './providers/Web3AuthContext';
import { WalletProvider } from "./providers/WalletProvider";
import { WebSocketProvider } from './providers/WebSocketProvider.tsx';

const stytch = new StytchUIClient(
    import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || ''
);


// Preload the high-res background image
const img = new Image();
img.src = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80';
img.onload = () => {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${img.src}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.classList.add('bg-loaded');
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StytchProvider stytch={stytch}>
            <WalletProvider>
                <Web3AuthProvider>
                    <ChakraProvider>
                        <WebSocketProvider>
                            <App />
                        </WebSocketProvider>
                    </ChakraProvider>
                </Web3AuthProvider>
            </WalletProvider>
        </StytchProvider>
    </StrictMode>
);