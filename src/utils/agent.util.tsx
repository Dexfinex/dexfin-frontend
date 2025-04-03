import { PublicKey } from '@solana/web3.js'
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";
import { tokenList } from '../constants/mock/solana.ts';
import { connection } from "../config/solana.ts";
import { createPublicClient, http } from 'viem';
import { normalize } from 'viem/ens';
import { mapChainId2ViemChain } from "../config/networks.ts";
import {
  mapRpcUrls,
} from "../constants/index.ts";
import { deposit_token_data } from '../constants/mock/agent.ts';
const publicClient = createPublicClient({
  transport: http(mapRpcUrls[1]),
  chain: mapChainId2ViemChain[1],
})

export function convertBrianKnowledgeToPlainText(text: string) {
  return text

    .replace(/###\s(.*?)(\n|$)/g, "<span style='font-size: 24px; font-weight: bold;'>$1</span>$2")
    .replace(/\*\*([^*]+)\*\*/g, "<span style='font-weight: bold;'>$1</span>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
      (match, text, url) => {
        return `<a href="${url}" style="color: var(--chakra-colors-green-400)">${text}</a>`;
      })
    .replace(/\n"\n/g, '')
    .replace(/\\\[ (.*?) \\]/g, "$1")
    .replace(/\n"/g, '')
}

export const parseChainedCommands = (message: string): string[] => {
  // Split on "and" or "&" while preserving quoted strings
  const commands = message.split(/\s+(?:and|&)\s+/i).map(cmd => cmd.trim());
  return commands;
};

export function convertCryptoAmount(fromAmount: string, decimal: number): number {
  return parseFloat(fromAmount) / Math.pow(10, decimal);
}

export function formatVolume(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};


export function BollingerBandsProgress({ value, upperBand, lowerBand }: any): number {
  if (upperBand - lowerBand == 0) return 0;
  if (lowerBand && upperBand) return (value - lowerBand) * 100 / (upperBand - lowerBand);
  return 0;
}

export function symbolToToken(symbol: string): any {

  if (symbol == "SOL") {
    return tokenList.find(token => token.symbol === symbol && token.name === "Wrapped SOL");
  } else {
    return tokenList.find(token => token.symbol === symbol);
  }
}

export function depositAddress(address: string, chainId: number, protocol: string): string {
  const token = deposit_token_data.find(token => token.chainId === chainId && token.protocol.toLocaleLowerCase() === protocol.toLocaleLowerCase() && token.underlyingTokens?.some(underlyingToken => underlyingToken.address.toLocaleLowerCase() === address.toLocaleLowerCase()));
  return token?.address || '';
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getSolAddressFromSNS(domain: string) {
  try {
    const { pubkey } = await getDomainKey(domain);
    const { registry }: any = await NameRegistryState.retrieve(connection, pubkey);
    return registry.owner.toBase58();
  } catch (error) {
    console.error("No Solana address found for this domain:", error);
  }
}

export async function resolveEnsToAddress(ensName: string) {
  try {
    const address = await publicClient.getEnsAddress({ name: normalize(ensName) });
    return address;
  } catch (error) {
    console.error('Error resolving ENS:', error);
    return 'Error';
  }
}