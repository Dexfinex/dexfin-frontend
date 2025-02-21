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