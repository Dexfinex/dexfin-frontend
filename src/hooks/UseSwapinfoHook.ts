import {useEffect, useState} from "react";
import {simpleFetch} from "simple-typed-fetch";
import {getRealExchangeDescription} from "../utils/trade.util";
import {unit} from "../components/TradingViewModal";

let swapRequestId;

export const useSwapInfoHook = (
    pairSymbol,
    swapType, // 'buy' or 'sell'
    amount
    ) => {

    const [swapInfo, setSwapInfo] = useState(null);
    const [gasWei, setGasWei] = useState(0);
    const [tradeProfits, setTradeProfits] = useState([]);

    useEffect(() => {
        (async() => {
            if (unit) {
                // const _gasPrice = await unit.provider.getGasPrice();
                const _gasPriceResponse = await unit.blockchainService.getGasPriceWei();
                if (_gasPriceResponse) {
                    // @ts-ignore
                    console.log("_gasPrice", _gasPriceResponse.value.data);
                    // @ts-ignore
                    setGasWei(Number(_gasPriceResponse.value.data));
                }
            }
        })();
    }, [unit]);

    useEffect(() => {

        const unsubscribeFunction = () => {
            unit.aggregator.ws.unsubscribe(swapRequestId);
        };

        if (!amount) {
            setSwapInfo(null);
        }

        console.log("swapInfo subscribe", amount);
        const symbols = pairSymbol.split('-');
        swapRequestId = unit.aggregator.ws.subscribe(
            "ss", // SWAP_SUBSCRIBE
            {
                payload: {
                    i: swapType === 'buy' ? symbols[1] : symbols[0], // asset in
                    o: swapType === 'buy' ? symbols[0] : symbols[1], // asset out
                    e: swapType === 'buy' ? false : true, // true when type of swap is exactSpend, can be omitted (true by default)
                    a: amount, // amount
                },
                // Handle data update in your way
                callback: (info) => {
                    // console.log("SWAPINFO", info);
                    console.log("swapInfo callback", info);
                    setSwapInfo(info);
                    // if (info.poolOptimal) // don't need to update frequently if pooloptimal is true
                        unsubscribeFunction();
                },
            }
        );

        (async() => {
            try {
                const tradeProfits = await simpleFetch(unit.aggregator.getTradeProfits)(pairSymbol, amount, swapType);
                // console.log("tradeProfits", tradeProfits);
                setTradeProfits(Object.keys(tradeProfits).map(exchangeKey => {
                    return {
                        exchange: getRealExchangeDescription(exchangeKey),
                        ... tradeProfits[exchangeKey]
                    }
                }));
            } catch(e) {
                setTradeProfits([]);
            }
        })()

        return unsubscribeFunction;

    }, [pairSymbol, swapType, amount]);


    return {
        swapInfo,
        gasWei,
        tradeProfits,
    }

}
