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
    },
    "lido": {
        1: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // Ethereum Mainnet (ETH)
    },
    "aave-v3": {
        1: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Ethereum Mainnet (ETH)
        8453: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', // Base Mainnet (ETH)
    },
    "pendle": {
        1: '0xcDd26Eb5EB2Ce0f203a84553853667aE69Ca29Ce', // Ethereum Mainnet (ETH)
    }
}