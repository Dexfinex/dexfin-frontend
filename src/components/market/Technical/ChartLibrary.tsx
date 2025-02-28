import { useEffect, useRef } from 'react';

interface ChartLibraryProps {
  currentTheme: 'light' | 'dark';
  onLoad?: () => void;
}

const ChartLibrary: React.FC<ChartLibraryProps> = ({ currentTheme }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    const widgetConfig = {
      autosize: true,
      symbol: "BITSTAMP:ETHUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: currentTheme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_top_toolbar: false,
      allow_symbol_change: true,
      details: true,
      calendar: false,
      hide_side_toolbar: true,
      withdateranges: true,
      container_id: "tradingview_chart",
      disabled_features: [
        "left_toolbar",
        "header_fullscreen_button",
        "timeframes_toolbar",
        "volume_force_overlay",
        "show_logo_on_all_charts",
        "header_screenshot"
      ],
      enabled_features: [
        "hide_left_toolbar_by_default"
      ],
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
        "paneProperties.background": currentTheme === 'dark' ? '#000000' : '#ffffff',
        "paneProperties.vertGridProperties.color": currentTheme === 'dark' ? '#363c4e' : '#e1e3eb',
        "paneProperties.horzGridProperties.color": currentTheme === 'dark' ? '#363c4e' : '#e1e3eb'
      }
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [currentTheme]);

  return (
    <div 
      id="tradingview_chart"
      ref={containerRef}
      className="w-full h-full"
    />
  );
};

export default ChartLibrary;