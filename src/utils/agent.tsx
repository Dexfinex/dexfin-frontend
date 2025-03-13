import { PublicKey } from '@solana/web3.js'
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";
import {tokenList} from '../constants/mock/solana';
import { connection } from "../config/solana.ts";

export function convertBrianKnowledgeToPlainText(text: string) {
  return text
    .replace(/^###\s*(\d+\.)\s*\*\*(.*?)\*\*/gm, '$1 $2') // Remove ### and bold from numbered headings
    .replace(/\*\*(.*?)\*\*:/g, '$1:'); // Convert "**Tokens:**" to "<b>Tokens</b>:"
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


export function BollingerBandsProgress({ value,  upperBand, lowerBand }: any): number {
  if(upperBand-lowerBand == 0) return 0;
  if(lowerBand && upperBand) return (value-lowerBand)*100/(upperBand-lowerBand);
  return 0;
}

export function symbolToToken(symbol: string): any {
  
  if(symbol=="SOL") {
    const token = tokenList.find(token => token.symbol === symbol && token.name === "Wrapped SOL");
    return token;
  } else {
    const token = tokenList.find(token => token.symbol === symbol);
    return token;
  }
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
      const {registry} : any = await NameRegistryState.retrieve(connection, pubkey);
      return registry.owner.toBase58();
  } catch (error) {
      console.error("No Solana address found for this domain:", error);
  }
}