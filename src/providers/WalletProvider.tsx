import {WagmiProvider} from 'wagmi';
import {createConfig, http} from '@wagmi/core'
import {coinbaseWallet, injected} from '@wagmi/connectors'
import {mainnet, polygon, arbitrum, base, linea, optimism, bsc, avalanche} from '@wagmi/core/chains';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const config = createConfig({
    chains: [mainnet, polygon, arbitrum, base, linea, optimism],
    connectors: [
        injected({target: 'metaMask'}),
        coinbaseWallet(),
    ],
    transports: {
        [mainnet.id]: http('https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'),
        [polygon.id]: http('https://polygon-rpc.com/'),
        [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
        [base.id]: http('https://base-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'),
        [linea.id]: http('https://linea-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'),
        [optimism.id]: http('https://optimism-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'),
        [bsc.id]: http('https://bsc-dataseed.binance.org/'),
        [avalanche.id]: http('https://avalanche-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8'),
    },
    ssr: true,
})

export const WalletProvider = ({children}: { children: React.ReactNode }) => {
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}