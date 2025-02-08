import {FunctionComponent, useEffect, useState} from 'react';
import {Order} from '../../../../../hooks/useOrionHook'
import { Container } from "./styles";
import { formatNumber } from "../helpers";

interface SpreadProps {
  bids: Order[];
  asks: Order[];
  lastPrice: string;
}

const Spread: FunctionComponent<SpreadProps> = ({ bids, asks , lastPrice}) => {
  const getHighestBid = (bids: Order[]): number => {
    const prices: number[] = bids.map(bid => bid.price);
    return  Math.max.apply(Math, prices);
  }

  const getLowestAsk = (asks: Order[]): number => {
    const prices: number[] = asks.map(ask => ask.price);
    return  Math.min.apply(Math, prices);
  }

  const getSpreadAmount = (bids: Order[], asks: Order[]): number => Math.abs(getHighestBid(bids) - getLowestAsk(asks));

  const getSpreadPercentage = (spread: number, highestBid: number): string => `${(((spread * 100) / highestBid) * -1).toFixed(2)}%`;

  const [spreadAmount, setSpreadAmount] = useState('0');
  const [spreadPercentage, setSpreadPercentage] = useState('0');


  useEffect(() => {
    if (bids && asks) {
      setSpreadAmount(formatNumber(getSpreadAmount(bids, asks)));
      setSpreadPercentage(getSpreadPercentage(getSpreadAmount(bids, asks), getHighestBid(bids)));
    }
  }, [bids, asks]);


  return (
      <Container className="spread-row">
        <div className="last-price">
          <div className="last-price-wrapper">
            <div className="label">Last Price</div>
            <div className="value">{lastPrice}</div>
          </div>
        </div>
        <div className="spread">
          <div className="label">Spread</div>
          <div className="value">{spreadPercentage}</div>
        </div>
      </Container>
  );
};

export default Spread;
