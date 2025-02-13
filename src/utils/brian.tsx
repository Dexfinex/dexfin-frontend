export function convertBrianKnowledgeToPlainText(text: string) {
  return text
    .replace(/"\n+/g, '')
    .replace(/###?.*?\n/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/-\s+/g, '')
    .replace(/\d+\.\s+/g, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}

export const parseChainedCommands = (message: string): string[] => {
  // Split on "and" or "&" while preserving quoted strings
  const commands = message.split(/\s+(?:and|&)\s+/i).map(cmd => cmd.trim());
  return commands;
};

export function convertCryptoAmount(fromAmount: string, decimal: number): number {
  return parseFloat(fromAmount) / Math.pow(10, decimal);
}