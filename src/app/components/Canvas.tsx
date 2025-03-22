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

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      // Zoom
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(0.5, scale + delta), 2);
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
    // Start panning if middle mouse button (button 1) is pressed
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
      className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden"
      onClick={onCanvasClick}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div 
          ref={canvasRef}
          className="bg-white dark:bg-gray-800 shadow-lg"
          style={{ 
            width: '1200px', 
            height: '800px', 
            position: 'relative',
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center'
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
                borderColor: selectedElementId === element.id ? '#3b82f6' : 'transparent',
                boxShadow: selectedElementId === element.id ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                fontSize: element.style.fontSize,
                color: element.style.color,
                fontWeight: element.style.fontWeight,
                userSelect: 'none'
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
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-md shadow-md px-3 py-2 flex gap-2">
        <button 
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setScale(scale + 0.1)}
        >
          +
        </button>
        <div className="px-2 flex items-center">{Math.round(scale * 100)}%</div>
        <button 
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
        >
          -
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Canvas;
