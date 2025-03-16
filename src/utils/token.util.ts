import { ethers } from "ethers";
import { mapChainId2ViemChain } from "../config/networks";
import { erc20Abi } from "viem";
import ErrorImg from "/images/token/error.svg";
import { coingeckoService } from "../services/coingecko.service";
import { birdeyeService } from "../services/birdeye.service";
import { TokenType } from "../types/swap.type";
import { SOLANA_CHAIN_ID } from "../constants/solana.constants";

export const formatNumber = (num: string | number, fixedCount = 2) => {
    // Define the threshold below which numbers are shown as-is
    const threshold = 0.01;
    const minThreshold = 0.000001;
    num = parseFloat(num.toString());

    const getFixedNum = (num: number, fixedCount: number) => {
        const multipleValue = (10 ** fixedCount);
        return (Math.floor(num * multipleValue) / multipleValue).toString();
    }

    // If the number is less than the threshold, keep it as-is, otherwise use toFixed()
    if (Number.isInteger(num) || (Math.abs(num) < threshold && Math.abs(num) > minThreshold)) {
        const lengthAfterDecimal = Math.ceil(Math.log10(1 / num));
        if (num > 0 && lengthAfterDecimal > 0) {
            return getFixedNum(num, lengthAfterDecimal + 2);
        }
    }

    return getFixedNum(num, fixedCount);
}

export const getTokenInfo = async (address: string, chainId: number) => {
    if (chainId != SOLANA_CHAIN_ID) {
        const chain = mapChainId2ViemChain[chainId];
        const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrls.default.http[0]);

        const contract = new ethers.Contract(address, erc20Abi, provider);

        try {
            const [name, symbol, decimals] = await Promise.all([
                contract.name(),
                contract.symbol(),
                contract.decimals(),
            ]);

            const coinId = await coingeckoService.getCoinGeckoIdFrom(address, chainId);
            if (coinId) {
                const coinInfo = await coingeckoService.getInfo(coinId);

                return {
                    symbol,
                    name,
                    address,
                    chainId,
                    decimals,
                    logoURI: coinInfo.image.small
                } as TokenType
            } else {
                return {
                    symbol,
                    name,
                    address,
                    chainId,
                    decimals,
                    logoURI: ErrorImg
                } as TokenType;
            }
        } catch (err) {
            console.log('get token info err: ', err);
        }
    } else {
        const tokenInfo = birdeyeService.getTokenInfo(address);
        return tokenInfo;
    }

    return null;
}