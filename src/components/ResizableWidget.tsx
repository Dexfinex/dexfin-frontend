import React, { useRef, useEffect, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AskAnythingWidget } from './widgets/AskAnythingWidget';
import { QuickSwapWidget } from './widgets/QuickSwapWidget';
import { MarketPulseWidget } from './widgets/PriceWidget';
import { MarketNewsWidget } from './widgets/MarketNewsWidget';
import { FearGreedWidget } from './widgets/FearGreedWidget';
import { PortfolioWidget } from './widgets/PortfolioWidget';
import { TrendingWidget } from './widgets/TrendingWidget';
import { PriceConverterWidget } from './widgets/PriceConverterWidget';
import { TwitterWidget } from './widgets/TwitterWidget';
import { DirectMessagesWidget } from './widgets/DirectMessagesWidget';
import { GripVertical, X, RefreshCw } from 'lucide-react';
import {useStore, WidgetSize} from '../store/useStore';
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "react-resizable/css/styles.css"; // Import styles

interface WidgetProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: WidgetSize;
}

const widgetComponents: Record<string, React.FC> = {
  'Portfolio Overview': PortfolioWidget,
  'Ask Anything': AskAnythingWidget,
  'Quick Swap': QuickSwapWidget,
  'Market Pulse': MarketPulseWidget,
  'Market News': MarketNewsWidget,
  'Fear & Greed Index': FearGreedWidget,
  'Trending': TrendingWidget,
  'Price Converter': PriceConverterWidget,
  'Twitter Feed': TwitterWidget,
  'Direct Messages': DirectMessagesWidget,
};

// Define which widgets have been updated with forwardRef
const forwardRefWidgets = [
  'Fear & Greed Index',
  'Trending',
  'Twitter Feed'
];

// Define a type for widgets that have refresh functionality
export interface RefreshableWidget {
  handleRefresh?: () => Promise<void> | void;
  getTweetCount?: () => number;
}

export const ResizableWidget: React.FC<WidgetProps> = ({ id, type, position, size }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const { toggleWidgetVisibility } = useStore();
  const widgetRef = useRef<RefreshableWidget>(null);
  const [tweetCount, setTweetCount] = useState<number>(0);
  
  // Flag to track if component is mounted
  const isMounted = useRef(true);

  // Set up the isMounted ref
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update tweet count periodically
  const updateTweetCount = () => {
    if (type === 'Twitter Feed' && widgetRef.current && widgetRef.current.getTweetCount) {
      const count = widgetRef.current.getTweetCount();
      if (isMounted.current) {
        setTweetCount(count);
      }
    }
  };

  // Set up interval to check tweet count
  useEffect(() => {
    if (type === 'Twitter Feed') {
      // Initial update
      updateTweetCount();
      
      // Set up periodic updates
      const interval = setInterval(updateTweetCount, 1000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [type]);

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  const WidgetComponent = widgetComponents[type];

  // Special case for Ask Anything widget - no header
  const isAskAnything = type === 'Ask Anything';

  // Define which widgets have refresh functionality
  const hasRefreshButton = [
    'Fear & Greed Index',
    'Trending',
    'Twitter Feed',
  ].includes(type);

  // Handle refresh click
  const handleRefreshClick = async () => {
    if (widgetRef.current && widgetRef.current.handleRefresh) {
      await widgetRef.current.handleRefresh();
      
      // Update tweet count after refresh for Twitter widget
      if (type === 'Twitter Feed') {
        // Allow some time for refresh to complete
        setTimeout(updateTweetCount, 500);
      }
    }
  };

  // Ensure width and height are valid numbers
  const width = typeof size.width === 'string' ? parseInt(size.width, 10) : (Number(size.width) || 300);
  const height = typeof size.height === 'string' ? parseInt(size.height, 10) : (Number(size.height) || 200);

  const resizableProps: ResizableBoxProps = {
    width,
    height,
    axis: "x",
    minConstraints: [width, height],
    maxConstraints: [width + 200, height],
    resizeHandles: ["e"],
    handle: (
      <span
        className="resize-handle"
        style={{
          position: "absolute",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "10px",
          height: "100%", // Use 100% instead of a specific value
          cursor: "ew-resize",
        }}
      />
    )
  };

  // Conditionally render the component with or without ref
  const renderWidget = () => {
    // Only pass ref to components that support it
    if (WidgetComponent && forwardRefWidgets.includes(type)) {
      return <WidgetComponent ref={widgetRef} />;
    } else if (WidgetComponent) {
      return <WidgetComponent />;
    } else {
      return (
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      );
    }
  };

  // Prepare tweet count display
  const tweetCountText = type === 'Twitter Feed' ? `${tweetCount} tweets` : '';

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
      className={`widget group ${isAskAnything ? 'border-none bg-transparent' : ''}`}
    >
      <ResizableBox {...resizableProps}>
        <>
          {!isAskAnything && (
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2 cursor-move"
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical className="w-4 h-4 text-white/40" />
                  <span className="font-medium">{type}</span>
                </div>
                
                {type === 'Twitter Feed' && (
                  <span className="text-xs text-white/60 ml-2">
                    {tweetCountText}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {hasRefreshButton && (
                  <button
                    onClick={handleRefreshClick}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Refresh widget"
                  >
                    <RefreshCw className="w-4 h-4 text-white/60" />
                  </button>
                )}
                <button
                  onClick={() => toggleWidgetVisibility(type)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Close widget"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
          )}
          <div className={isAskAnything ? 'h-full' : 'h-[calc(100%-48px)]'}>
            {renderWidget()}
          </div>
        </>
      </ResizableBox>
    </div>
  );
};