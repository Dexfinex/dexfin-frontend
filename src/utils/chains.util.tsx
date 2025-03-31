import {ethers} from "ethers";
import {SOLANA_CHAIN_ID} from "../constants/solana.constants";
import {mapChainId2ViemChain} from "../config/networks";
import {SOL_TRANSFER_GAS_FEE} from "../constants";

// Constants
const ICONS_CDN = 'https://icons.llamao.fi/icons' as const;

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

export const getGasEstimationForNativeTokenTransfer = async (recipientAddress: string, balance: string, decimals: number, chainId: number) => {
  try {
    if (chainId != SOLANA_CHAIN_ID) {
      const chain = mapChainId2ViemChain[chainId];
      const rpcUrl = (chainId == 56 ? "https://bsc-rpc.publicnode.com" : chain.rpcUrls.default.http[0]);
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      console.log('calculate gas limit')
      const amount = ethers.utils.parseUnits(balance, decimals);  // Amount to transfer (adjust decimals)
      const gasLimit = await provider.estimateGas({
        to: recipientAddress,
        value: amount
      })
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