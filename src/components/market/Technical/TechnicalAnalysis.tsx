import React, { useEffect, useState } from "react";
import ChartLibrary from "./ChartLibrary";

export const TechnicalAnalysis: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Initial theme detection
    const detectTheme = () => {
      const themeAttribute = document.body.getAttribute('data-theme');
      setCurrentTheme(themeAttribute === 'dark' ? 'dark' : 'light');
    };

    // Set initial theme
    detectTheme();

    // Create observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          detectTheme();
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      <ChartLibrary currentTheme={currentTheme} />
    </div>
  );
};
export default TechnicalAnalysis;
