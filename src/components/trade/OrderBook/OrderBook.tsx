import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Order } from '../../../hooks/useOrionHook';
import TitleRow from "./component/TitleRow";
import { Container, TableContainer } from "./styles";
import PriceLevelRow from "./PriceLevelRow";
import { MOBILE_WIDTH } from "../../../constants/mock/tradepairs";
import { ThreeDots } from "react-loader-spinner";
import DepthVisualizer from "./component/DepthVisualizer";
import { PriceLevelRowContainer } from "./styles/PricelevelStyles";
import Spread from "./component/Spread";
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
    // console.log(symbolAssetIn , symbolAssetOut)
    const asksContainer = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const defaultAsksSelectedIndex = 101;
    const defaultBidsSelectedIndex = -1;
    const [asksSelectedIndex, setAsksSelectedIndex] = useState(defaultAsksSelectedIndex);
    const [bidsSelectedIndex, setBidsSelectedIndex] = useState(defaultBidsSelectedIndex);
    const [totalAmountIn, setTotalAmountIn] = useState(0);
    const [totalAmountOut, setTotalAmountOut] = useState(0);
    const [avgPrice, setAvgPrice] = useState(0);

    const windowWidth = window.innerWidth;

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
        const y = e.clientY - rect.top;
        
        setTooltipPosition({
            x: rect.right,
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
                <PriceLevelRowContainer
                    key={`${idx}-${level.depth}`}
                    onMouseEnter={() => {
                        if (orderType === OrderType.ASKS) {
                            setAsksSelectedIndex(idx);
                            calculateTooltipValues(asks.slice(idx, 100));
                        } else {
                            setBidsSelectedIndex(idx);
                            calculateTooltipValues(bids.slice(0, idx + 1));
                        }
                    }}
                    className={`price-level-row-container ${isSelected ? 'selected' : ''}`}
                >
                    {!isSelected && <DepthVisualizer depth={level.depth} orderType={orderType} windowWidth={windowWidth} />}
                    <PriceLevelRow
                        total={level.total.toString()}
                        size={level.size.toString()}
                        price={toFixedFloat(level.price, pricePrecision)}
                        exchangesImgUrls={level.exchangesImgUrls}
                        reversedFieldsOrder={orderType === OrderType.ASKS}
                        isSelected={isSelected}
                        windowWidth={windowWidth}
                    />
                </PriceLevelRowContainer>
            );
        });
    };

    const renderTooltip = () => {
        if (!isTooltipVisible) return null;

        return (
            <div 
                className="tooltip-container" 
                style={{
                    position: 'fixed',
                    top: tooltipPosition.y,
                    // left: "100px",
                    right : "28rem",
                    transform: 'translate(20px, -50%)'
                }}
            >
                <div className="row-item">
                    <div>Avg price</div>
                    <div>{toFixedFloat(avgPrice, pairConfig.pricePrecision)}</div>
                </div>
                <div className="row-item">
                    <div>Total {symbolAssetIn}:</div>
                    <div>{convertNumberIntoFormat(totalAmountIn)}</div>
                </div>
                <div className="row-item">
                    <div>Total {symbolAssetOut}:</div>
                    <div>{convertNumberIntoFormat(totalAmountOut)}</div>
                </div>
            </div>
        );
    };

    if (!asks.length || !bids.length) {
        return (
            <Container className="orderbook-container">
                <div className="flex-center" style={{ height: '100%', minHeight: '400px' }}>
                    <ThreeDots color={'#444'} />
                </div>
            </Container>
        );
    }

    return (
        <Container className="orderbook-container">
            <TableContainer ref={asksContainer}>
                <TitleRow windowWidth={windowWidth} reversedFieldsOrder={true} />
                <div
                    onMouseLeave={() => handleMouseLeave(true)}
                    onMouseMove={(e) => handleMouseMove(e, asksContainer.current)}
                    style={{ cursor: "pointer" }}
                >
                    {buildPriceLevels(asks, OrderType.ASKS)}
                </div>
            </TableContainer>
            
            <TableContainer>
                <Spread bids={bids} asks={asks} lastPrice={lastPrice} />
                <div
                    onMouseLeave={() => handleMouseLeave(false)}
                    onMouseMove={(e) => handleMouseMove(e, asksContainer.current)}
                    style={{ cursor: "pointer" }}
                >
                    {buildPriceLevels(bids, OrderType.BIDS)}
                </div>
            </TableContainer>
            
            {renderTooltip()}
        </Container>
    );
};

export default OrderBook;