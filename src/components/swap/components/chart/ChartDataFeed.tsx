import BigNumber from 'bignumber.js';
import {ChartDataPoint, TokenType} from "../../../../types/swap.type.ts";
import {SOLANA_CHAIN_ID} from "../../../../constants/solana.constants.ts";
import {birdeyeService} from "../../../../services/birdeye.service.ts";
import {coingeckoService} from "../../../../services/coingecko.service.ts";
import {mapResolutionToTimeRange} from "../../../../constants/chart.constants.ts";

interface ConfigurationData {
    supported_resolutions: string[];
    supports_time: boolean;
    supports_marks: boolean;
    supports_timescale_marks: boolean;
}

interface SymbolInfo {
    session: string;
    token: TokenType;
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
    time: number;
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

interface PeriodParams {
    from: number;
    to?: number;
    firstDataRequest?: boolean;
}

const configurationData: ConfigurationData = {
    supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
    supports_time: true,
    supports_marks: false,
    supports_timescale_marks: false
};

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
function to(t: CandleData, o: number): FormattedCandle {
    return {
        time: t.time * 1000,
        close: Number(e$(t.close, o)),
        high: Number(e$(t.high, o)),
        low: Number(e$(t.low, o)),
        open: Number(e$(t.open, o)),
        volume: Number(e$(t.volume, o))
    };
}


const getKlines = async (symbolInfo: SymbolInfo, timeFrom: number, timeTo: number, resolution: string): Promise<FormattedCandle[]> => {
    try {
        const {token} = symbolInfo;
        let chartData: ChartDataPoint[] | null = null
        const timeRange = mapResolutionToTimeRange[resolution]
        if (token) {
            if (token.chainId === SOLANA_CHAIN_ID) {
                chartData = await birdeyeService.getOHLCV(token.address, timeRange, timeFrom, timeTo)
            } else if (token.address.startsWith('0x')) {
                const symbol = await coingeckoService.getCoinGeckoIdFrom(token.address, token.chainId)
                chartData = await coingeckoService.getOHLCV(symbol.toLowerCase(), timeRange, timeFrom, timeTo);
            }
        }

        return chartData?.map(t => to(t, 4)) ?? [];
    } catch (e) {
        return [];
    }
};

export default {
    onReady: (callback: (config: ConfigurationData) => void): void => {
        setTimeout(() => callback(configurationData));
    },

    searchSymbols: async (
    ): Promise<void> => {
    },

    resolveSymbol: async (
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: SymbolInfo) => void,
        onResolveErrorCallback: (error: Error) => void
    ): Promise<void> => {
        try {
            const [
                name,
                address,
                chainId,
                decimals
            ] = symbolName.split(':')

            onSymbolResolvedCallback({
                format: "",
                full_name: "",
                has_no_volume: false,
                has_seconds: false,
                listed_exchange: "",
                ticker: name,
                name: name,
                description: name,
                type: 'crypto',
                session: '24x7',
                timezone: 'Etc/UTC',
                exchange: 'defined',
                token: {
                    name,
                    address,
                    chainId: Number(chainId),
                    decimals: Number(decimals),
                    logoURI: '',
                },
                minmov: 1,
                pricescale: 10 ** 3,
                has_intraday: true,
                has_daily: true,
                has_weekly_and_monthly: false,
                // visible_plots_set: 'ohlcv',
                supported_resolutions: configurationData.supported_resolutions!,
                volume_precision: 8,
                data_status: 'pulsed'
            })
        } catch (e) {
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
            const bars = await getKlines(
                symbolInfo,
                periodParams.from,
                periodParams.to ?? Date.now() / 1000,
                resolution
            );

            // onHistoryCallback(bars, {noData: true})

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (periodParams.from < 0 || bars.length < 1)
                ? onHistoryCallback([], {noData: true})
                : onHistoryCallback(bars, {noData: false});
        } catch (a) {
            console.error(a);
            if (typeof a === "string") {
                onErrorCallback(a);
            }
        }
    },

    subscribeBars: (
/*
        symbolInfo: SymbolInfo,
        resolution: string,
        onRealtimeCallback: (bar: FormattedCandle) => void,
        subscribeUID: string,
        onResetCacheNeededCallback: () => void
*/
    ): void => {
    },

    unsubscribeBars: (/*subscriberUID: string*/): void => {
    },
};