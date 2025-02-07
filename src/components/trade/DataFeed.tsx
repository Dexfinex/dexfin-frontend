import BigNumber from 'bignumber.js';
import { Orion } from "./OrionProtocol";
import { simpleFetch } from "simple-typed-fetch";

interface ConfigurationData {
    supported_resolutions: string[];
    supports_time: boolean;
    supports_marks: boolean;
    supports_timescale_marks: boolean;
}

interface SymbolInfo {
    session: string;
    exchange: string;
    listed_exchange: string;
    timezone: string;
    minmov: number;
    pricescale: number;
    has_intraday: boolean;
    supported_resolutions: string[];
    has_seconds: boolean;
    has_daily: boolean;
    has_weekly_and_monthly: boolean;
    has_no_volume: boolean;
    data_status: string;
    volume_precision: number;
    name: string;
    full_name: string;
    description: string;
    type: string;
    format: string;
    ticker?: string;
}

interface CandleData {
    timeStart: number;
    close: string | number;
    high: string | number;
    low: string | number;
    open: string | number;
    volume: string | number;
}

interface FormattedCandle {
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
    volume: number;
}

interface PairConfig {
    pricePrecision: number;
}

interface PeriodParams {
    from: number;
    to?: number;
    firstDataRequest?: boolean;
}

type ResolutionMapping = {
    [key: string]: string;
};

let unit = (new Orion()).getUnit("eth");
const unsubscribeMapping: { [key: string]: (() => void) | undefined } = {};
let pairConfig: PairConfig = { pricePrecision: 0 };

const configurationData: ConfigurationData = {
    supported_resolutions: ["5", "15", "30", "60", "240", "1D", "1W"],
    supports_time: true,
    supports_marks: false,
    supports_timescale_marks: false
};

const Pn: ResolutionMapping = {
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "60": "1h",
    "240": "4h",
    "1D": "1d",
    "1W": "1w"
};

const dn: boolean = !(typeof window === "undefined" || !window.navigator || !window.navigator.userAgent) && 
    window.navigator.userAgent.includes("CriOS");

const Lo: string[] = ["5", "15", "30", "60", "240", "1D", "1W"];

const Xt: Partial<SymbolInfo> = {
    session: "24x7",
    exchange: "DEX",
    listed_exchange: "DEX",
    timezone: "Europe/London",
    minmov: 1,
    has_intraday: true,
    supported_resolutions: Lo,
    has_seconds: false,
    has_daily: true,
    has_weekly_and_monthly: true,
    has_no_volume: false,
    data_status: "pulsed"
};

class lt {
    static async get(o: string, s: string, r: number): Promise<SymbolInfo> {
        const [c, d] = o.split("-");
        return !c || !d ? lt._createPairSymbolInfo(o, s, r) : lt._createSymbolInfo(c, d, s, r);
    }

    static async _createSymbolInfo(o: string, s: string, r: string, c: number): Promise<SymbolInfo> {
        const d = `${o}-${s}`;
        const a = `${o}/${s}`;
        return {
            ...Xt as SymbolInfo,
            pricescale: 10 ** c,
            volume_precision: 8,
            exchange: r,
            name: a,
            full_name: a,
            description: a,
            type: "futures",
            format: "price",
            ticker: d
        };
    }

    static async _createPairSymbolInfo(o: string, s: string, r: number): Promise<SymbolInfo> {
        const c = o;
        const d = o;
        return {
            ...Xt as SymbolInfo,
            pricescale: 10 ** r,
            volume_precision: 8,
            exchange: s,
            name: d,
            full_name: d,
            description: d,
            type: "futures",
            format: "price",
            ticker: c
        };
    }
}

function to(t: CandleData, o: number): FormattedCandle {
    return {
        time: t.timeStart * 1000,
        close: Number(e$(t.close, o)),
        high: Number(e$(t.high, o)),
        low: Number(e$(t.low, o)),
        open: Number(e$(t.open, o)),
        volume: Number(e$(t.volume, o))
    };
}

function e$(o: string | number, t: number, s: boolean = false): string {
    const e = new BigNumber(o);
    if (e.isNaN()) return "Unknown";
    
    const r = e.toFixed(t, 2);
    let n = "";
    if (s && !e.isZero() && Number(r) === 0) {
        n = "~";
    }
    return `${n}${r}`;
}

function lastCandleSubscribe(v: string, f: string, b: (data: CandleData) => void): () => void {
    const C = Pn[f];
    if (C === undefined) {
        throw Error(`Unallowed candle resolution ${f}`);
    }
    
    const { unsubscribe: A } = unit.priceFeed.ws.subscribe("candle", {
        payload: `${C}/${v}`,
        callback: (L: CandleData) => b(L)
    });
    
    return A;
}

const getKlines = async (o: SymbolInfo, s: number, r: number, c: string): Promise<FormattedCandle[]> => {
    try {
        const { exchange: d, ticker: a } = o;
        const response = await simpleFetch(unit.priceFeed.getCandles)(a, s, r, hn(c));
        return response.candles.map(t => to(t, pairConfig.pricePrecision));
    } catch(e) {
        return [];
    }
};

const hn = (t: string): string => {
    const [o, s] = t.split(/(\D)/);
    const r = Number(o);
    const c = r >= 60 ? `${Math.floor(r / 60)}h` : `${r}m`;
    return s ? t.toLowerCase() : c;
};

export default {
    onReady: (callback: (config: ConfigurationData) => void): void => {
        console.log("[onReady]: Method call");
        setTimeout(() => callback(configurationData));
    },

    searchSymbols: async (
        userInput: string,
        exchange: string,
        symbolType: string,
        onResultReadyCallback: (symbols: SymbolInfo[]) => void
    ): Promise<void> => {
        console.log("[searchSymbols]: Method call");
    },

    resolveSymbol: async (
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: SymbolInfo) => void,
        onResolveErrorCallback: (error: Error) => void
    ): Promise<void> => {
        try {
            if ((window as any).savedPairsMap) {
                let networks = (window as any).savedPairsMap[symbolName];
                if (networks && networks.length > 0) {
                    unit = (new Orion()).getUnit(networks[0]);
                }
            }

            pairConfig = await simpleFetch(unit.aggregator.getPairConfig)(symbolName);
            
            lt.get(symbolName, 'all', pairConfig.pricePrecision)
                .then(onSymbolResolvedCallback)
                .catch(onResolveErrorCallback);
        } catch(e) {
            onResolveErrorCallback(e as Error);
        }
    },

    getBars: async (
        symbolInfo: SymbolInfo,
        resolution: string,
        periodParams: PeriodParams,
        onHistoryCallback: (bars: FormattedCandle[], meta: { noData?: boolean }) => void,
        onErrorCallback: (error: string) => void
    ): Promise<void> => {
        try {
            const a = await getKlines(
                symbolInfo, 
                periodParams.from, 
                periodParams.to ?? Date.now() / 1000, 
                resolution
            );
            
            periodParams.from < 0 
                ? onHistoryCallback([], { noData: true }) 
                : onHistoryCallback(a, { noData: false });
        } catch (a) {
            console.error(a);
            if (typeof a === "string") {
                onErrorCallback(a);
            }
        }
    },

    subscribeBars: (
        symbolInfo: SymbolInfo,
        resolution: string,
        onRealtimeCallback: (bar: FormattedCandle) => void,
        subscribeUID: string,
        onResetCacheNeededCallback: () => void
    ): void => {
        console.log("[subscribeBars]: Method call with subscribeUID:", subscribeUID);

        unsubscribeMapping[subscribeUID] = lastCandleSubscribe(
            symbolInfo.ticker !== undefined ? symbolInfo.ticker : symbolInfo.name,
            resolution,
            (a: CandleData) => onRealtimeCallback(to(a, pairConfig.pricePrecision))
        );
    },

    unsubscribeBars: (subscriberUID: string): void => {
        console.log("[unsubscribeBars]: Method call with subscriberUID:", subscriberUID);
        unsubscribeMapping[subscriberUID]?.();
    },
};