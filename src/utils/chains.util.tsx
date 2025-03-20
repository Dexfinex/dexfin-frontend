import { ethers } from "ethers";
import { SOLANA_CHAIN_ID } from "../constants/solana.constants";
import { mapChainId2ViemChain } from "../config/networks";
import { erc20Abi } from "viem";
import { SOL_TRANSFER_GAS_FEE } from "../constants";

// Constants
const ICONS_CDN = 'https://icons.llamao.fi/icons' as const;

// Type definitions
type TokenMap = {
  [key: string]: unknown;
};

type CurrencySymbol = string | boolean;

// String manipulation utilities
export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// URL generation utilities
export function chainIconUrl(chain: string): string {
  return `${ICONS_CDN}/chains/rsz_${chain.toLowerCase()}?w=48&h=48`;
}

export function protoclIconUrl(protocol: string): string {
  return `${ICONS_CDN}/protocols/${protocol}?w=48&h=48`;
}

// Local storage utilities
export function getSavedTokens(): TokenMap {
  const savedTokens = localStorage.getItem('savedTokens');
  return JSON.parse(savedTokens || '{}');
}

// Mathematical utilities
export const median = (arr: number[]): number => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

// Number formatting utilities
export const formattedNum = (
  number: string | number,
  symbol: CurrencySymbol = false,
  acceptNegatives: boolean = false
): string => {
  let currencySymbol: string;

  if (symbol === true) {
    currencySymbol = '$';
  } else if (symbol === false) {
    currencySymbol = '';
  } else {
    currencySymbol = symbol;
  }

  if (!number || number === '' || Number.isNaN(Number(number))) {
    return symbol ? `${currencySymbol}0` : '0';
  }

  let num = parseFloat(String(number));
  const isNegative = num < 0;

  let maximumFractionDigits = num < 1 ? 8 : 4;
  maximumFractionDigits = num > 100000 ? 2 : maximumFractionDigits;

  const formattedNum = num.toLocaleString('en-US', {
    maximumFractionDigits
  });

  return formattedNum;
};

// Token normalization utilities
export const normalizeTokens = (
  t0: string = '0',
  t1: string = '0'
): [string, string] | null => {
  if (!t0 || !t1) return null;

  const token0 = t0.toLowerCase();
  const token1 = t1.toLowerCase();

  return Number(t0) < Number(t1)
    ? [token0, token1]
    : [token1, token0];
};

export const getGasEstimation = async (tokenAddress: string, recipientAddress: string, balance: string, decimals: number, chainId: number) => {
  try {
    if (chainId != SOLANA_CHAIN_ID) {
      const chain = mapChainId2ViemChain[chainId];
      const rpcUrl = (chainId == 56 ? "https://binance.llamarpc.com" : chain.rpcUrls.default.http[0]);
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
      console.log('calculate gas limit')
      const amount = ethers.utils.parseUnits(balance, decimals);  // Amount to transfer (adjust decimals)
      const gasLimit = await tokenContract.estimateGas.transfer(recipientAddress, amount);
      console.log('gas limit = ', gasLimit)
      const gasPrice = await provider.getGasPrice();

      const gasFee = gasLimit.mul(gasPrice);  // Gas fee in wei
      const gasFeeInEth = ethers.utils.formatEther(gasFee);  // Convert from wei to ETH

      return Number(gasFeeInEth);
    } else {
      return Number(SOL_TRANSFER_GAS_FEE);
    }
  } catch (err) {
    console.log('gas estimation err: ', err);
  }

  return 0;
}