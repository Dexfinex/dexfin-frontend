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

export function BollingerBandsProgress({ value,  upperBand, lowerBand }: { value: number; signal: string; upperBand: number; lowerBand: number }): number {
  return (value-lowerBand)*100/(upperBand-lowerBand);
}