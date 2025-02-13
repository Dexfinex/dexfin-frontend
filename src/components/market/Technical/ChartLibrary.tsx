import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  theme?: 'light' | 'dark';
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ theme = 'dark' }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up previous widget if it exists
    if (container.current) {
      container.current.innerHTML = '';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BITSTAMP:ETHUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      withdateranges: true,
      allow_symbol_change: true,
      details: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    container.current?.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [theme]); // Re-run effect when theme changes

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default memo(TradingViewWidget);
