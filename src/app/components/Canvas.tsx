"use client";

import React, { useRef, useState, useEffect } from 'react';

interface CanvasProps {
  elements: any[];
  selectedElementId: string | null;
  activeTool: string;
  onElementSelect: (id: string, e: React.MouseEvent) => void;
  onCanvasClick: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElementId,
  activeTool,
  onElementSelect,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      // Zoom
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(0.25, scale + delta), 3);
      setScale(newScale);
    } else if (e.shiftKey) {
      // Pan horizontally with shift+wheel
      e.preventDefault();
      setPosition({
        x: position.x - e.deltaY,
        y: position.y
      });
    } else {
      // Pan vertically with wheel
      e.preventDefault();
      setPosition({
        x: position.x,
        y: position.y - e.deltaY
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start panning if middle mouse button (button 1) is pressed or Alt+left click
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden relative"
      onClick={onCanvasClick}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div 
          ref={canvasRef}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-lg transition-transform duration-100 ease-out"
          style={{ 
            width: '1200px', 
            height: '800px', 
            position: 'relative',
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
            backgroundImage: showGrid ? `
              linear-gradient(to right, rgba(128, 128, 128, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
            ` : 'none',
            backgroundSize: '20px 20px'
          }}
        >
          {elements.map(element => (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                backgroundColor: element.style.backgroundColor,
                borderRadius: element.style.borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeTool === 'select' ? 'move' : 'default',
                border: '1px solid',
                borderColor: selectedElementId === element.id ? '#3b82f6' : 'rgba(0,0,0,0.1)',
                boxShadow: selectedElementId === element.id 
                  ? '0 0 0 2px rgba(59, 130, 246, 0.5), 0 4px 10px rgba(0, 0, 0, 0.1)' 
                  : 'none',
                fontSize: element.style.fontSize,
                color: element.style.color,
                fontWeight: element.style.fontWeight,
                userSelect: 'none',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                transform: selectedElementId === element.id ? 'scale(1.005)' : 'scale(1)'
              }}
              onClick={(e) => onElementSelect(element.id, e)}
            >
              {element.type === 'text' && element.text}
              {element.type === 'image' && element.text}
              {element.type === 'rectangle' && element.text && element.text}
            </div>
          ))}
        </div>
      </div>
      
      {/* Canvas controls */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 flex gap-3 animate-fade-in transition-all">
        <button 
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setScale(Math.min(scale + 0.1, 3))}
          title="Zoom In"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
        <div className="px-2 flex items-center font-mono text-sm">{Math.round(scale * 100)}%</div>
        <button 
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setScale(Math.max(0.25, scale - 0.1))}
          title="Zoom Out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-0.5"></div>
        <button 
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
          title="Reset View"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <button 
          className={`p-1.5 rounded-md transition-colors ${showGrid ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          onClick={() => setShowGrid(!showGrid)}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />
          </svg>
        </button>
      </div>
      
      {/* Canvas info */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg px-3 py-2 text-xs text-gray-500 dark:text-gray-400 backdrop-blur-sm animate-fade-in">
        {elements.length} element{elements.length !== 1 ? 's' : ''} • Canvas: 1200 x 800px
      </div>
    </div>
  );
};

export default Canvas;
