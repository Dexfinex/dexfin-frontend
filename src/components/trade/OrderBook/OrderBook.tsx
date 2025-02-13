import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Order } from '../../../hooks/useOrionHook';
import { ThreeDots } from "react-loader-spinner";
import { convertNumberIntoFormat, toFixedFloat } from "../../../utils/trade.util";

interface OrderBookProps {
    pairSymbol: string;
    lastPrice: string;
    asks: Order[];
    bids: Order[];
    pricePrecision: number;
    symbolAssetIn: string;
    symbolAssetOut: string;
    pairConfig: {
        pricePrecision: number;
    };
}

export enum OrderType {
    BIDS,
    ASKS
}

const OrderBook: FunctionComponent<OrderBookProps> = ({
    asks,
    bids,
    pairSymbol,
    pairConfig,
    pricePrecision,
    lastPrice,
    symbolAssetIn,
    symbolAssetOut
}) => {
    const asksContainer = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [totalAmountIn, setTotalAmountIn] = useState(0);
    const [totalAmountOut, setTotalAmountOut] = useState(0);
    const [avgPrice, setAvgPrice] = useState(0);
    const defaultAsksSelectedIndex = 101;
    const defaultBidsSelectedIndex = -1;
    const [asksSelectedIndex, setAsksSelectedIndex] = useState(defaultAsksSelectedIndex);
    const [bidsSelectedIndex, setBidsSelectedIndex] = useState(defaultBidsSelectedIndex);

    useEffect(() => {
        if (asks?.length > 0 && asksContainer.current && !isLoaded) {
            asksContainer.current.scrollTop = asksContainer.current.scrollHeight;
            setIsLoaded(true);
        }
    }, [asks, bids, isLoaded]);

    useEffect(() => {
        setIsLoaded(false);
    }, [pairSymbol]);

    const calculateTooltipValues = (orders: Order[]) => {
        let sumSize = 0, sumTotal = 0, sumPrice = 0;
        orders.forEach(order => {
            sumSize += order.size;
            sumTotal += order.total;
            sumPrice += order.price * order.size;
        });
        if (sumSize !== 0) {
            setAvgPrice(sumPrice / sumSize);
        }
        setTotalAmountIn(sumSize);
        setTotalAmountOut(sumTotal);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, container: HTMLDivElement | null) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setTooltipPosition({
            x: rect.left,
            y: e.clientY
        });
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = (isAsks: boolean) => {
        if (isAsks) {
            setAsksSelectedIndex(defaultAsksSelectedIndex);
        } else {
            setBidsSelectedIndex(defaultBidsSelectedIndex);
        }
        setIsTooltipVisible(false);
    };

    const buildPriceLevels = (levels: Order[], orderType: OrderType = OrderType.BIDS) => {
        return levels.map((level: Order, idx) => {
            const isSelected = orderType === OrderType.BIDS
                ? (idx <= bidsSelectedIndex)
                : (idx >= asksSelectedIndex);

            return (
                <div 
                    key={`${idx}-${level.depth}`}
                    className={`relative flex w-full h-6 items-center ${isSelected ? 'bg-gray-200 dark:bg-gray-800/50' : ''}`}
                    onMouseEnter={() => {
                        if (orderType === OrderType.ASKS) {
                            setAsksSelectedIndex(idx);
                            calculateTooltipValues(asks.slice(idx, 100));
                        } else {
                            setBidsSelectedIndex(idx);
                            calculateTooltipValues(bids.slice(0, idx + 1));
                        }
                    }}
                >
                    {!isSelected && (
                        <div className="absolute inset-0" style={{
                            background: orderType === OrderType.ASKS ? 
                                `linear-gradient(to left, rgba(239, 68, 68, 0.1) ${level.depth}%, transparent ${level.depth}%)` :
                                `linear-gradient(to left, rgba(34, 197, 94, 0.1) ${level.depth}%, transparent ${level.depth}%)`
                        }} />
                    )}
                    <div className="grid w-full grid-cols-4 px-2 font-mono text-xs">
                        <div className={
                            orderType === OrderType.ASKS 
                            ? 'text-right text-[#d00] dark:text-red-500' 
                            : 'text-right text-[#090] dark:text-green-500'
                        }>
                            {toFixedFloat(level.price, 2)}
                        </div>
                        <div className="text-right text-[#000] dark:text-gray-100">
                            {Number(level.size).toFixed(2)}
                        </div>
                        <div className="text-right text-[#000] dark:text-gray-100">
                            {level.total > 1000 ? `${(level.total / 1000).toFixed(2)}k` : level.total.toFixed(2)}
                        </div>
                        <div className="flex justify-end gap-0.5">
                            {level.exchangesImgUrls?.map((url, i) => (
                                <img 
                                    key={i} 
                                    src={url} 
                                    alt="exchange"
                                    className="w-4 h-4 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            );
        });
    };

    const renderTooltip = () => {
        if (!isTooltipVisible) return null;

        return (
            <div 
                className="fixed z-50 p-2 text-xs bg-gray-900/90 rounded"
                style={{
                    top: tooltipPosition.y - 50,
                    left: '0',
                    width: '180px',
                }}
            >
                <div className="space-y-1">
                    <div className="flex justify-between text-gray-400">
                        <span>Avg price:</span>
                        <span className="text-white">{toFixedFloat(avgPrice, 2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Total {symbolAssetIn}:</span>
                        <span className="text-white">{toFixedFloat(totalAmountIn, 2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Total {symbolAssetOut}:</span>
                        <span className="text-white">{convertNumberIntoFormat(totalAmountOut)}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (!asks.length || !bids.length) {
        return (
            <div className="h-[600px] flex items-center justify-center bg-white dark:bg-black glass">
                <ThreeDots color="#444" />
            </div>
        );
    }

    return (
        <div className="relative isolate h-[600px] flex flex-col text-[#000] dark:text-white bg-white dark:bg-black glass scrollbar-none">
            <div className="sticky top-0 z-10 bg-white dark:bg-black px-2 py-1 grid grid-cols-4 text-[10px] text-[#000] dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 glass font-semibold">
                <div className="text-center">PRICE</div>
                <div className="text-center">SIZE</div>
                <div className="text-center">TOTAL</div>
                <div className="text-center">EXC</div>
            </div>

            <div 
                ref={asksContainer}
                className="flex-1 h-[250px] overflow-y-auto ai-chat-scrollbar bg-red-50/30 dark:bg-[#1a1212] glass"
                onMouseLeave={() => handleMouseLeave(true)}
                onMouseMove={(e) => handleMouseMove(e, asksContainer.current)}
            >
                {buildPriceLevels(asks, OrderType.ASKS)}
            </div>
            
            <div className="grid grid-cols-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-900 glass">
                <div className="text-[#000] dark:text-gray-400">
                    Last Price: <span className="text-[#000] dark:text-white font-semibold">{Number(lastPrice).toFixed(2)}</span>
                </div>
                <div className="text-right text-[#000] dark:text-gray-400">
                    Spread: <span className="text-[#000] dark:text-white font-semibold">
                        {((asks[0]?.price - bids[0]?.price) / asks[0]?.price * 100).toFixed(2)}%
                    </span>
                </div>
            </div>
            
            <div 
                className="flex-1 h-[250px] overflow-y-auto ai-chat-scrollbar bg-red-50/30 dark:bg-[#1a1212]] glass"
                onMouseLeave={() => handleMouseLeave(false)}
                onMouseMove={(e) => handleMouseMove(e, asksContainer.current)}
            >
                {buildPriceLevels(bids, OrderType.BIDS)}
            </div>
            
            {renderTooltip()}
        </div>
    );
};

export default OrderBook;