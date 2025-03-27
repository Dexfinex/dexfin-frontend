import { ethers } from "ethers";
import {mapChainId2ViemChain, NATIVE_MATIC_ADDRESS, PRICE_MATIC_ADDRESS} from "../config/networks";
import { erc20Abi } from "viem";
import { JsonRpcSigner } from "@ethersproject/providers";
import ErrorImg from "/images/token/error.svg";
import { coingeckoService } from "../services/coingecko.service";
import { birdeyeService } from "../services/birdeye.service";
import { TokenType } from "../types/swap.type";
import { SOLANA_CHAIN_ID } from "../constants/solana.constants";
import { mapChainId2NativeAddress } from "../config/networks.ts";
import { compareWalletAddresses } from "./common.util";
import {polygon} from "viem/chains";
import {NULL_ADDRESS, ZERO_ADDRESS} from "../constants";

export const getRealNativeTokenAddress = (chainId: number) => {
    if (chainId === polygon.id)
        return NATIVE_MATIC_ADDRESS
    return mapChainId2NativeAddress[chainId]
}

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
        const rpcUrl = (chainId == 56 ? "https://bsc-rpc.publicnode.com" : chain.rpcUrls.default.http[0]);
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

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
                } as TokenType;
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
        const response = await birdeyeService.getTokenInfo(address);
        return { ...response, chainId: SOLANA_CHAIN_ID };
    }

    return null;
}

export const getTokenOutAmount = async (amount: number, address: string, chainId: number, signer: JsonRpcSigner | undefined) => {

    const contract = new ethers.Contract(address, erc20Abi, signer);

    try {
        const nativeTokenAddress = mapChainId2NativeAddress[Number(chainId)];
        const isNativeToken = compareWalletAddresses(nativeTokenAddress, address);
        const decimals = isNativeToken ? 18 : await contract.decimals();

        return Number(ethers.utils.parseUnits(
            amount + "",
            decimals
        ));
    } catch (err) {
        console.log('get token info err: ', err);
        return 0
    }
}

export const getTokenOutAmountByPercent = async (percent: number, fromAddress: string, address: string, signer: JsonRpcSigner | undefined) => {
    const contract = new ethers.Contract(address, erc20Abi, signer);
    try {
        const balance = await contract.balanceOf(fromAddress);
        return Math.ceil(Number(balance) * percent / 100);
    } catch (err) {
        console.log('get token info err: ', err);
        return 0;
    }
}

export const getTokenAddressForTokenPrice = (address: string, chainId: number) => {
    if (chainId === polygon.id) {
        return address.toLowerCase() === NULL_ADDRESS ? PRICE_MATIC_ADDRESS : address
    }
    return address.toLowerCase() === NULL_ADDRESS ? ZERO_ADDRESS : address
}
export const getOriginTokenAddressFrom = (address: string, chainId: number) => {
    if (chainId === polygon.id) {
        return address.toLowerCase() === PRICE_MATIC_ADDRESS ? NULL_ADDRESS : address
    }
    return address.toLowerCase() === ZERO_ADDRESS ? NULL_ADDRESS : address
}