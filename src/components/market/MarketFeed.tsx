import React, { useState, useEffect, useRef } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { NewsWidget } from '../widgets/NewsWidget';
import { TwitterWidget } from '../widgets/TwitterWidget';
import { TrendingWidget } from '../widgets/TrendingWidget';
import { TransactionWidget } from '../widgets/TransactionWidget';
import { AddWidgetModal } from './AddWidgetModal';

interface Widget {
  id: string;
  type: 'News' | 'Twitter' | 'Trending' | 'Whale Transactions';
  position: { x: number; y: number };
}

interface DraggableWidgetProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  onRemove: (id: string) => void;
  isGridMode: boolean;
  children: React.ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  type,
  position,
  onRemove,
  isGridMode,
  children
}) => {
  // Only enable dragging in desktop free-positioning mode
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isGridMode,
  });

  // Style based on mode
  const style = !isGridMode ? (transform ? {
    transform: CSS.Transform.toString(transform),
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: 400,
    zIndex: 50
  } : {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: 400
  }) : {};

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className="bg-white/5 rounded-xl"
    >
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div
          className={`flex items-center gap-2 ${!isGridMode ? 'cursor-move' : ''}`}
          {...(!isGridMode ? attributes : {})}
          {...(!isGridMode ? listeners : {})}
        >
          {!isGridMode && <GripVertical className="w-4 h-4 text-white/40" />}
          <span className="font-medium">{type}</span>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      </div>
      <div className="max-h-[500px] overflow-y-auto ai-chat-scrollbar">
        {children}
      </div>
    </div>
  );
};

export const MarketFeed: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if we're on mobile or desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkMobile);
    checkMobile(); // Initial check

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get default position based on widget type
  const getDefaultPosition = (type: 'News' | 'Twitter' | 'Trending' | 'Whale Transactions') => {
    switch (type) {
      case 'News':
        return { x: 20, y: 20 };
      case 'Twitter':
        return { x: 430, y: 20 };
      case 'Trending':
        return { x: 840, y: 20 };
      case 'Whale Transactions':
        return { x: 1250, y: 20 };
      default:
        return { x: 20, y: 20 };
    }
  };

  const addWidget = (type: 'News' | 'Twitter' | 'Trending' | 'Whale Transactions') => {
    const position = getDefaultPosition(type);
    
    const newWidget: Widget = {
      id: Math.random().toString(36).substring(7),
      type,
      position
    };
    
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const widget = widgets.find(w => w.id === active.id);

    if (widget) {
      setWidgets(prev => prev.map(w =>
        w.id === active.id ? {
          ...w,
          position: {
            x: w.position.x + delta.x,
            y: w.position.y + delta.y,
          }
        } : w
      ));
    }
  };

  const getWidgetComponent = (type: string) => {
    switch (type) {
      case 'News': return <NewsWidget />;
      case 'Twitter': return <TwitterWidget />;
      case 'Trending': return <TrendingWidget />;
      case 'Whale Transactions': return <TransactionWidget />;
      default: return null;
    }
  };

  // Render widgets based on device
  const renderWidgets = () => {
    if (isMobile) {
      // Mobile vertical stack layout
      return (
        <div className="flex flex-col space-y-4">
          {widgets.map(widget => (
            <DraggableWidget
              key={widget.id}
              id={widget.id}
              type={widget.type}
              position={widget.position}
              onRemove={removeWidget}
              isGridMode={true}
            >
              {getWidgetComponent(widget.type)}
            </DraggableWidget>
          ))}
        </div>
      );
    } else {
      // Desktop draggable layout with fixed positions
      return (
        <DndContext onDragEnd={handleDragEnd}>
          {widgets.map(widget => (
            <DraggableWidget
              key={widget.id}
              id={widget.id}
              type={widget.type}
              position={widget.position}
              onRemove={removeWidget}
              isGridMode={false}
            >
              {getWidgetComponent(widget.type)}
            </DraggableWidget>
          ))}
        </DndContext>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowAddWidget(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative ${!isMobile ? 'h-[calc(100vh-200px)]' : ''} overflow-auto overflow-x-scroll ai-chat-scrollbar`}
      >
        {renderWidgets()}
      </div>

      <AddWidgetModal
        isOpen={showAddWidget}
        onClose={() => setShowAddWidget(false)}
        onAdd={addWidget}
      />
    </div>
  );
};