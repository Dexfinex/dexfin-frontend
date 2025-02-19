export const PRIMARY_ADDRESS_BY_PROTOCOL: Record<string, Record<number, string>> = {
    "uniswap-v2": {
        1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Ethereum Mainnet (ETH)
        56: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // Binance Smart Chain (BNB)
        137: '0xedf6066a2b290C185783862C7F4776A2C8077AD1', // Polygon Mainnet (MATIC)
        43114: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // Avalanche C-Chain (AVAX)
        10: '0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2', // Optimism (ETH)
        42161: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // Arbitrum (ETH)
        8453: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // Base Mainnet (ETH placeholder)
        900: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // Base Mainnet (ETH placeholder)
    }
}