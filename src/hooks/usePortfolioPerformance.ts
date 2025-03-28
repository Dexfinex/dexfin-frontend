import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { birdeyeService } from "../services/birdeye.service";
import { coingeckoService } from "../services/coingecko.service";

import useTokenBalanceStore from "../store/useTokenBalanceStore";
import { getHourAndMinute, getMonthDayHour, getMonthDayYear } from "../utils/common.util";

type TimeRangeType = {
    mseconds: number,
    solInterval: string,
    interval: string,
}

const customMapTimeRange: Record<string, TimeRangeType> = {
    "24h": { mseconds: 86400, solInterval: "1H", interval: "1H" },
    "7d": { mseconds: 604800, solInterval: "1D", interval: "24H" },
    "1m": { mseconds: 2592000, solInterval: "1D", interval: "24H" },
};

interface ChartPosition {
    time: string;
    price: number;
}

export const usePortfolioPerformance = (selectedTimeframe: string) => {

    const tokenBalances = useTokenBalanceStore.getState().tokenBalances;

    const formatChartData = (data: any): ChartPosition[] => {
        return data.map((e: { time: number, close: number, open: number, low: number }) => {
            let readableTime = ""

            switch (selectedTimeframe) {
                case "24h":
                    readableTime = getHourAndMinute(e.time * 1000);
                    break;
                case "7d":
                    readableTime = getMonthDayHour(e.time * 1000);
                    break;
                case "1m":
                    readableTime = getMonthDayHour(e.time * 1000);
                    break;
                case "3m":
                    readableTime = getMonthDayYear(e.time * 1000);
                    break;
                default:
                    readableTime = getMonthDayHour(e.time * 1000);
                    break;
            }

            return {
                time: readableTime,
                price: e.close
            }
        })
    }

    const fetchPortfolio = useCallback(async () => {
        const currentTime = Math.round(Date.now() / 1000) - 60;
        let portfolioData: ChartPosition[] = [];
        for (const token of tokenBalances) {
            const networkId = Number(token.chain);
            const tokenAddress = token.address;
            const tokenId = token.tokenId === "ethereum" ? (networkId === 1 ? token.tokenId : ("w" + token.symbol.toLowerCase())) : token.tokenId;

            if (token.usdPrice === 0) {
                continue;
            }

            if (Number(networkId) === 900) {
                const timeFrom = currentTime - customMapTimeRange[selectedTimeframe].mseconds
                const priceList = await birdeyeService.getOHLCV(tokenAddress, customMapTimeRange[selectedTimeframe].solInterval, timeFrom, currentTime)
                const formatPriceList = formatChartData(priceList)
                const valueList = formatPriceList.map((price) => {
                    return {
                        price: Number(price.price) * Number(token.balance),
                        time: price.time
                    }
                })
                for (let index = 0; index < valueList.length; index++) {
                    portfolioData[index] = {
                        price: Number(portfolioData[index]?.price || 0) + Number(valueList[index].price),
                        time: valueList[index].time
                    }
                }
            } else { // will add 0x
                const timeFrom = currentTime - customMapTimeRange[selectedTimeframe].mseconds
                const priceList = await coingeckoService.getOHLCV(tokenId, customMapTimeRange[selectedTimeframe].interval, timeFrom, currentTime)
                const formatPriceList = formatChartData(priceList)
                const valueList = formatPriceList.map((price) => {
                    return {
                        price: Number(price.price) * Number(token.balance),
                        time: price.time
                    }
                })
                for (let index = 0; index < valueList.length - 1; index++) {
                    portfolioData[index] = {
                        price: Number(portfolioData[index]?.price || 0) + Number(valueList[index].price),
                        time: valueList[index].time
                    }
                }
            }
        }

        return portfolioData;

    }, [tokenBalances, selectedTimeframe]);

    const { isLoading, refetch, data, error } = useQuery<ChartPosition[]>({
        queryKey: [`get-portfolio-info-${JSON.stringify(tokenBalances)}-${selectedTimeframe}`],
        queryFn: fetchPortfolio,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};