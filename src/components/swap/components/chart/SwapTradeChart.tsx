import {useEffect, useRef, useState} from "react";
import Datafeeds from "./ChartDataFeed";
import {ChartType, TimeRange} from "../../../../types/swap.type.ts";
import {useStore} from "../../../../store/useStore.ts";
import {IChartingLibraryWidget} from "../../../../../public/charting_library";
import {mapTimeRangeToResolution} from "../../../../constants/chart.constants.ts";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        TradingView?: {
            widget: new (config: WidgetConfig) => IChartingLibraryWidget;
        };
    }
}

interface WidgetConfig {
    autosize: boolean;
    toolbar_bg: string;
    symbol: string;
    interval: string;
    fullscreen: boolean;
    container: string;
    datafeed: any;
    library_path: string;
    custom_css_url: string;
    theme: "light" | "dark";
    charts_storage_url: string;
    disabled_features: string[];
    enabled_features: string[];
    overrides: {
        [key: string]: string | number | boolean;
    };
    time_scale: {
        [key: string]: string | number | boolean;
    };
    loading_screen: {
        backgroundColor: string;
        foregroundColor: string;
    };
}
interface TradeChartProps {
    tokenSymbol: string;
    timeRange: TimeRange;
    type: ChartType;
}

const SwapTradeChart: React.FC<TradeChartProps> = ({tokenSymbol, timeRange, type}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const { theme } = useStore();
    const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);

    console.log("timeRange", timeRange)

    useEffect(() => {
        if (!window.TradingView) {
            return;
        }

        try {
            console.log("created new widget", mapTimeRangeToResolution[timeRange])
            const widgetOptions: WidgetConfig = {
                autosize: true,
                toolbar_bg: theme === 'dark' ? '#101112' : '#ffffff',
                symbol: tokenSymbol,
                interval: mapTimeRangeToResolution[timeRange],
                fullscreen: false,
                container: "tv_chart_container",
                datafeed: Datafeeds,
                library_path: "/charting_library/",
                custom_css_url: theme === 'dark'
                    ? 'https://assets.staticimg.com/trade-web/4.2.28/charting_library_24/custom.css'
                    : 'https://assets.staticimg.com/trade-web/4.2.28/charting_library_24/custom_light.css',
                theme: theme,
                charts_storage_url: 'https://saveload.tradingview.com',
                disabled_features: [
                    "left_toolbar",
                    "timeframes_toolbar",
                    'volume_force_overlay',
                    'timeframes_toolbar',
                    'go_to_date',
                    'header_symbol_search',
                    'header_compare',
                    'header_undo_redo',
                    'control_bar',
                    'display_market_status',
                    'show_hide_button_in_legend',
                    'header_chart_type',
                    'legend_context_menu',
                    'use_localstorage_for_settings',
                    'symbol_info',
                    'symbol_info_long_description',
                    'context_menus',
                    'edit_buttons_in_legend',
                    'header_widget',
                ],
                enabled_features: ["study_templates"],
                overrides: {
                    // Background and Grid
                    "paneProperties.backgroundType": "solid",
                    "paneProperties.background": theme === 'dark' ? '#101112' : '#ffffff',
                    "paneProperties.vertGridProperties.color": theme === 'dark' ? '#101112' : '#e1e3eb',
                    "paneProperties.horzGridProperties.color": theme === 'dark' ? '#101112' : '#e1e3eb',

                    // Scales and Text
                    "scalesProperties.backgroundColor": theme === 'dark' ? '#101112' : '#ffffff',
                    "scalesProperties.lineColor": theme === 'dark' ? '#363c4e' : '#e1e3eb',
                    "scalesProperties.textColor": theme === 'dark' ? '#B2B5BE' : '#101112',

                    // Candle Colors - Keep consistent regardless of theme
                    "mainSeriesProperties.candleStyle.upColor": "#26a69a",
                    "mainSeriesProperties.candleStyle.downColor": "#ef5350",
                    "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",

                    // Additional UI Elements
                    "symbolWatermarkProperties.color": theme === 'dark' ? '#363c4e' : '#e1e3eb',
                    "chartProperties.background": theme === 'dark' ? '#101112' : '#ffffff',
                    "chartProperties.lineColor": theme === 'dark' ? '#363c4e' : '#e1e3eb',
                    "chartProperties.textColor": theme === 'dark' ? '#B2B5BE' : '#101112',

                    // Navigation Buttons and Toolbar
                    "toolbarBg": theme === 'dark' ? '#101112' : '#ffffff',
                    "toolbarIconColor": theme === 'dark' ? '#B2B5BE' : '#101112',
                    "toolbarIconHoverBg": theme === 'dark' ? '#363c4e' : '#e1e3eb',

                    // Left Toolbar Specific
                    "paneProperties.leftAxisProperties.background": theme === 'dark' ? '#101112' : '#ffffff',
                    "paneProperties.leftAxisProperties.textColor": theme === 'dark' ? '#B2B5BE' : '#101112',
                    "paneProperties.legendProperties.background": theme === 'dark' ? '#101112' : '#ffffff',
                    "paneProperties.legendProperties.textColor": theme === 'dark' ? '#B2B5BE' : '#101112'
                },
                loading_screen: {
                    backgroundColor: theme === 'dark' ? '#101112' : '#ffffff',
                    foregroundColor: theme === 'dark' ? '#363c4e' : '#e1e3eb'
                },
                time_scale: {
                    min_bar_spacing: 20,
                },
            };

            const tvWidget_ = new window.TradingView.widget(widgetOptions);
            setTvWidget(tvWidget_);

            return () => {
                if (tvWidget) {
                    tvWidget.remove();
                }
            };
        } catch (error) {
            console.error('Error initializing TradingView widget:', error);
        }
    }, [tokenSymbol, theme, timeRange]);

    useEffect(() => {
        if (tokenSymbol && tvWidget) {
            try {
                tvWidget.setSymbol(
                    tokenSymbol,
                    tvWidget.symbolInterval()?.interval,
                    () => null
                );
            } catch (error) {
                console.error('Error setting symbol:', error);
            }
        }
    }, [tokenSymbol, tvWidget]);

    // switching line and ohlcv chart
    useEffect(() => {
        if (tvWidget) {
            tvWidget?.applyOverrides({
                'mainSeriesProperties.style': type === 'line' ? 2 : 1, // 1 for OHLCV, 2 for Line Chart
            });
        }
    }, [type, tvWidget])


    return (
        <div
            id="tv_chart_container"
            ref={chartContainerRef}
            className="w-full h-full"
        />
    );
};

export default SwapTradeChart;