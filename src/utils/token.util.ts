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


export const TOkEN_kEY_NAME = 'newlyAddedTokens';

export const getTokenInfo = async (address: string, chainId: number) => {
    const data = localStorage.getItem(TOkEN_kEY_NAME);
    if (data) {
        const tokens = JSON.parse(data);
        const found = tokens.find((token: any) => token.address == address && token.chainId == chainId);
        if (found) {
            return found;
        }
    }

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
            let result: TokenType = {} as TokenType;

            if (coinId) {
                const coinInfo = await coingeckoService.getInfo(coinId);
                result = {
                    symbol,
                    name,
                    address,
                    chainId,
                    decimals,
                    logoURI: coinInfo.image.small
                } as TokenType;
            } else {
                result = {
                    symbol,
                    name,
                    address,
                    chainId,
                    decimals,
                    logoURI: ErrorImg
                } as TokenType;
            }

            const data = localStorage.getItem(TOkEN_kEY_NAME);
            if (data) {
                localStorage.setItem(TOkEN_kEY_NAME, JSON.stringify([...JSON.parse(data), result]));
            } else {
                localStorage.setItem(TOkEN_kEY_NAME, JSON.stringify([result]));
            }

            return result;
        } catch (err) {
            console.log('get token info err: ', err);
        }
    } else {
        const response = await birdeyeService.getTokenInfo(address);
        const tokenInfo = { ...response, chainId: SOLANA_CHAIN_ID };

        const data = localStorage.getItem(TOkEN_kEY_NAME);
        if (data) {
            localStorage.setItem(TOkEN_kEY_NAME, JSON.stringify([...JSON.parse(data), tokenInfo]));
        } else {
            localStorage.setItem(TOkEN_kEY_NAME, JSON.stringify([tokenInfo]));
        }
        return tokenInfo;
    }

    return null;
}