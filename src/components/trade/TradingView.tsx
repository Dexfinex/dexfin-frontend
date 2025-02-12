import { useEffect, useRef, useState } from "react";
import Datafeeds from "./DataFeed";
import { useStore } from "../../store/useStore";
declare global {
    interface Window {
        TradingView?: {
            widget: new (config: WidgetConfig) => TradingViewWidget;
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
    loading_screen: {
        backgroundColor: string;
        foregroundColor: string;
    };
}

interface TradingViewWidget {
    onChartReady(callback: () => void): void;
    headerReady(): Promise<void>;
    createButton(): HTMLElement;
    showNoticeDialog(params: { 
        title: string; 
        body: string; 
        callback: () => void; 
    }): void;
    remove(): void;
    setSymbol(
        symbol: string, 
        interval: string | undefined, 
        callback: () => void
    ): void;
    symbolInterval(): { interval: string } | null;
}

interface TradeChartProps {
    pairSymbol: string;
    theme: 'dark' | 'light';
}

const TradeChart: React.FC<TradeChartProps> = ({ pairSymbol,theme }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [tvWidget, setTvWidget] = useState<TradingViewWidget | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Load TradingView script
    useEffect(() => {
        const loadScript = async () => {
            if (!window.TradingView) {
                const script = document.createElement('script');
                script.id = 'tradingview-widget-script';
                script.src = '/charting_library/charting_library.js';
                script.type = 'text/javascript';
                script.async = true;
                
                script.onload = () => {
                    setIsScriptLoaded(true);
                };

                script.onerror = (error) => {
                    console.error('Error loading TradingView script:', error);
                };

                document.head.appendChild(script);
                return () => {
                    const existingScript = document.getElementById('tradingview-widget-script');
                    if (existingScript) {
                        document.head.removeChild(existingScript);
                    }
                };
            } else {
                setIsScriptLoaded(true);
                return () => {};
            }
        };

        loadScript();
    }, []);

    // Initialize widget
    useEffect(() => {
        if (!isScriptLoaded || !window.TradingView) {
            return;
        }

        try {
            const widgetOptions: WidgetConfig = {
                autosize: true,
                toolbar_bg: '#000',
                symbol: pairSymbol,
                interval: "1D",
                fullscreen: false,
                container: "tv_chart_container",
                datafeed: Datafeeds,
                library_path: "/charting_library/",
                // custom_css_url: 'https://assets.staticimg.com/trade-web/4.2.28/charting_library_24/custom.css',
                custom_css_url: theme === 'dark'
                    ? 'https://assets.staticimg.com/trade-web/4.2.28/charting_library_24/custom.css'
                    : 'https://assets.staticimg.com/trade-web/4.2.28/charting_library_24/custom_light.css',
                
                theme: theme,
                charts_storage_url: 'https://saveload.tradingview.com',
                disabled_features: [
                    "volume_force_overlay",
                    "timeframes_toolbar",
                    "go_to_date",
                    'header_symbol_search',
                    'header_compare',
                    'header_undo_redo',
                    'control_bar',
                    'display_market_status',
                    'show_hide_button_in_legend',
                    'edit_buttons_in_legend',
                    'header_chart_type',
                    'volume_force_overlay',
                    'legend_context_menu',
                    'use_localstorage_for_settings'
                ],
                enabled_features: ["study_templates"],
                overrides: {
                    "paneProperties.backgroundType": "solid",
                    // "paneProperties.background": "#000",
                    "paneProperties.background": theme === 'dark' ? '#000000' : '#ffffff',
                    "paneProperties.vertGridProperties.color": theme === 'dark' ? '#363c4e' : '#e1e3eb',
                    "paneProperties.horzGridProperties.color": theme === 'dark' ? '#363c4e' : '#e1e3eb',
                    "scalesProperties.backgroundColor": theme === 'dark' ? '#000000' : '#ffffff',
                    "scalesProperties.lineColor": theme === 'dark' ? '#363c4e' : '#e1e3eb',
                    "scalesProperties.textColor": theme === 'dark' ? '#B2B5BE' : '#000000',
                    "mainSeriesProperties.candleStyle.upColor": "#26a69a",
                    "mainSeriesProperties.candleStyle.downColor": "#ef5350",
                    "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350"

                },
                loading_screen: {
                    // backgroundColor: "#000",
                    // foregroundColor: "#000"
                    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                    foregroundColor: theme === 'dark' ? '#363c4e' : '#e1e3eb'
                }
            };

            const tvWidget_ = new window.TradingView.widget(widgetOptions);
            // setTvWidget(tvWidget_);
            tvWidget_.onChartReady(() => {
                console.log('Chart is ready');
            });

            setTvWidget(tvWidget_);

            return () => {
                if (tvWidget) {
                    tvWidget.remove();
                }
            };
        } catch (error) {
            console.error('Error initializing TradingView widget:', error);
        }
    }, [isScriptLoaded, pairSymbol]);

    // Handle symbol changes
    useEffect(() => {
        if (pairSymbol && tvWidget) {
            try {
                tvWidget.setSymbol(
                    pairSymbol, 
                    tvWidget.symbolInterval()?.interval, 
                    () => null
                );
            } catch (error) {
                console.error('Error setting symbol:', error);
            }
        }
    }, [pairSymbol, tvWidget]);

    return (
        <div
            id="tv_chart_container"
            ref={chartContainerRef}
            className="w-full h-full trade-chart-container"
            style={{
                backgroundColor: theme === 'dark' ? '#131722' : '#ffffff'
            }}
        />
    );
};

export default TradeChart;

