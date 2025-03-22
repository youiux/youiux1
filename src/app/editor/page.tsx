"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Editor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [elements, setElements] = useState<any[]>([]);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  
  const connectWallet = async () => {
    // Mock implementation - would use actual web3 libraries in production
    try {
      console.log("Connecting wallet...");
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setWalletConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  const addElement = (type: string) => {
    const newElement = {
      id: `element-${elements.length + 1}`,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      text: type === 'text' ? 'Double click to edit' : '',
      style: {
        backgroundColor: type === 'text' ? 'transparent' : '#e0e0e0',
        borderRadius: type === 'ellipse' ? '50%' : '0',
      }
    };
    
    setElements([...elements, newElement]);
  };
  
  const generateWithAI = async () => {
    // Mock AI implementation
    console.log("Generating design with AI...");
    // Add some mock elements after a delay
    setTimeout(() => {
      const aiElements = [
        {
          id: `ai-element-1`,
          type: 'rectangle',
          x: 50,
          y: 50,
          width: 300,
          height: 200,
          style: { backgroundColor: '#f0f9ff', borderRadius: '8px' }
        },
        {
          id: `ai-element-2`,
          type: 'text',
          x: 100,
          y: 120,
          width: 200,
          height: 50,
          text: 'AI Generated Layout',
          style: { fontSize: '18px', fontWeight: 'bold' }
        }
      ];
      setElements([...elements, ...aiElements]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top navigation */}
      <header className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="YouiUX Logo"
              width={24}
              height={24}
              className="dark:invert"
            />
            <span className="font-bold">YouiUX</span>
          </Link>
          <span className="text-gray-400">|</span>
          <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">File</button>
          <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">Edit</button>
          <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">View</button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={generateWithAI}
            className="text-sm px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded flex items-center gap-1"
          >
            <span>AI Generate</span>
          </button>
          
          <button 
            onClick={connectWallet}
            className={`text-sm px-3 py-1.5 rounded flex items-center gap-1 ${
              walletConnected 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
          </button>
          
          <button className="text-sm px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded">
            Share
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tools */}
        <div className="w-14 border-r flex flex-col items-center py-3 gap-3">
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded ${activeTool === 'select' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7 7m0 0v-6m0 6h-6" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('rectangle');
              addElement('rectangle');
            }}
            className={`p-2 rounded ${activeTool === 'rectangle' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('ellipse');
              addElement('ellipse');
            }}
            className={`p-2 rounded ${activeTool === 'ellipse' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('text');
              addElement('text');
            }}
            className={`p-2 rounded ${activeTool === 'text' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="border-t w-8 my-2"></div>
          
          <button className="p-2 rounded" title="Export as NFT">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </button>
        </div>
        
        {/* Main canvas area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto flex items-center justify-center">
          <div 
            ref={canvasRef}
            className="bg-white dark:bg-gray-800 shadow-lg"
            style={{ width: '1200px', height: '800px', position: 'relative' }}
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
                  cursor: 'move',
                  border: '1px solid transparent',
                  borderColor: activeTool === 'select' ? '#3b82f6' : 'transparent'
                }}
              >
                {element.type === 'text' && element.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right sidebar - Properties */}
        <div className="w-64 border-l p-4 overflow-y-auto">
          <h3 className="font-bold mb-3">Properties</h3>
          
          {activeTool === 'select' && elements.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">X</label>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" defaultValue="100" />
                  </div>
                  <div>
                    <label className="text-xs">Y</label>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" defaultValue="100" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Width</label>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" defaultValue="200" />
                  </div>
                  <div>
                    <label className="text-xs">Height</label>
                    <input type="number" className="w-full border rounded px-2 py-1 text-sm" defaultValue="100" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Style</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs">Background</label>
                    <input type="color" className="w-full border rounded h-8" defaultValue="#e0e0e0" />
                  </div>
                  <div>
                    <label className="text-xs">Border Radius</label>
                    <input type="range" className="w-full" min="0" max="50" defaultValue="0" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <button className="w-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 py-1 rounded text-sm">
                  Delete Element
                </button>
              </div>
            </div>
          )}
          
          {activeTool !== 'select' && (
            <div className="text-sm text-gray-500">
              Select an element to edit its properties
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-bold mb-3">Web3 Storage</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Version control:</span>
                <span className="font-mono">3 versions</span>
              </div>
              <div className="flex justify-between">
                <span>IPFS:</span>
                <a href="#" className="text-blue-500 truncate">ipfs://Qm...</a>
              </div>
              <button className="w-full mt-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 py-1.5 rounded text-sm">
                Save to Blockchain
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-bold mb-3">AI Assistant</h3>
            <div className="text-sm">
              <textarea 
                className="w-full border rounded p-2 mb-2 text-sm" 
                rows={3} 
                placeholder="Ask AI to modify your design..."
              ></textarea>
              <button className="w-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 py-1.5 rounded text-sm">
                Generate with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
