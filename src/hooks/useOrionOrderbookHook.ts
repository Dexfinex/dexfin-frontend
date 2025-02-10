import { useEffect, useState } from "react";
import { EXCHANGE_ICONS_URL } from "../constants/mock/tradepairs";
import { Order, parseOrderbookItem, parseTickerToPriceFeed } from "./useOrionHook";

interface NormalizedOrder {
    price: number;
    size: number;
    total: number;
    depth?: number;
    exchangesImgUrls: string[];
}

interface TickerSubscription {
    unsubscribe: () => void;
    id: string;
}

interface WebSocketUnit {
    aggregator: {
        ws: {
            subscribe: (type: string, config: {
                payload: string;
                callback: (asks: any[], bids: any[]) => void;
            }) => void;
            unsubscribe: (symbol: string) => void;
        };
    };
    priceFeed: {
        ws: {
            subscribe: (type: string, config: {
                payload: string;
                callback: (ticker: any) => void;
            }) => TickerSubscription;
            unsubscribe: (type: string, id: string) => void;
        };
    };
}

let tickerSubscription: TickerSubscription | null = null;

export const useOrionOrderbookHook = (pairSymbol: string, unit: WebSocketUnit) => {
    const [bids, setBids] = useState<NormalizedOrder[]>([]);
    const [asks, setAsks] = useState<NormalizedOrder[]>([]);
    const [currentPriceFeed, setCurrentPriceFeed] = useState<any>(null);

    const getMaxTotalSum = (orders: NormalizedOrder[]): number => {
        const totalSums: number[] = orders.map(order => order.total);
        return Math.max(...totalSums);
    };

    const normalizeOrders = (orders: Order[]): NormalizedOrder[] => {
        const array: NormalizedOrder[] = orders.map((order) => {
            return {
                price: order.price.toNumber(),
                size: order.size.toNumber(),
                total: order.total.toNumber(),
                exchangesImgUrls: order.exchanges.map(exchange => {
                    const imgName = exchange.split('_')[0];
                    return EXCHANGE_ICONS_URL +
                        (imgName === 'internal' ? 'internal_pool_v2' : imgName) +
                        '.svg';
                })
            };
        });

        const maxTotal = getMaxTotalSum(array);

        return array.map((order) => ({
            ...order,
            depth: order.total / maxTotal * 100
        }));
    };

    const unSubscribeFunction = (): void => {
        if (pairSymbol) {
            unit.aggregator.ws.unsubscribe(pairSymbol);
        }

        if (tickerSubscription) {
            console.log("remove tickerSubscription");
            tickerSubscription.unsubscribe();
            unit.priceFeed.ws.unsubscribe("ticker", tickerSubscription.id);
        }
    };

    useEffect(() => {
        unit.aggregator.ws.subscribe("aobus", {
            payload: pairSymbol,
            callback: (asks: any[], bids: any[]) => {
                const normalizedBids = normalizeOrders(bids.map(parseOrderbookItem));
                const normalizedAsks = normalizeOrders(asks.map(parseOrderbookItem));

                setBids(normalizedBids);
                setAsks(normalizedAsks);
            },
        });

        tickerSubscription = unit.priceFeed.ws.subscribe("ticker", {
            callback: (ticker: any) => {
                setCurrentPriceFeed(parseTickerToPriceFeed(ticker, pairSymbol));
            },
            payload: pairSymbol
        });

        return unSubscribeFunction;
    }, [pairSymbol, unit]);

    return {
        asks,
        bids,
        currentPriceFeed
    };
};