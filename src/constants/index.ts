import {arbitrum, avalanche, base, bsc, linea, mainnet, optimism, polygon} from "@wagmi/core/chains";
import {baseSepolia, sepolia} from "viem/chains";
import {ethers} from "ethers";

export * from "./zerodev"

export const LOCAL_STORAGE_WALLET_INFO = 'LIT-WALLET-INFO'
export const LOCAL_STORAGE_AUTH_REDIRECT_TYPE = 'REDIRECT-TYPE'

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

export const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY as string || 'CG-XQa2AKt6eiVgLFnK8Ch7xJV2';
export const COINGECKO_BASE_URL = 'https://pro-api.coingecko.com/api/v3';

export const COINGECKO_BASE_URL_2 = 'https://dexfinv3-backend-production.up.railway.app/coingecko';

export const DEFILLAMA_BASE_URL = "";

export const FEARGREED_BASE_URL = "https://dexfinv3-backend-production.up.railway.app/fear-greed";

export const GECKOTERMINAL_BASE_URL = "https://dexfinv3-backend-production.up.railway.app/gecko-terminal";

export const CRYPTONEWS_BASE_URL = 'https://dexfinv3-backend-production.up.railway.app/crypto-news';

export const nativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase();

export const ZEROX_BASE_URL = 'https://dexfinv3-backend-production.up.railway.app/0x';
// export const ZEROX_BASE_URL = 'http://localhost:3000/0x';
export const DEXFIN_BACKEND_BASE_URL = 'https://dexfinv3-backend-production.up.railway.app';
export const ZEROX_AFFILIATE_FEE = 50; // 0.5% affiliate fee. Denoted in Bps.

export const defaultMaxPriorityFee = ethers.utils.parseUnits('1.5', 'gwei');
export const defaultGasLimit = 210000n;
export const NULL_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'