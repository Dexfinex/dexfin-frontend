import { useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Web3AuthContext } from "../providers/Web3AuthContext.tsx";
import { formatDate, formatNumberByFrac } from "../utils/trade.util.ts";

interface TickerSubscription {
    unsubscribe: () => void;
    id: string;
}

interface PriceFeed {
    name: string;
    fromCurrency: string;
    toCurrency: string;
    lastPrice: BigNumber;
    openPrice: BigNumber;
    change24h: BigNumber;
    high: BigNumber;
    low: BigNumber;
    vol24h: BigNumber;
}

interface Ticker {
    lastPrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume24h: string;
}

export interface Order {
    price: number;
    size: number;
    total: number;
    depth: number;
    exchangesImgUrls: string[];
}

interface OrderbookItem {
    price: BigNumber;
    size: BigNumber;
    total: BigNumber;
    cumulativeSize: BigNumber;
    cumulativeTotal: BigNumber;
    avgPrice: BigNumber;
    deltaSize: number;
    exchanges: string[];
}

interface SubOrder {
    id: string;
    pair: string;
    side: string;
    price: number;
    amount: number;
    status: string;
    exchange: string;
}

interface OrderData {
    id: string;
    type: string;
    pair: string;
    price: number;
    amount: number;
    status: string;
    date: number;
    fee?: string;
    feeAsset?: string;
    isReversedOrder: boolean;
    kind: string;
    clientOrdId?: string;
    executionType: string;
    subOrders: SubOrder[];
}

interface CustomizedOrder {
    tableRowKey: string;
    isExpanded: boolean;
    isMainRow: boolean;
    kind: string;
    id: string;
    id_sliced: string;
    feeAsset?: string;
    fee?: string;
    status: string;
    date: number;
    dateText: string;
    clientOrdId?: string;
    type: string;
    pair: string;
    total: string;
    baseSymbol: string;
    targetSymbol: string;
    settledAmount: number;
    amount: string;
    price: number;
    filledPrice: string;
    feeText: string;
    typeColor: string;
    statusColor: string;
    executionType: string;
    isReversedOrder: boolean;
    subOrders: CustomizedSubOrder[];
}

interface CustomizedSubOrder {
    id: string;
    pair: string;
    side: string;
    amountBase: string;
    orderPrice: number;
    filledPrice: string;
    amountQuote: string;
    exchanges: string;
    settledAmount: string;
    status: string;
    sideColor: string;
    statusColor: string;
}

interface Unit {
    priceFeed: {
        ws: {
            subscribe: (type: string, config: {
                callback: (data: any) => void;
                payload?: string;
            }) => TickerSubscription;
            unsubscribe: (type: string, id?: string) => void;
        };
    };
    aggregator: {
        ws: {
            subscribe: (type: string, config: {
                payload: string;
                callback: (data: any) => void;
            }) => void;
            unsubscribe: (type: string) => void;
        };
    };
}

let allTickersSubscription: TickerSubscription | null = null;

export const useOrionHook = (unit: Unit) => {
    const [priceFeedAll, setPriceFeedAll] = useState<Record<string, PriceFeed>>({});
    const [balances, setBalances] = useState<Record<string, any>>({});
    const [orderHistories, setOrderHistories] = useState<CustomizedOrder[]>([]);

    const { address } = useContext(Web3AuthContext);

    const unSubscribeFunction = (): void => {
        if (allTickersSubscription) {
            allTickersSubscription.unsubscribe();
            unit.priceFeed.ws.unsubscribe("allTickers", allTickersSubscription.id);
        }
    };

    useEffect(() => {
        unSubscribeFunction();

        allTickersSubscription = unit.priceFeed.ws.subscribe("allTickers", {
            callback: (tickers: Record<string, Ticker>) => {
                const _priceFeedAll = parseTickersToPriceFeedAll(tickers);
                setPriceFeedAll(_priceFeedAll);
            },
        });

        return unSubscribeFunction;
    }, [unit]);

    useEffect(() => {
        console.log("balances changed", balances);
    }, [balances]);

    useEffect(() => {
        if (address === null) return;

        console.log("order-history subscribe", unit);

        unit.aggregator.ws.subscribe(
            "aus",
            {
                payload: address,
                callback: (data: {
                    kind: string;
                    balances?: Record<string, any>;
                    orders?: OrderData[];
                    order?: OrderData;
                }) => {
                    switch (data.kind) {
                        case "initial":
                            if (data.balances && Object.keys(data.balances).length > 0) {
                                setBalances(data.balances);
                            }

                            if (data.orders) {
                                setOrderHistories(customizeOrderData(data.orders));
                            }
                            break;

                        case "update": {
                            if (data.balances && Object.keys(data.balances).length > 0) {
                                setBalances((prevBalances) => ({
                                    ...prevBalances,
                                    ...data.balances
                                }));
                            }

                            if (data.order && data.order.subOrders?.[0]) {
                                if (!data.order.pair) {
                                    data.order.pair = data.order.subOrders[0].pair;
                                    data.order.price = data.order.subOrders[0].price;
                                    data.order.amount = data.order.subOrders[0].amount;
                                    data.order.isReversedOrder = false;
                                    data.order.date = Date.now();
                                }

                                setOrderHistories((prevOrderHistories) => {
                                    const updatedOrder = customizeOrderData([data.order])[0];
                                    const updatedOrderHistories = prevOrderHistories.reduce<CustomizedOrder[]>((accu, value) => {
                                        if (value.id !== updatedOrder.id) {
                                            accu.push(value);
                                        }
                                        return accu;
                                    }, []);

                                    return [updatedOrder, ...updatedOrderHistories];
                                });
                            }
                        }
                    }
                },
            }
        );

        return () => {
            unit.priceFeed.ws.unsubscribe("aus");
        };
    }, [unit, address]);

    return {
        priceFeedAll,
        balances,
        orderHistories
    };
};

export function parseTickersToPriceFeedAll(tickers: Record<string, Ticker>): Record<string, PriceFeed> {
    const result: Record<string, PriceFeed> = {};
    Object.keys(tickers).forEach(key => {
        const value = tickers[key];
        result[key] = parseTickerToPriceFeed(value, key);
    });
    return result;
}

export function parseTickerToPriceFeed(ticker: Ticker, pairSymbol: string): PriceFeed {
    const name = pairSymbol;
    const [fromCurrency, toCurrency] = name.split('-');
    const lastPrice = new BigNumber(ticker.lastPrice);
    const openPrice = new BigNumber(ticker.openPrice);
    const change24h = lastPrice.div(openPrice).minus(1).multipliedBy(100);
    const high = new BigNumber(ticker.highPrice);
    const low = new BigNumber(ticker.lowPrice);
    const vol24h = new BigNumber(ticker.volume24h);

    return { name, fromCurrency, toCurrency, lastPrice, openPrice, change24h, high, low, vol24h };
}

export function parseOrderbookItem(obj: { price: string; amount: string; exchanges?: string[] }): OrderbookItem {
    const price = new BigNumber(obj.price);
    const size = new BigNumber(obj.amount);
    return {
        price,
        size,
        total: price.multipliedBy(size),
        cumulativeSize: new BigNumber(0),
        cumulativeTotal: new BigNumber(0),
        avgPrice: new BigNumber(0),
        deltaSize: 0,
        exchanges: obj.exchanges ? obj.exchanges.map(s => s.toLowerCase()) : []
    };
}

const redColor = '#f03349';
const greenColor = '#179981';
const yellowColor = '#e1a714';

const customizeOrderData = (list: OrderData[]): CustomizedOrder[] => {
    return list.map((data, index) => {
        if (data.type == null) {
            data.type = data.subOrders?.[0]?.side;
        }

        const pairSymbols = data.pair.split('-');
        const baseSymbol = pairSymbols[0];
        const targetSymbol = pairSymbols[1];

        const pair = data.isReversedOrder
            ? `${targetSymbol}/${baseSymbol}`
            : `${baseSymbol}/${targetSymbol}`;

        let realAmount = data.isReversedOrder ? data.price * data.amount : data.amount;
        realAmount = formatNumberByFrac(realAmount, 6);

        const type = data.isReversedOrder
            ? (data.type === "SELL" ? 'Buy' : 'Sell')
            : (data.type === "SELL" ? 'Sell' : 'Buy');

        const dateText = formatDate(data.date);
        const price = data.isReversedOrder
            ? formatNumberByFrac(1 / data.price, 6)
            : data.price;

        const total = data.status === 'SETTLED'
            ? formatNumberByFrac(parseFloat(realAmount) * parseFloat(price.toString()), 6)
            : '-';

        const filledPrice = data.status === 'SETTLED' ? price : '-';
        const settledAmount = data.status === 'SETTLED' ? realAmount : 0;
        const feeText = data.fee ? `${data.fee} ${data.feeAsset}` : '';

        return {
            tableRowKey: 'origin-row-' + index,
            isExpanded: false,
            isMainRow: true,
            kind: data.kind,
            id: data.id,
            id_sliced: data.id.slice(0, 10),
            feeAsset: data.feeAsset,
            fee: data.fee,
            status: data.status,
            date: data.date,
            dateText,
            clientOrdId: data.clientOrdId,
            type,
            pair,
            total,
            baseSymbol,
            targetSymbol,
            settledAmount,
            amount: realAmount,
            price,
            filledPrice,
            feeText,
            typeColor: type === 'Buy' ? greenColor : redColor,
            statusColor: data.status === 'SETTLED' ? greenColor : (data.status === 'CANCELED' ? redColor : yellowColor),
            executionType: data.executionType,
            isReversedOrder: data.isReversedOrder,
            subOrders: data.subOrders.map((subOrder): CustomizedSubOrder => {
                const subPairSymbols = subOrder.pair.split('-');
                const subBaseSymbol = subPairSymbols[0];
                const subTargetSymbol = subPairSymbols[1];

                const subPair = data.isReversedOrder
                    ? `${subTargetSymbol}/${subBaseSymbol}`
                    : `${subBaseSymbol}/${subTargetSymbol}`;

                let subRealAmount = data.isReversedOrder ? subOrder.price * subOrder.amount : subOrder.amount;
                subRealAmount = formatNumberByFrac(subRealAmount, 6);

                const subType = data.isReversedOrder
                    ? (subOrder.side === "SELL" ? 'Buy' : 'Sell')
                    : (subOrder.side === "SELL" ? 'Sell' : 'Buy');

                const subPrice = data.isReversedOrder
                    ? formatNumberByFrac(1 / subOrder.price, 6)
                    : subOrder.price;

                const subTotal = data.status === 'SETTLED'
                    ? formatNumberByFrac(parseFloat(subRealAmount) * parseFloat(subPrice.toString()), 6)
                    : '-';

                const subFilledPrice = data.status === 'SETTLED' ? subPrice : '-';

                return {
                    id: subOrder.id,
                    pair: subPair,
                    side: subType,
                    amountBase: `${subRealAmount} ${subBaseSymbol}`,
                    orderPrice: subPrice,
                    filledPrice: subFilledPrice,
                    amountQuote: `${subTotal} ${subTargetSymbol}`,
                    exchanges: subOrder.exchange,
                    settledAmount: data.status === 'SETTLED' ? `${subRealAmount} ${subBaseSymbol}` : '0',
                    status: subOrder.status,
                    sideColor: subType === 'Buy' ? greenColor : redColor,
                    statusColor: subOrder.status === 'SETTLED' ? greenColor : (subOrder.status === 'CANCELED' ? redColor : yellowColor)
                };
            })
        };
    });
};