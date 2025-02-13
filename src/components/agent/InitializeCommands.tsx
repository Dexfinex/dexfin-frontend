import {
  Brain,
  LineChart,
  Wallet,
} from 'lucide-react';

interface InitializeCommands {
  processCommand: (command: string, address: string, chainId: number | undefined) => void;
  address: string;
  chainId: number | undefined;
  setInput: (value: string) => void;
}

export function InitializeCommands({ processCommand, address, chainId, setInput }: InitializeCommands) {

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8">
        <Brain className="w-12 h-12 text-blue-500" />
      </div>

      <h1 className="text-4xl font-bold mb-4 text-center">Crypto Companion</h1>
      <p className="text-white/60 text-center max-w-md mb-8">
        Your AI assistant for crypto market insights and DeFi operations
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Market Data Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-400" />
            <span>Market Data</span>
          </h2>
          <div className="space-y-2">
            {[
              { command: "What is the Bitcoin price?", description: "Get real-time BTC price" },
              { command: "Show me trending tokens", description: "View trending cryptocurrencies" },
              { command: "Show me the latest news", description: "Get latest crypto news" },
              { command: "Evaluate project wayfinder", description: "Analyze project potential" }
            ].map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => {
                  processCommand(cmd.command, address, chainId);
                  setInput('');
                }}
                className="w-full p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl hover:from-white/15 hover:to-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col h-full">
                  <p className="font-medium text-blue-400 mb-2">{cmd.command}</p>
                  <p className="text-sm text-white/60">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trading & Portfolio Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span>Trading & Portfolio</span>
          </h2>
          <div className="space-y-2">
            {[
              { command: "Transfer 10 USDC to vitalik.eth", description: "Transfer USDC to vitalik.eth" },
              { command: "I want to swap 10 USDC for ETH", description: "Swap USDC for ETH" },
              { command: "Stake 1 ETH", description: "Stake ETH" },
              { command: "Deposit 100 USDC on Aave", description: "Deposit USDC" },
            ].map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => {
                  processCommand(cmd.command, address, chainId);
                  setInput('');
                }}
                className="w-full p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl hover:from-white/15 hover:to-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="flex flex-col h-full">
                  <p className="font-medium text-blue-400 mb-2">{cmd.command}</p>
                  <p className="text-sm text-white/60">{cmd.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}