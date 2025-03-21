import { arbitrum, avalanche, base, bsc, linea, mainnet, optimism, polygon } from "@wagmi/core/chains";
import { baseSepolia, sepolia } from "viem/chains";
import { ethers } from "ethers";

export * from "./zerodev.constants.ts"

export const LOCAL_STORAGE_WALLET_INFO = 'LIT-WALLET-INFO'
export const LOCAL_STORAGE_STARRED_TOKENS = 'LOCAL_STORAGE_STARRED_TOKENS'
export const LOCAL_STORAGE_AUTH_REDIRECT_TYPE = 'REDIRECT-TYPE'
export const LOCAL_STORAGE_ADDED_TOKENS = 'LOCAL_STORAGE_ADDED_TOKENS'
export const LOCAL_STORAGE_BRIDGE_RECENT_WALLETS = 'LOCAL_STORAGE_BRIDGE_RECENT_WALLETS'
export const LOCAL_STORAGE_PUSH_KEY = 'PgpPK'
export const LOCAL_STORAGE_LAST_CHAT_USER = 'LOCAL_STORAGE_LAST_CHAT_USER'
export const LOCAL_STORAGE_RECENT_ADDRESSES = 'recentSendAddresses'

export const mapRpcUrls: Record<number, string> = {
    [mainnet.id]: 'https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [sepolia.id]: 'https://sepolia.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [baseSepolia.id]: 'https://base-sepolia.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [polygon.id]: 'https://polygon-rpc.com/',
    [arbitrum.id]: 'https://arb1.arbitrum.io/rpc',
    [base.id]: 'https://base-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [linea.id]: 'https://linea-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [optimism.id]: 'https://optimism-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
    [bsc.id]: 'https://bsc-dataseed.binance.org/',
    [avalanche.id]: 'https://avalanche-mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8',
}

// const BASE_HOST_DOMAIN = 'http://localhost:3000'
const BASE_HOST_DOMAIN = 'https://dexfinv3-backend-production.up.railway.app'

export const COINGECKO_BASE_URL = `${BASE_HOST_DOMAIN}/coingecko`
// export const COINGECKO_BASE_URL = `http://localhost:3000/coingecko`

export const SWAPKIT_BASE_URL = `${BASE_HOST_DOMAIN}/crosschain`

export const DEBRIDGE_BASE_URL = `${BASE_HOST_DOMAIN}/debridge`

export const BIRDEYE_BASE_URL = `${BASE_HOST_DOMAIN}/birdeye`

export const DEFILLAMA_BASE_URL = `${BASE_HOST_DOMAIN}/defillama`;

export const FEARGREED_BASE_URL = `${BASE_HOST_DOMAIN}/fear-greed`;

export const GECKOTERMINAL_BASE_URL = `${BASE_HOST_DOMAIN}/gecko-terminal`;

export const BRIAN_BASE_URL = `${BASE_HOST_DOMAIN}/brian`;

export const CRYPTONEWS_BASE_URL = `${BASE_HOST_DOMAIN}/crypto-news`;

export const OPENAI_BASE_URL = `${BASE_HOST_DOMAIN}/openai`;
// export const OPENAI_BASE_URL = `http://localhost:3000/openai`;

// export const ALERT_BASE_URL = `http://localhost:3000/alerts`;
export const ALERT_BASE_URL = `${BASE_HOST_DOMAIN}/alerts`;

export const ENSO_BASE_URL = `${BASE_HOST_DOMAIN}/enso`;

export const CALENDAR_BASE_URL = `${BASE_HOST_DOMAIN}/calendar`;

export const USERAUTH_BASE_URL = `${BASE_HOST_DOMAIN}/auth`;
// export const USERAUTH_BASE_URL = `http://localhost:3000/auth`;

export const TECHNICALANALYSIS_BASE_URL = `${BASE_HOST_DOMAIN}/technical`;

export const NOTIFICATION_BASE_URL = `${BASE_HOST_DOMAIN}/notifications`;

export const REWARDS_BASE_URL = `${BASE_HOST_DOMAIN}`;

export const REFERRAL_BASE_URL = `${BASE_HOST_DOMAIN}/referral`;
// export const REFERRAL_BASE_URL = `http://localhost:3000/referral`;


export const WS_CONNECTION_URL = `${BASE_HOST_DOMAIN}`;
// export const WS_CONNECTION_URL = `http://127.0.0.1:3000`;

export const GAME_SYSTEM_BASEURL = `${BASE_HOST_DOMAIN}/game-system`;
// export const GAME_SYSTEM_BASEURL = `http://127.0.0.1:3000/game-system`;

export const COINGECKO_URL = "https://api.coingecko.com/api/v3";

export const ZEROX_BASE_URL = `${BASE_HOST_DOMAIN}/0x`;

export const DEXFIN_BACKEND_BASE_URL = `${BASE_HOST_DOMAIN}`;

export const ZEROX_AFFILIATE_FEE = 50; // 0.5% affiliate fee. Denoted in Bps.

export const defaultMaxPriorityFee = ethers.utils.parseUnits('1.5', 'gwei');

export const defaultGasLimit = 210000n;

export const NULL_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const nativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase();

export const SOL_TRANSFER_GAS_FEE = 0.000005;
